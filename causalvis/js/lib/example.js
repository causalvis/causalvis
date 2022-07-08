var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var React = require('react');
var ReactDOM = require('react-dom');
const e = React.createElement;

var dag = require('../../../lib/DAG.js');
var cohort = require('../../../lib/CohortEvaluator.js');
var teffect = require('../../../lib/TreatmentEffectEvaluator.js');

var lib = {...dag, ...cohort, ...teffect};

// See example.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var ReactModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'causalvis',
        _view_module : 'causalvis',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : {},
        props : {}
    })
});


// Custom View. Renders the widget model.
var ReactView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:value', this.value_changed, this);
    },

    value_changed: function() {
        var gm = this.model.get("value");
        var self = this;

        var props = this.model.get("props");

        console.log("in pip", this.model.attributes.component);

        // console.log(props);

        // console.log(this.model);

        // console.log(lib);

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }
});


module.exports = {
    ReactModel: ReactModel,
    ReactView: ReactView
};
