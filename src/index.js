import React, {Component} from 'react'
import {render} from 'react-dom'

import { DAG } from './DAG.js'

const Causalvis = () => {

  return <div>
    <h1 style={{"fontFamily":"sans-serif"}}>Causalvis</h1>
    <p style={{"fontFamily":"sans-serif"}}>This is a browser demo of the DAG module in the <a href="https://github.com/causalvis/causalvis">Causalvis Python package</a>. For more information about this work, please refer to <a href="https://dl.acm.org/doi/full/10.1145/3544548.3581236">our paper</a>.</p>
    <DAG />
  </div>
}

render(<Causalvis/>, document.querySelector('#app'))