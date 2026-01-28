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

			const centerX = 600;
			const centerY = 450;

			// Create central node at center
			await env.DB.prepare(
				'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
			).bind('cloudflare', 'central', 'Cloudflare', centerX, centerY, JSON.stringify({})).run();

			// Create product nodes in a circle around center
			const products = [
				{ id: 'workers', label: 'Workers', angle: -90 }, // top
				{ id: 'r2', label: 'R2', angle: 0 }, // right
				{ id: 'd1', label: 'D1', angle: 90 }, // bottom
				{ id: 'pages', label: 'Pages', angle: 180 }, // left
			];

			const productRadius = 250; // Increased from 200
			for (const product of products) {
				const angleRad = (product.angle * Math.PI) / 180;
				const x = centerX + productRadius * Math.cos(angleRad);
				const y = centerY + productRadius * Math.sin(angleRad);

				await env.DB.prepare(
					'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(product.id, 'product', product.label, x, y, JSON.stringify({})).run();

				await env.DB.prepare(
					'INSERT INTO edges (id, source, target, type) VALUES (?, ?, ?, ?)'
				).bind(`e-cf-${product.id}`, 'cloudflare', product.id, 'default').run();
			}

			// Create category nodes branching from products
			const categories = [
				// Workers categories (top) - wider angle spread
				{ id: 'workers-bugs', product: 'workers', label: 'Bugs', offsetAngle: -40 },
				{ id: 'workers-docs', product: 'workers', label: 'Docs', offsetAngle: 40 },
				// R2 categories (right)
				{ id: 'r2-bugs', product: 'r2', label: 'Bugs', offsetAngle: -40 },
				{ id: 'r2-features', product: 'r2', label: 'Feature Request', offsetAngle: 40 },
				// D1 categories (bottom)
				{ id: 'd1-bugs', product: 'd1', label: 'Bugs', offsetAngle: -40 },
				{ id: 'd1-features', product: 'd1', label: 'Feature Request', offsetAngle: 40 },
				// Pages categories (left)
				{ id: 'pages-bugs', product: 'pages', label: 'Bugs', offsetAngle: -40 },
				{ id: 'pages-features', product: 'pages', label: 'Feature Request', offsetAngle: 40 },
			];

			const categoryRadius = 180; // Increased from 140
			for (const category of categories) {
				const product = products.find(p => p.id === category.product)!;
				const baseAngleRad = (product.angle * Math.PI) / 180;
				const offsetAngleRad = (category.offsetAngle * Math.PI) / 180;
				const categoryAngleRad = baseAngleRad + offsetAngleRad;

				const productX = centerX + productRadius * Math.cos(baseAngleRad);
				const productY = centerY + productRadius * Math.sin(baseAngleRad);
				const x = productX + categoryRadius * Math.cos(categoryAngleRad);
				const y = productY + categoryRadius * Math.sin(categoryAngleRad);

				await env.DB.prepare(
					'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(category.id, 'category', category.label, x, y, JSON.stringify({})).run();

				await env.DB.prepare(
					'INSERT INTO edges (id, source, target, type) VALUES (?, ?, ?, ?)'
				).bind(`e-${category.product}-${category.id}`, category.product, category.id, 'default').run();
			}

			// Create sample tickets
			const tickets = [
				{ category: 'workers-bugs', title: 'API timeout after 30 seconds', description: 'Workers API calls timeout inconsistently' },
				{ category: 'workers-bugs', title: 'Fetch API timing out', description: 'External fetch requests fail with timeout error' },
			];

			const ticketRadius = 150; // Increased from 120
			let ticketCount = 0;
			for (const ticket of tickets) {
				const ticketId = `ticket-${ticketCount++}`;
				const nodeId = `${ticket.category}-${ticketId}`;

				// Find category and its product
				const category = categories.find(c => c.id === ticket.category)!;
				const product = products.find(p => p.id === category.product)!;

				// Calculate category position
				const baseAngleRad = (product.angle * Math.PI) / 180;
				const offsetAngleRad = (category.offsetAngle * Math.PI) / 180;
				const categoryAngleRad = baseAngleRad + offsetAngleRad;
				const productX = centerX + productRadius * Math.cos(baseAngleRad);
				const productY = centerY + productRadius * Math.sin(baseAngleRad);
				const categoryX = productX + categoryRadius * Math.cos(categoryAngleRad);
				const categoryY = productY + categoryRadius * Math.sin(categoryAngleRad);

				// Position tickets in a small arc around the category
				const ticketOffsetAngle = ticketId === 'ticket-0' ? -20 : 20;
				const ticketAngleRad = categoryAngleRad + (ticketOffsetAngle * Math.PI) / 180;
				const x = categoryX + ticketRadius * Math.cos(ticketAngleRad);
				const y = categoryY + ticketRadius * Math.sin(ticketAngleRad);

				// Mark second ticket as duplicate
				const metadata: any = {};
				if (ticketId === 'ticket-1') {
					metadata.duplicateOf = 'workers-bugs-ticket-0';
					metadata.duplicateScore = 0.94;
				}

				await env.DB.prepare(
					'INSERT INTO nodes (id, type, label, x, y, metadata) VALUES (?, ?, ?, ?, ?, ?)'
				).bind(nodeId, 'ticket', ticket.title, x, y, JSON.stringify(metadata)).run();

				await env.DB.prepare(
					'INSERT INTO edges (id, source, target, type) VALUES (?, ?, ?, ?)'
				).bind(`e-${ticket.category}-${nodeId}`, ticket.category, nodeId, 'default').run();

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
