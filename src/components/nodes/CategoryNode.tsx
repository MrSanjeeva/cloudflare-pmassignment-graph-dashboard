import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export default function CategoryNode({ data }: NodeProps) {
	return (
		<div className="node-category">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<div className="text-sm font-medium text-cyan-data uppercase">{data.label}</div>
			<Handle type="source" position={Position.Bottom} className="opacity-0" />
		</div>
	);
}
