import React, { Component } from 'react';

export default function Info(props) {
	return (
		<div>
			<p>Generations: {props.gens}</p>
		</div>
	); 
}