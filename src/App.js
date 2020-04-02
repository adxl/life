import React from 'react';
import Navbar from './components/Navbar';
import Board from './components/Board';

function App() {
	return (
		<React.Fragment>
			<Navbar />
			<main className="container mt-4">
				<Board />
			</main>
		</React.Fragment>
	);
}

export default App;
