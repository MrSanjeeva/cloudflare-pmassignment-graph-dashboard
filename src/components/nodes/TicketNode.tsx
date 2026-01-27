import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function TicketNode({ data }: NodeProps) {
	return (
		<div className="node-ticket">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<div className="flex flex-col">
				<div className="text-xs font-medium text-neon-violet">{data.label}</div>
				{data.origin && (
					<div className="text-[10px] text-hologram-white/50 mt-1">{data.origin}</div>
				)}
			</div>
		</div>
	);
}
