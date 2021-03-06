import React,{ Component } from 'react';
import p5 from 'p5';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

export default class Board extends Component{

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	state = {
		width: 400,
		height: 400,
		gens : 0,
		gensLimit: 0,
		cellsAlive: '-',
		forceStop: true,
		smooth: false,
		shape : 'squares'
	}

	launch = () => {
		const { gensLimit } = this.state;
		if(gensLimit >= 0) {
			if(this.p5Canvas !== undefined)
				this.p5Canvas.remove();
			this.p5Canvas = new p5(this.sketch,this.pRef.current);
		}
	}

	stop = () => {
		if (this.p5Canvas !== undefined)
			this.p5Canvas.noLoop();
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

	handleInputChange = event => {
		this.setState({ gensLimit: event.target.value });
	}

	handleForceStopCheck = event => {
		this.setState({forceStop: event.target.checked});
	}
	
	handleSmoothCheck = event => {
		this.setState({smooth : event.target.checked});
	}

	handleSizeChange = event => {
		// console.log(event.target.value);
		if(event.target.id === 'w')
			this.setState({ width: event.target.value });
		else this.setState({ height: event.target.value});
	}
	
	handleShapeChange = event => {
		this.setState({shape : event.target.id});
		
	}

	/**/

	sketch = (p) => {

		let loopTimer = this.state.gensLimit;
		
		const stopIfStuck = this.state.forceStop;
		const shape = this.state.shape;

		let alpha = 255;

		const width = this.state.width;
		const height = this.state.height;
		
		let terrain;
		let previousTerrain;
		let elderTerrain;

		const rows = Math.floor(width / 10);
		const cols = Math.floor(height / 10);

		p.setup = () => {

			this.reset();
			p.createCanvas(width,height);
			
			terrain = createTerrain();
			terrain = generateTerrain(terrain);

			if (this.state.smooth)
				alpha = 5;

			p.background(200,alpha);
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
			let cellsAlive = 0;
			for (let i = 0; i < rows; i++)
				for (let j = 0; j < cols; j++) {
					if (terrain[i][j]) {
						cellsAlive++;
						p.fill(50);
						p.stroke(255);
						if (shape === 'squares') {
							p.rect(i * 10,j * 10,10,10);
						}
						else {
							p.ellipse(i * 10,j * 10,10,10);
						}
					}
					else {
						p.fill(200,alpha);
						if (shape === 'squares') {
							p.rect(i * 10,j * 10,10,10);
						}
						else {
							p.ellipse(i * 10,j * 10,10,10);
						}
					}
				}

			this.setState({cellsAlive});
			
			// force stop if stuck in an infinite loop
			if (stopIfStuck) {	
				if (JSON.stringify(terrain) === JSON.stringify(elderTerrain)) {
					if(this.state.smooth)
						cleanCanvas();
					
					p.noLoop();
					console.log('Forced end.');	
				}
			}
			
			elderTerrain = previousTerrain;
			previousTerrain = terrain;
			terrain = computeNextGeneration();

			// add a new generation
			this.incrementGenerations();
					
			// run draw() 'n=loopTimer' times
			
			loopTimer--;
			
			if (loopTimer === 0) {
				if(this.state.smooth)
					cleanCanvas();
				
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
					if (isDead && neighbors === 3) {
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

		function cleanCanvas() {
			for (let i = 0; i < rows; i++)
				for (let j = 0; j < cols; j++) 
					if (terrain[i][j]) {
						p.fill(50);
						p.stroke(255);
						if (shape === 'squares') {
							p.rect(i * 10,j * 10,10,10);
						}
						else {
							p.ellipse(i * 10,j * 10,10,10);
						}
					}
					else {
						p.fill(200);
						if (shape === 'squares') {
							p.rect(i * 10,j * 10,10,10);
						}
						else {
							p.ellipse(i * 10,j * 10,10,10);
						}
					}
		}
	}
	
	render() {
		return (
			<div className="content">
				<div className="info" >					
					<div className="fields">
						<label className="text-dark mt-4 tt-container" >Width</label><br />
						<span className="tt-info">Set the canvas width</span>
						<input type="number" min="100" step="100" id="w" onChange={this.handleSizeChange} value={this.state.width} /><br />
					
						<label className="text-dark mt-2 tt-container" >Height</label><br />
						<span className="tt-info">Set the canvas height</span>
						<input type="number" min="100"  step="100" id="h" onChange={this.handleSizeChange} value={this.state.height} /><br/>

						<hr/>

						<label className="text-dark mt-1 tt-container" >Generations limit  <FontAwesomeIcon icon={faQuestionCircle}/></label><br/>
						<span className="tt-info">Set max number of generations (0 infinite)</span>
						<input type="number" className="mr-2" onChange={this.handleInputChange} value={this.state.gensLimit} min="0" /><br />
					</div>

					<div className="checkbox  mt-3">
						<input type="checkbox" onChange={this.handleForceStopCheck} checked={this.state.forceStop} />
						<label className="text-dark ml-1 tt-container">Stop if unstable  <FontAwesomeIcon icon={faQuestionCircle}/></label><br />
						<span className="tt-info">Stop the simulation if future generations are similar</span>
					</div>
					<hr />
					
					<div className="shapes">
						<input type="radio" name="shape" id="squares" checked={this.state.shape === 'squares'} onChange={this.handleShapeChange} />
						<label className="text-dark ml-1 mr-2 tt-container">Squares</label>
						<span className="tt-info">Square-shaped cells</span>

						<input type="radio" name="shape" id="circles" checked={this.state.shape === 'circles'} onChange={this.handleShapeChange} />
						<label className="text-dark ml-1 tt-container">Circles</label><br />
						<span className="tt-info">Circle-shaped cells</span>

					</div>

					<div className="checkbox mt-2">
						<input type="checkbox" onChange={this.handleSmoothCheck} checked={this.state.smooth} />
						<label className="text-dark ml-1">Smooth simulation</label><br/>
					</div>

					<div className="buttons">
						<button onClick={this.launch} className="btn btn-success mr-2">Launch</button>
						<button onClick={this.stop} className="btn btn-danger">Stop</button>
					</div>
					
				</div>
				<div className="board-container">
					<div className="gen-counter">
						<span style={{fontSize:20}} className="badge badge-info mt-3 mb-2" >Generations: {this.state.gens}</span>
					</div>
					
					<div className="gen-counter">
						<span style={{fontSize:15}} className="badge badge-secondary mt-1 mb-2" >Cells: {this.state.cellsAlive}</span>
					</div>
					<hr/>
					<div ref={this.pRef} className="board">
					</div>
				</div>
			</div>
		);
	} 
  
}