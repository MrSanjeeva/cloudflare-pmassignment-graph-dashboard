import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function CentralNode({ data }: NodeProps) {
	return (
		<div className="node-central">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<div className="flex flex-col items-center">
				<div className="text-2xl font-bold uppercase tracking-mega text-core-reactor">
					{data.label}
				</div>
				<div className="text-xs text-hologram-white/60 mt-1">PLATFORM</div>
			</div>
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
		</div>
	);
}
