import React,{ Component } from 'react';
import Info from './Info';
import Canvas from './Canvas';

export default class Board extends Component{

	state = {
		gens: 0
	}
		
	incrementGenerations = () => {
		let gens = this.state.gens;
		gens++;
		this.setState({gens});
	}

	reset = () => {
		const gens = 0;
		this.setState({gens});
	}

	render() {
		return (
			<React.Fragment>
				<div>
					<Info gens={this.state.gens} />
				</div>
				<br></br>
				<div>
					<Canvas
						onReset={this.reset}
						onEvolve={this.incrementGenerations} />
				</div>
			</React.Fragment>
		);
	}
}