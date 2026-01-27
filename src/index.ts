/**
 * Cloudflare Graph Dashboard - Worker Entry Point
 * Serves the React application and provides API endpoints for graph data
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// API Routes
		if (url.pathname.startsWith('/api/')) {
			return handleAPI(url, request, env);
		}

		// Serve static assets or default to index.html for client-side routing
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<Env>;

async function handleAPI(url: URL, request: Request, env: Env): Promise<Response> {
	const headers = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
	};

	try {
		// GET /api/graph - Fetch all nodes and edges
		if (url.pathname === '/api/graph' && request.method === 'GET') {
			const { results: nodes } = await env.DB.prepare(
				'SELECT * FROM nodes'
			).all();
			const { results: edges } = await env.DB.prepare(
				'SELECT * FROM edges'
			).all();

			return new Response(
				JSON.stringify({ nodes, edges }),
				{ headers }
			);
		}

		// POST /api/nodes - Create a new node
		if (url.pathname === '/api/nodes' && request.method === 'POST') {
			const body: any = await request.json();
			const { id, type, label, x, y, metadata } = body;

			await env.DB.prepare(
				'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
			).bind(id, type, label, x, y, JSON.stringify(metadata || {})).run();

			return new Response(
				JSON.stringify({ success: true, id }),
				{ headers }
			);
		}

		// POST /api/tickets - Create a new ticket with AI processing
		if (url.pathname === '/api/tickets' && request.method === 'POST') {
			const body: any = await request.json();
			const { id, node_id, title, description } = body;

			// 1. Insert ticket into D1
			await env.DB.prepare(
				'INSERT INTO tickets (id, node_id, title, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
			).bind(id, node_id, title, description, 'open', Date.now()).run();

			// 2. Generate embedding
			const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
				text: `${title} ${description}`,
			});

			// 3. Store in Vectorize
			await env.VECTORIZE_INDEX.insert([
				{
					id,
					values: embedding.data[0],
					metadata: { node_id, title },
				},
			]);

			// 4. Query for duplicates
			const duplicates = await env.VECTORIZE_INDEX.query(embedding.data[0], {
				topK: 3,
				returnMetadata: true,
			});

			// 5. Use LLM to generate summary/tags
			const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
				messages: [
					{
						role: 'system',
						content: 'You are a technical support assistant. Classify the following issue and suggest tags.',
					},
					{
						role: 'user',
						content: `Title: ${title}\nDescription: ${description}`,
					},
				],
			});

			const aiSuggestions = {
				duplicates: duplicates.matches.filter((m) => m.id !== id).slice(0, 2),
				tags: ['Bug'], // Parse from LLM response in production
				summary: aiResponse.response || '',
			};

			// 6. Update ticket with AI suggestions
			await env.DB.prepare(
				'UPDATE tickets SET ai_suggestions = ? WHERE id = ?'
			).bind(JSON.stringify(aiSuggestions), id).run();

			return new Response(
				JSON.stringify({ success: true, id, aiSuggestions }),
				{ headers }
			);
		}

		return new Response('Not Found', { status: 404, headers });
	} catch (error: any) {
		return new Response(
			JSON.stringify({ error: error.message }),
			{ status: 500, headers }
		);
	}
}
