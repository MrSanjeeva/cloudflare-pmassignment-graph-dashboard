import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function CategoryNode({ data }: NodeProps) {
	const inFocusMode = data.inFocusMode || false;
	
	return (
		<div className="relative">
			{/* Target handles on all sides for incoming edges */}
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<Handle type="target" position={Position.Right} className="opacity-0" />
			<Handle type="target" position={Position.Bottom} className="opacity-0" />
			<Handle type="target" position={Position.Left} className="opacity-0" />
			{/* Source handles on all sides for outgoing edges */}
			<Handle type="source" position={Position.Top} className="opacity-0" />
			<Handle type="source" position={Position.Right} className="opacity-0" />
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
			<Handle type="source" position={Position.Left} className="opacity-0" />
			
			{inFocusMode ? (
				/* Rectangle node for focus mode */
				<div className="w-[120px] h-[50px] rounded-lg bg-glass-panel border-2 border-neon-violet flex items-center justify-center shadow-glow-violet">
					<span className="text-sm font-semibold text-neon-violet">{data.label}</span>
				</div>
			) : (
				/* Circular node for radial mode */
				<div className="w-[90px] h-[90px] rounded-full bg-glass-panel border-2 border-neon-violet flex items-center justify-center shadow-glow-violet">
					<span className="text-xs font-medium text-neon-violet">{data.label}</span>
				</div>
			)}
		</div>
	);
}
