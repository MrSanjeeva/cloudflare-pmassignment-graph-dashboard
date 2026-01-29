import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
	ReactFlow,
	Node,
	Edge,
	Controls,
	Background,
	useNodesState,
	useEdgesState,
	addEdge,
	Connection,
	BackgroundVariant,
	NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CentralNode from './nodes/CentralNode';
import ProductNode from './nodes/ProductNode';
import CategoryNode from './nodes/CategoryNode';
import TicketNode from './nodes/TicketNode';

const nodeTypes = {
	central: CentralNode,
	product: ProductNode,
	category: CategoryNode,
	ticket: TicketNode,
};

// Initial mock data
const initialNodes: Node[] = [
	{
		id: 'cloudflare',
		type: 'central',
		position: { x: 400, y: 250 },
		data: { label: 'Cloudflare' },
	},
	{
		id: 'workers',
		type: 'product',
		position: { x: 200, y: 100 },
		data: { label: 'Workers' },
	},
	{
		id: 'd1',
		type: 'product',
		position: { x: 600, y: 100 },
		data: { label: 'D1' },
	},
	{
		id: 'workers-bugs',
		type: 'category',
		position: { x: 50, y: 50 },
		data: { label: 'Bugs' },
	},
	{
		id: 'ticket-1',
		type: 'ticket',
		position: { x: 10, y: 10 },
		data: { label: 'API timeout issue', origin: 'Discord' },
	},
];

const initialEdges: Edge[] = [
	{ id: 'e1', source: 'cloudflare', target: 'workers', animated: true },
	{ id: 'e2', source: 'cloudflare', target: 'd1', animated: true },
	{ id: 'e3', source: 'workers', target: 'workers-bugs' },
	{ id: 'e4', source: 'workers-bugs', target: 'ticket-1' },
];

export default function GraphDashboard() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [focusedProduct, setFocusedProduct] = useState<string | null>(null);
	const [allNodes, setAllNodes] = useState<Node[]>([]);
	const [allEdges, setAllEdges] = useState<Edge[]>([]);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);

	// Fetch data from API on mount
	useEffect(() => {
		fetch('/api/graph')
			.then((res) => res.json())
			.then((data) => {
				// Transform  DB nodes to ReactFlow nodes
				const reactFlowNodes: Node[] = data.nodes.map((node: any) => ({
					id: node.id,
					type: node.type,
					position: { x: node.x, y: node.y },
					data: { label: node.label, ...JSON.parse(node.metadata || '{}') },
				}));

				// Transform DB edges to ReactFlow edges
				const reactFlowEdges: Edge[] = data.edges.map((edge: any) => ({
					id: edge.id,
					source: edge.source,
					target: edge.target,
					animated: edge.source === 'cloudflare', // Animate edges from central node
				}));

				setAllNodes(reactFlowNodes);
				setAllEdges(reactFlowEdges);
				setNodes(reactFlowNodes);
				setEdges(reactFlowEdges);
			})
			.catch((err) => console.error('Failed to load graph data:', err));
	}, [setNodes, setEdges]);

	// Handle node click for product focus mode
	const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
		if (node.type === 'product') {
			setFocusedProduct(node.id);
		}
	}, []);

	// Calculate tree layout for focused view
	const calculateTreeLayout = useCallback((productId: string, nodes: Node[], edges: Edge[]) => {
		const product = nodes.find(n => n.id === productId);
		if (!product) return { nodes: [], edges: [] };

		// Find categories connected to this product
		const categoryIds = edges
			.filter(e => e.source === productId)
			.map(e => e.target);
		const categories = nodes.filter(n => categoryIds.includes(n.id));

		// Find tickets connected to these categories
		const ticketIds = edges
			.filter(e => categoryIds.includes(e.source))
			.map(e => e.target);
		const tickets = nodes.filter(n => ticketIds.includes(n.id));

		// Position product at top center
		const layoutNodes: Node[] = [
			{ ...product, position: { x: 500, y: 150 }, data: { ...product.data, inFocusMode: true } }
		];

		// Position categories horizontally below product
		categories.forEach((cat, index) => {
			const xPos = index === 0 ? 250 : 750;
			layoutNodes.push({ ...cat, position: { x: xPos, y: 350 }, data: { ...cat.data, inFocusMode: true } });
		});

		// Position tickets below their categories
		categories.forEach((cat, catIndex) => {
			const categoryTickets = tickets.filter(t => 
				edges.some(e => e.source === cat.id && e.target === t.id)
			);
			
			const baseX = catIndex === 0 ? 250 : 750;
			const ticketCount = categoryTickets.length;
			const spacing = 120;
			const startX = baseX - ((ticketCount - 1) * spacing) / 2;

			categoryTickets.forEach((ticket, ticketIndex) => {
				layoutNodes.push({
					...ticket,
					position: { x: startX + ticketIndex * spacing, y: 550 },
					data: { ...ticket.data, inFocusMode: true }
				});
			});
		});

		// Filter edges to only show relevant connections
		const relevantNodeIds = layoutNodes.map(n => n.id);
		const layoutEdges = edges.filter(e => 
			relevantNodeIds.includes(e.source) && relevantNodeIds.includes(e.target)
		).map(e => ({
			...e,
			type: 'straight' // Use straight edges in focus mode
		}));

		return { nodes: layoutNodes, edges: layoutEdges };
	}, []);

	// Apply focus mode filtering
	useEffect(() => {
		if (focusedProduct && allNodes.length > 0) {
			const { nodes: focusedNodes, edges: focusedEdges } = calculateTreeLayout(
				focusedProduct,
				allNodes,
				allEdges
			);
			setNodes(focusedNodes);
			setEdges(focusedEdges);
		} else if (!focusedProduct && allNodes.length > 0) {
			setNodes(allNodes);
			setEdges(allEdges);
		}
	}, [focusedProduct, allNodes, allEdges, calculateTreeLayout, setNodes, setEdges]);

	return (
		<div className="h-screen w-screen flex flex-col">
			{/* Top HUD Bar */}
			<div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
				<div className="flex items-center gap-4">
					<div className="glass-panel px-6 py-3 rounded-lg">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-cyan-data animate-pulse" />
							<span className="text-sm font-mono uppercase tracking-mega text-cyan-data">
								LIVE
							</span>
						</div>
					</div>
					{focusedProduct && (
						<button
							onClick={() => setFocusedProduct(null)}
							className="glass-panel px-6 py-3 rounded-lg hover:bg-glass-panel/80 transition-colors cursor-pointer flex items-center gap-2"
						>
							<span className="text-hologram-white">←</span>
							<span className="text-sm text-hologram-white">Back to Full View</span>
						</button>
					)}
				</div>
				<div className="glass-panel px-6 py-3 rounded-lg">
					<input
						type="text"
						placeholder="Global Search"
						className="bg-transparent border-none outline-none text-hologram-white placeholder-hologram-white/50"
					/>
				</div>
			</div>

			{/* React Flow Canvas */}
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={onNodeClick}
				nodeTypes={nodeTypes}
				fitView
				className="bg-void-black"
			>
				<Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
				<Controls className="glass-panel" />
			</ReactFlow>
		</div>
	);
}
