import React from 'react';
import Navbar from './components/Navbar';

import './App.css';
import Board from './components/Board';

function App() {
	return (
		<React.Fragment>
			<Navbar />
			<main className="container">
				<Board />
			</main>
		</React.Fragment>
	);
}

export default App;
