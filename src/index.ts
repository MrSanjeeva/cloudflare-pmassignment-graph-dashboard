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

		// POST /api/seed - Populate database with mock data
		if (url.pathname === '/api/seed' && request.method === 'POST') {
			// Clear existing data
			await env.DB.prepare('DELETE FROM tickets').run();
			await env.DB.prepare('DELETE FROM edges').run();
			await env.DB.prepare('DELETE FROM nodes').run();

			// Create central node
			await env.DB.prepare(
				'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
			).bind('cloudflare', 'central', 'Cloudflare', 400, 300, JSON.stringify({})).run();

			// Create product nodes
			const products = [
				{ id: 'workers', label: 'Workers', x: 150, y: 100 },
				{ id: 'pages', label: 'Pages', x: 650, y: 100 },
				{ id: 'd1', label: 'D1', x: 150, y: 500 },
				{ id: 'r2', label: 'R2', x: 650, y: 500 },
			];

			for (const product of products) {
				await env.DB.prepare(
					'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(product.id, 'product', product.label, product.x, product.y, JSON.stringify({})).run();

				await env.DB.prepare(
					'INSERT INTO edges (id, source, target, type) VALUES (?, ?, ?, ?)'
				).bind(`e-cf-${product.id}`, 'cloudflare', product.id, 'default').run();
			}

			// Create category nodes
			const categories = [
				{ id: 'workers-bugs', product: 'workers', label: 'Bugs', x: 50, y: 50 },
				{ id: 'workers-docs', product: 'workers', label: 'Docs', x: 250, y: 50 },
				{ id: 'pages-bugs', product: 'pages', label: 'Bugs', x: 550, y: 50 },
				{ id: 'pages-features', product: 'pages', label: 'Features', x: 750, y: 50 },
				{ id: 'd1-bugs', product: 'd1', label: 'Bugs', x: 50, y: 550 },
				{ id: 'd1-features', product: 'd1', label: 'Features', x: 250, y: 550 },
			];

			for (const category of categories) {
				await env.DB.prepare(
					'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(category.id, 'category', category.label, category.x, category.y, JSON.stringify({})).run();

				await env.DB.prepare(
					'INSERT INTO edges (id, source, target, type) VALUES (?, ?, ?, ?)'
				).bind(`e-${category.product}-${category.id}`, category.product, category.id, 'default').run();
			}

			// Create sample tickets
			const tickets = [
				{ category: 'workers-bugs', title: 'API timeout after 30 seconds', description: 'Workers API calls timeout inconsistently', origin: 'Discord' },
				{ category: 'workers-bugs', title: 'Fetch API timing out', description: 'External fetch requests fail with timeout error', origin: 'GitHub' },
				{ category: 'workers-docs', title: 'Missing KV examples', description: 'Need more examples for Workers KV usage', origin: 'Community' },
				{ category: 'pages-bugs', title: 'Build fails on deployment', description: 'React build step fails during Pages deployment', origin: 'GitHub' },
				{ category: 'pages-features', title: 'Add Svelte support', description: 'Request for first-class Svelte framework support', origin: 'Discord' },
				{ category: 'pages-features', title: 'Custom build commands', description: 'Allow custom build scripts in Pages config', origin: 'Community' },
				{ category: 'd1-bugs', title: 'Connection pool exhausted', description: 'D1 database runs out of connections under load', origin: 'GitHub' },
				{ category: 'd1-bugs', title: 'Query timeout on large tables', description: 'SELECT queries timeout on tables with 100k+ rows', origin: 'Discord' },
				{ category: 'd1-features', title: 'Support for triggers', description: 'Add SQL trigger support to D1', origin: 'Community' },
				{ category: 'd1-features', title: 'Full-text search', description: 'Add FTS5 full-text search capabilities', origin: 'GitHub' },
			];

			let ticketCount = 0;
			for (const ticket of tickets) {
				const ticketId = `ticket-${ticketCount++}`;
				const nodeId = `${ticket.category}-${ticketId}`;

				// Insert ticket node
				await env.DB.prepare(
					'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(
					nodeId,
					'ticket',
					ticket.title,
					Math.random() * 800,
					Math.random() * 600,
					JSON.stringify({ origin: ticket.origin })
				).run();

				// Insert edge
				await env.DB.prepare(
					'INSERT INTO edges (id, source, target, type) VALUES (?, ?, ?, ?)'
				).bind(`e-${ticket.category}-${nodeId}`, ticket.category, nodeId, 'default').run();

				// Insert ticket record
				await env.DB.prepare(
					'INSERT INTO tickets (id, node_id, title, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(ticketId, nodeId, ticket.title, ticket.description, 'open', Date.now()).run();
			}

			return new Response(
				JSON.stringify({ success: true, message: 'Mock data created', counts: { products: products.length, categories: categories.length, tickets: tickets.length } }),
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
