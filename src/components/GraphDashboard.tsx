import React, { useCallback, useState, useEffect } from 'react';
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

				setNodes(reactFlowNodes);
				setEdges(reactFlowEdges);
			})
			.catch((err) => console.error('Failed to load graph data:', err));
	}, [setNodes, setEdges]);

	return (
		<div className="h-screen w-screen flex flex-col">
			{/* Top HUD Bar */}
			<div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
				<div className="glass-panel px-6 py-3 rounded-lg">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-cyan-data animate-pulse" />
						<span className="text-sm font-mono uppercase tracking-mega text-cyan-data">
							LIVE
						</span>
					</div>
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
