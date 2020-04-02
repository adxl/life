import React, { Component } from 'react';
import p5 from 'p5';

export default class Canvas extends Component{

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	sketch = (p) => {

		let loopTimer = 200;

		p.setup = () => {
			p.createCanvas(200, 200);
			
		};
   
		p.draw = () => {
		
			p.background(0);
			p.fill(255);
			p.rect(20, loopTimer, 50, 50);
			
			loopTimer = (loopTimer + 1) % 200;

			if (loopTimer === 0) {
				p.noLoop();
				console.log('End.');
			
			}
		};
	}

	componentDidMount() {
		this.p5Canvas = new p5(this.sketch, this.pRef.current);
	}

	render() {
		return (
			<div ref={this.pRef}>
			</div>
		);
	} 
  
}