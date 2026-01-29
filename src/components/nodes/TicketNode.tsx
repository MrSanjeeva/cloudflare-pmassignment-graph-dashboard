import React from 'react';
import { Handle, Position } from 'reactflow';

export default function TicketNode({ data }: { data: any }) {
	const isDuplicate = data.duplicateOf && data.duplicateScore;
	const confidencePercent = isDuplicate ? Math.round(data.duplicateScore * 100) : 0;
	const inFocusMode = data.inFocusMode || false;

	return (
		<div className="relative">
			{/* Target handles on all sides for incoming edges */}
			<Handle type="target" position={Position.Top} className="opacity-0" />
			<Handle type="target" position={Position.Right} className="opacity-0" />
			<Handle type="target" position={Position.Bottom} className="opacity-0" />
			<Handle type="target" position={Position.Left} className="opacity-0" />
			
			{inFocusMode ? (
				/* Rectangle node for focus mode */
				<div className="w-[110px] h-[70px] rounded-lg bg-glass-panel border-2 border-cyan-data flex items-center justify-center shadow-glow-cyan">
					<div className="text-center px-2">
						<div className="text-[10px] font-medium leading-tight">
							{/* Title in cyan */}
							<div className="text-cyan-data">{data.label}</div>
							{/* Duplicate indicator in red below title */}
							{isDuplicate && (
								<div className="text-red-500 font-bold mt-1 text-[9px]">
									[Dup {confidencePercent}%]
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				/* Circular node for radial mode */
				<div className="w-[95px] h-[95px] rounded-full bg-glass-panel border-2 border-cyan-data flex items-center justify-center shadow-glow-cyan">
					<div className="text-center px-2">
						<div className="text-[11px] font-medium leading-tight">
							{/* Title in cyan */}
							<div className="text-cyan-data">{data.label}</div>
							{/* Duplicate indicator in red below title */}
							{isDuplicate && (
								<div className="text-red-500 font-bold mt-1">
									[Duplicate ({confidencePercent}%)]
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
