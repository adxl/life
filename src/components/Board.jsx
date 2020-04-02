import React, { Component } from 'react';
import Info from './Info';

export default class Board extends Component{

state = {
	gens: 0
}
	
render() {
	return (
		<div>
			<Info gens={this.state.gens}/>
		</div>
	);
}
}