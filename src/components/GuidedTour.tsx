import React, { useState, useEffect } from 'react';

interface TourStep {
	target?: string;
	title: string;
	content: string;
	position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface GuidedTourProps {
	onComplete: () => void;
	onSkip: () => void;
}

const tourSteps: TourStep[] = [
	{
		title: 'Welcome to Cloudflare Graph Dashboard!',
		content: "Let's take a quick tour to show you how to visualize and manage product issues. You can skip this tour anytime.",
		position: 'center',
	},
	{
		target: '.react-flow__viewport',
		title: 'Radial View',
		content: 'This is the radial view where products radiate from the center. Categories and tickets branch outward in a hierarchical structure.',
		position: 'center',
	},
	{
		target: '.react-flow__node-product',
		title: 'Product Nodes',
		content: 'Click on any product node (Workers, R2, D1, or Pages) to enter Focus Mode and see a tree view of its issues.',
		position: 'bottom',
	},
	{
		title: 'Focus Mode',
		content: 'In Focus Mode, nodes become rectangles with straight edges for a cleaner hierarchical view. Use "Back to Full View" to return.',
		position: 'center',
	},
	{
		target: '.react-flow__node-ticket',
		title: 'Ticket Nodes',
		content: 'Tickets are shown in cyan. Some display duplicate badges (in red) detected by AI similarity search.',
		position: 'bottom',
	},
	{
		title: 'Ticket Details',
		content: 'Click any ticket to open the detail panel with AI-generated descriptions, suggested fixes, and action buttons for JIRA/Slack integration.',
		position: 'center',
	},
	{
		title: 'AI-Powered Insights',
		content: 'Our AI analyzes each ticket, generates descriptions and fixes, and automatically detects duplicates using semantic similarity.',
		position: 'center',
	},
	{
		title: "You're All Set!",
		content: 'Explore the dashboard to discover insights from Cloudflare product feedback. Click the help icon (?) anytime to replay this tour.',
		position: 'center',
	},
];

export default function GuidedTour({ onComplete, onSkip }: GuidedTourProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

	const currentTourStep = tourSteps[currentStep];
	const isLastStep = currentStep === tourSteps.length - 1;

	useEffect(() => {
		if (currentTourStep.target) {
			// Find target element
			const element = document.querySelector(currentTourStep.target) as HTMLElement;
			setTargetElement(element);
		} else {
			setTargetElement(null);
		}
	}, [currentStep, currentTourStep.target]);

	const handleNext = () => {
		if (isLastStep) {
			onComplete();
		} else {
			setCurrentStep(prev => prev + 1);
		}
	};

	const handleSkip = () => {
		onSkip();
	};

	const getTooltipPosition = () => {
		if (!targetElement || currentTourStep.position === 'center') {
			return {
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			};
		}

		const rect = targetElement.getBoundingClientRect();
		const position = currentTourStep.position || 'bottom';

		switch (position) {
			case 'top':
				return {
					top: `${rect.top - 20}px`,
					left: `${rect.left + rect.width / 2}px`,
					transform: 'translate(-50%, -100%)',
				};
			case 'bottom':
				return {
					top: `${rect.bottom + 20}px`,
					left: `${rect.left + rect.width / 2}px`,
					transform: 'translate(-50%, 0)',
				};
			case 'left':
				return {
					top: `${rect.top + rect.height / 2}px`,
					left: `${rect.left - 20}px`,
					transform: 'translate(-100%, -50%)',
				};
			case 'right':
				return {
					top: `${rect.top + rect.height / 2}px`,
					left: `${rect.right + 20}px`,
					transform: 'translate(0, -50%)',
				};
			default:
				return {
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				};
		}
	};

	const getSpotlightStyle = () => {
		if (!targetElement) return {};

		const rect = targetElement.getBoundingClientRect();
		return {
			top: `${rect.top - 8}px`,
			left: `${rect.left - 8}px`,
			width: `${rect.width + 16}px`,
			height: `${rect.height + 16}px`,
		};
	};

	return (
		<div className="tour-container">
			{/* Dark overlay */}
			<div className="tour-overlay" onClick={handleSkip} />

			{/* Spotlight on target element */}
			{targetElement && (
				<div className="tour-spotlight" style={getSpotlightStyle()} />
			)}

			{/* Tooltip */}
			<div className="tour-tooltip" style={getTooltipPosition()}>
				{/* Progress indicator */}
				<div className="tour-progress">
					Step {currentStep + 1} of {tourSteps.length}
				</div>

				{/* Title */}
				<h3 className="tour-title">{currentTourStep.title}</h3>

				{/* Content */}
				<p className="tour-content">{currentTourStep.content}</p>

				{/* Actions */}
				<div className="tour-actions">
					<button onClick={handleSkip} className="tour-btn tour-btn-skip">
						Skip Tour
					</button>
					<button onClick={handleNext} className="tour-btn tour-btn-next">
						{isLastStep ? 'Got it!' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	);
}
