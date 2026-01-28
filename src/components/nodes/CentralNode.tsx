import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function CentralNode({ data }: NodeProps) {
	return (
		<div className="relative">
			<Handle type="source" position={Position.Top} className="opacity-0" />
			<Handle type="source" position={Position.Right} className="opacity-0" />
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
			<Handle type="source" position={Position.Left} className="opacity-0" />
			{/* Large circular node */}
			<div className="w-[140px] h-[140px] rounded-full bg-glass-panel border-2 border-core-reactor flex items-center justify-center shadow-glow-red">
				<div className="text-center">
					<div className="text-lg font-bold text-core-reactor">{data.label}</div>
					{data.subtitle && (
						<div className="text-xs text-solar-flare/70 mt-1">{data.subtitle}</div>
					)}
				</div>
			</div>
		</div>
	);
}
