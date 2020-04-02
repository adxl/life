import React, { Component } from 'react';
import p5 from 'p5';

export default class Canvas extends Component{

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	sketch = (p) => {

		let loopTimer = 20;

		let terrain;
		let width = 200;
		let height = 200;

		let rows = height / 10;
		let cols = width / 10;

		p.setup = () => {
			p.createCanvas(width, height);
			
		};
   
		p.draw = () => {
		

			p.background(0);

		
			

			// add a new generation
			this.props.onEvolve();
					
			// run draw() 'n=loopTimer' times
			loopTimer--;
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