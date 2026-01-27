import React from 'react';
import ReactDOM from 'react-dom/client';
import GraphDashboard from './components/GraphDashboard';
import './styles.css';

const root = document.getElementById('root');
if (root) {
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<GraphDashboard />
		</React.StrictMode>
	);
}
