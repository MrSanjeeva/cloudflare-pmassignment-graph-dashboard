import React from 'react';

interface TicketDetailPanelProps {
	ticket: any;
	onClose: () => void;
}

export default function TicketDetailPanel({ ticket, onClose }: TicketDetailPanelProps) {
	const isDuplicate = ticket.duplicateOf && ticket.duplicateScore;
	const confidencePercent = isDuplicate ? Math.round(ticket.duplicateScore * 100) : 0;
	
	// Extract metadata from ticket
	const severity = ticket.severity || 'medium';
	const status = ticket.status || 'open';
	const origin = ticket.origin || 'Unknown';
	const category = ticket.category || 'Unknown';
	const description = ticket.description || 'No description available.';
	const suggestedFix = ticket.suggestedFix || 'No suggested fix available.';
	const createdAt = ticket.createdAt || new Date().toISOString();
	
	// Severity color mapping
	const severityColors: Record<string, string> = {
		critical: 'bg-red-500 text-white',
		high: 'bg-orange-500 text-white',
		medium: 'bg-yellow-500 text-black',
		low: 'bg-cyan-data text-black'
	};
	
	// Status color mapping
	const statusColors: Record<string, string> = {
		open: 'bg-red-500',
		'in-progress': 'bg-yellow-500',
		resolved: 'bg-green-500'
	};

	return (
		<div className="fixed right-0 top-0 h-screen w-[600px] bg-glass-panel border-l-2 border-cyan-data shadow-2xl z-50 overflow-y-auto animate-slide-in">
			{/* Header */}
			<div className="sticky top-0 bg-void-black border-b border-cyan-data/30 p-6 z-10">
				<div className="flex justify-between items-start mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-sm text-hologram-white/60 font-mono">#{ticket.id || 'N/A'}</span>
							{isDuplicate && (
								<span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-500 border border-red-500/50">
									Duplicate ({confidencePercent}%)
								</span>
							)}
						</div>
						<h2 className="text-2xl font-bold text-hologram-white mb-4">{ticket.label}</h2>
					</div>
					<button
						onClick={onClose}
						className="text-hologram-white/60 hover:text-hologram-white transition-colors p-2"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				
				{/* Action Buttons */}
				<div className="flex gap-2 flex-wrap">
					<button className="px-4 py-2 bg-glass-panel border border-cyan-data/50 rounded text-sm text-cyan-data hover:bg-cyan-data/10 transition-colors flex items-center gap-2">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Create JIRA Ticket
					</button>
					<button className="px-4 py-2 bg-glass-panel border border-cyan-data/50 rounded text-sm text-cyan-data hover:bg-cyan-data/10 transition-colors flex items-center gap-2">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
						Post on Slack
					</button>
					<button className="px-4 py-2 bg-glass-panel border border-cyan-data/50 rounded text-sm text-cyan-data hover:bg-cyan-data/10 transition-colors flex items-center gap-2">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
						</svg>
						Share
					</button>
					<button className="px-4 py-2 bg-glass-panel border border-cyan-data/50 rounded text-sm text-cyan-data hover:bg-cyan-data/10 transition-colors">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
						</svg>
					</button>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex">
				{/* Main Content */}
				<div className="flex-1 p-6">
					{/* Description */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-cyan-data mb-3">Overview</h3>
						<p className="text-hologram-white/80 leading-relaxed">{description}</p>
					</div>

					{/* Suggested Fix */}
					{suggestedFix && suggestedFix !== 'No suggested fix available.' && (
						<div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
								<h3 className="text-lg font-semibold text-yellow-500">Suggested Fix</h3>
							</div>
							<p className="text-hologram-white/80 leading-relaxed">{suggestedFix}</p>
						</div>
					)}
				</div>

				{/* Metadata Sidebar */}
				<div className="w-[200px] bg-void-black/50 border-l border-cyan-data/30 p-6 space-y-4">
					{/* Status */}
					<div>
						<div className="text-xs text-hologram-white/60 mb-1">Status</div>
						<div className="flex items-center gap-2">
							<div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
							<span className="text-sm text-hologram-white capitalize">{status}</span>
						</div>
					</div>

					{/* Severity */}
					<div>
						<div className="text-xs text-hologram-white/60 mb-1">Severity</div>
						<span className={`text-xs px-2 py-1 rounded font-semibold ${severityColors[severity]}`}>
							{severity.toUpperCase()}
						</span>
					</div>

					{/* Origin */}
					<div>
						<div className="text-xs text-hologram-white/60 mb-1">Origin</div>
						<span className="text-sm text-hologram-white">{origin}</span>
					</div>

					{/* Category */}
					<div>
						<div className="text-xs text-hologram-white/60 mb-1">Category</div>
						<span className="text-sm text-neon-violet capitalize">{category.split('-').pop()}</span>
					</div>

					{/* Created */}
					<div>
						<div className="text-xs text-hologram-white/60 mb-1">Created</div>
						<span className="text-sm text-hologram-white">
							{new Date(createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
