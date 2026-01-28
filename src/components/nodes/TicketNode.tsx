import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TicketNode({ data }: { data: any }) {
	const isDuplicate = data.duplicateOf && data.duplicateScore;
	const confidencePercent = isDuplicate ? Math.round(data.duplicateScore * 100) : 0;

	return (
		<div className="relative">
			<Handle type="target" position={Position.Top} className="opacity-0" />
			{/* Small circular node for tickets */}
			<div className="w-[95px] h-[95px] rounded-full bg-glass-panel border-2 border-neon-violet flex items-center justify-center shadow-glow-violet">
				<div className="text-center px-2">
					<div className="text-[11px] font-medium leading-tight">
						{/* Title in violet */}
						<div className="text-neon-violet">{data.label}</div>
						{/* Duplicate indicator in red below title */}
						{isDuplicate && (
							<div className="text-red-500 font-bold mt-1">
								[Duplicate ({confidencePercent}%)]
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
