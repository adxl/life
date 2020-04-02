import React, { Component } from 'react';

export default function Info(props) {

	return (
		<div>
			<span style={{fontSize:30}} className="badge badge-info mt-3" >Generations: {props.gens}</span>
		</div>
	);
	
}