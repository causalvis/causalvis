var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');

var React = require('react');
var ReactDOM = require('react-dom');
const e = React.createElement;

var dag = require('../../../lib/DAG.js');
var cohort = require('../../../lib/CohortEvaluator.js');
var teffect = require('../../../lib/TreatmentEffectEvaluator.js');
var versions = require('../../../lib/VersionHistory.js');

var lib = {...dag, ...cohort, ...teffect, ...versions};

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
        this.model.on('change:props', this.value_changed, this);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = '_hidden';
        this.input.style.display = 'none';
        this.input.value = this.model.get('value');
        this.input.oninput = this.input_changed.bind(this);

        this.el.appendChild(this.input);
    },

    value_changed: function() {
        var props = this.model.get("props");

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    },

    input_changed: function() {
        console.log(this.input.value)
        this.model.set('value', this.input.value);
        this.model.save_changes();
    },
});

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
var DAGModel = widgets.DOMWidgetModel.extend({
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
var DAGView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);

        this.inputDAG = document.createElement('input');
        this.inputDAG.type = 'text';
        this.inputDAG.id = '_hiddenDAG';
        this.inputDAG.style.display = 'none';
        this.inputDAG.value = this.model.get('value');
        this.inputDAG.oninput = this.dag_changed.bind(this);

        this.el.appendChild(this.inputDAG);
    },

    value_changed: function() {
        var props = this.model.get("props");

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    },

    dag_changed: function() {
        console.log("widget", this.inputDAG.value)
        this.model.set('DAG', JSON.parse(this.inputDAG.value));
        this.model.save_changes();
    },
});


module.exports = {
    ReactModel: ReactModel,
    ReactView: ReactView,
    DAGModel: DAGModel,
    DAGView: DAGView
};
