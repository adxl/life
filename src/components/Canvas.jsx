import React,{ Component } from 'react';
import p5 from 'p5';

export default class Canvas extends Component{

	constructor(props) {
		super(props);
		this.pRef = React.createRef();
	}

	state = {
		width: 100,
		height: 100,
		gensLimit: 0,
		forceStop: false
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

	handleInputChange = event => {
		this.setState({ gensLimit: event.target.value });
	}

	handleCheck = event => {
		this.setState({forceStop: event.target.checked});
	} 

	handleWidthChange = event => {
		// console.log(event.target.value);
		this.setState({ width : event.target.value});	
	}

	handleHeightChange = event => {
		// console.log(event.target.value);
		this.setState({ height : event.target.value});
	}

	sketch = (p) => {

		let loopTimer = this.state.gensLimit;
		
		const stopIfStuck = this.state.forceStop;

		const width = this.state.width;
		const height = this.state.height;
		
		let terrain;
		let previousTerrain;
		let elderTerrain;

		const rows = width / 10;
		const cols = height / 10;

		p.setup = () => {

			this.props.onReset();
			p.createCanvas(width,height);
			
			terrain = createTerrain();
			terrain = generateTerrain(terrain);

			p.background(200);
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
						p.fill(50);
						p.stroke(255);
						p.rect(i * 10,j * 10,10,10);
					}
					else {
						p.fill(200);
						p.rect(i * 10,j * 10,10,10);
					}
				}

			// force stop if stuck in an infinite loop
			if (stopIfStuck) {	
				if (JSON.stringify(terrain) === JSON.stringify(elderTerrain)) {
					p.noLoop();
					console.log('Forced end.');	
				}
			}
			
			elderTerrain = previousTerrain;
			previousTerrain = terrain;
			terrain = computeNextGeneration();

			// add a new generation
			this.props.onEvolve();
					
			// run draw() 'n=loopTimer' times
			
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
	}

	render() {
		return (
			<React.Fragment>
				<div>
					
					<label className="text-dark" >Width</label><br />
					<input type="number" min="100" onChange={this.handleWidthChange} value={this.state.width} /><br />
					
					<label className="text-dark" >Height</label><br/>
					<input type="number" min="100" onChange={this.handleHeightChange} value={this.state.height} /><br/>
					
					<label className="text-dark" >Generation limit: (0 infinite)</label><br/>
					<input type="number" className="mr-2" onChange={this.handleInputChange} value={this.state.gensLimit} min="0"/><br/>
					<input type="checkbox" onChange={this.handleCheck}/>
					<label>Stop if stuck</label><br/>
					<button onClick={this.launch} className="btn btn-success mr-2">Launch</button>
					<button onClick={this.stop} className="btn btn-danger">Stop</button>
				</div>
				<hr/>
				<div ref={this.pRef}>
				</div>
			</React.Fragment>
		);
	} 
  
}