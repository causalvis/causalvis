import React, { Component } from 'react';
import { render } from 'react-dom';
import { DAG } from './DAG.js';
var Causalvis = function Causalvis() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      "fontFamily": "sans-serif"
    }
  }, "Causalvis"), /*#__PURE__*/React.createElement("p", {
    style: {
      "fontFamily": "sans-serif"
    }
  }, "This is a browser demo of the DAG module in the ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/causalvis/causalvis"
  }, "Causalvis Python package"), ". For more information about this work, please refer to ", /*#__PURE__*/React.createElement("a", {
    href: "https://dl.acm.org/doi/full/10.1145/3544548.3581236"
  }, "our paper"), "."), /*#__PURE__*/React.createElement(DAG, null));
};
render( /*#__PURE__*/React.createElement(Causalvis, null), document.querySelector('#app'));