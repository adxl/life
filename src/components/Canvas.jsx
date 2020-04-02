import React, { Component } from 'react';
import p5 from 'p5';

export default class Canvas extends Component{

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	state = {
		terrain: []
	}

	sketch = (p) => {

		let loopTimer = 10;

		let terrain;
		let width = 400;
		let height = 400;

		let rows = height / 10;
		let cols = width / 10;

		p.setup = () => {
			p.createCanvas(width,height);
			terrain = createTerrain();
			terrain = generateTerrain(terrain);

			this.setState( terrain);
		};
   
		function createTerrain() {
			let terrain = new Array(rows);
		
			for (let i = 0; i < rows; i++) 
				terrain[i] = new Array(cols);
			
			return terrain;
		}
		
		function generateTerrain(terrain) {
			for (let i = 0; i < rows; i++){
				terrain[i] = new Array(cols);
				for (let j = 0; j < cols; j++)
					terrain[i][j] = Math.random() < 0.5;
			}
			return terrain;
		}

		p.draw = () => {
		

			for (let i = 0; i < rows; i++)
				for (let j = 0; j < cols; j++) {
					if (terrain[i][j]) {
						p.fill(30);
						p.stroke(255);
						p.rect(i * 10,j * 10,10,10);
					}
					else {
						p.fill(255);
						p.stroke(255);
						p.rect(i * 10,j * 10,10,10);
					}
				}
		
			

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