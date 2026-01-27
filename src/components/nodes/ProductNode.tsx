import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function ProductNode({ data }: NodeProps) {
	return (
		<div className="node-product">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<div className="text-base font-semibold text-solar-flare uppercase">{data.label}</div>
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
		</div>
	);
}
