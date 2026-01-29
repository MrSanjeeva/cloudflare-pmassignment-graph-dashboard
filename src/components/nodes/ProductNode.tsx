import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function ProductNode({ data }: NodeProps) {
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
				<div className="w-[140px] h-[60px] rounded-lg bg-glass-panel border-2 border-solar-flare flex items-center justify-center shadow-glow-flare cursor-pointer hover:scale-105 transition-all duration-200">
					<span className="text-base font-bold text-solar-flare">{data.label}</span>
				</div>
			) : (
				/* Circular node for radial mode */
				<div className="w-[110px] h-[110px] rounded-full bg-glass-panel border-2 border-solar-flare flex items-center justify-center shadow-glow-flare cursor-pointer hover:scale-105 transition-all duration-200">
					<div className="text-center px-3">
						<div className="text-sm font-semibold text-solar-flare leading-tight">{data.label}</div>
					</div>
				</div>
			)}
		</div>
	);
}
