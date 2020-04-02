import React, { Component } from 'react';
import Info from './Info';
import Canvas from './Canvas';

export default class Board extends Component{

	state = {
		gens: 0
	}
		
	render() {
		return (
			<React.Fragment>
				<div>
					<Info gens={this.state.gens} />
				</div>
				<br></br>
				<div>
					<Canvas/>
				</div>
			</React.Fragment>
		);
	}
}