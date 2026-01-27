import React from 'react';
import ReactDOM from 'react-dom/client';
import GraphDashboard from './components/GraphDashboard';
import './styles.css';

export function renderApp() {
	const root = document.getElementById('root');
	if (!root) {
		console.error('Root element not found');
		return;
	}

	const reactRoot = ReactDOM.createRoot(root);
	reactRoot.render(
		<React.StrictMode>
			<GraphDashboard />
		</React.StrictMode>
	);
}
