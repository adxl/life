import React,{ Component } from 'react';
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

		let loopTimer = 100;
		let allowInfinite = false;

		let terrain;
		let width = 400;
		let height = 400;

		let rows = height / 10;
		let cols = width / 10;

		p.setup = () => {
			p.createCanvas(width,height);
			terrain = createTerrain();
			terrain = generateTerrain(terrain);

			this.setState(terrain);
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

			terrain = computeNextGeneration();
			
			// add a new generation
			this.props.onEvolve();
					
			// run draw() 'n=loopTimer' times
			if(!allowInfinite)
				loopTimer--;
			
			if (loopTimer === 0) {
				p.noLoop();
				console.log('End.');	
			}
		};

		function computeNextGeneration() {

			let next = createTerrain();

			for (let i = 0; i < rows; i++)
				for (let j = 0; j < cols; j++) {

					let isDead = !terrain[i][j];
					let neighbors = countNeighbors(i,j);

					// cell is dead and have 3 neighbors
					if (isDead && neighbors == 3) {
						next[i][j] = true;
					}

					// cell is alive 
					else if (!isDead && (neighbors < 2 || neighbors > 3)) {
						next[i][j] = false;
					}

					else {
						next[i][j] = terrain[i][j];
					}
				}

			return next;
		}
		
		function countNeighbors(x,y) {
			let neighbors = 0;

			for (let i = x - 1; i <= x + 1; i++)
				for (let j = y - 1; j <= y + 1; j++)
					if ((i >= 0 && i < rows) && (j >= 0 && j < cols) && terrain[i][j])
						neighbors++;

			neighbors -= terrain[x][y];
			return neighbors;
		}
	}

	componentDidMount() {
		this.p5Canvas = new p5(this.sketch,this.pRef.current);
	}

	render() {
		return (
			<div ref={this.pRef}>
			</div>
		);
	} 
  
}