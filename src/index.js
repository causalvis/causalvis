import React, {Component} from 'react'
import {render} from 'react-dom'

import { DAG } from './DAG.js'

const Causalvis = () => {

  return <div style={{"display": "flex", "flexDirection": "column", "alignItems": "center", "width": "100%", "fontFamily":"sans-serif"}}>
  	<div>
	    <h1>Causalvis</h1>
	    <p>This is a browser demo of the DAG module of the <a href="https://github.com/causalvis/causalvis">Causalvis Python package</a>. For more information about this work, please refer to <a href="https://dl.acm.org/doi/full/10.1145/3544548.3581236">our paper</a>.</p>
	    <DAG />
    	<h3>Usage</h3>
    	<p style={{"width": "1200px"}}>The main features of the DAG module are numbered in the image below. 1) The graph can be edited and viewed on the main canvas here. 2) Toggle buttons can be used to switch between node layout editing and link editing. 3) The Add Node button can be used to add nodes to the DAG. 4) The context menu of each variable can be accessed by pressing SHIFT + CLICK on a variable name. This will bring up options to set treatments and outcomes, edit tags, and delete variables from the visualization. 5) The DAG can be downloaded and saved as an image or <i>.json</i> file.</p>
    	<img style={{"width": "1200px"}} src="Figure_DAG.png" alt="Toggle Modes Button"></img>
    </div>
  </div>
}

render(<Causalvis/>, document.querySelector('#app'))