import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function CategoryNode({ data }: NodeProps) {
	return (
		<div className="relative">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
			<Handle type="source" position={Position.Left} className="opacity-0" />
			<Handle type="source" position={Position.Right} className="opacity-0" />
			{/* Small circular node */}
			<div className="w-[90px] h-[90px] rounded-full bg-glass-panel border-2 border-neon-violet flex items-center justify-center shadow-glow-violet">
				<div className="text-center px-2">
					<div className="text-xs font-medium text-neon-violet leading-tight">{data.label}</div>
				</div>
			</div>
		</div>
	);
}
