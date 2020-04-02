import React from 'react';

export default function Navbar() {
	const url = 'https://github.com/adxl/life';
	return (
		<div>
			<nav className="navbar navbar-dark bg-dark">
				<a className="navbar-brand" href={url}>Life</a>
			</nav>
		</div>
	);
}

