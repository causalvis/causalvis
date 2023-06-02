import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';

var React = require('react');
var ReactDOM = require('react-dom');
const e = React.createElement;

var dag = require('./lib/DAG.js');
var cohort = require('./lib/CohortEvaluator.js');
var teffect = require('./lib/TreatmentEffectExplorer.js');
var versions = require('./lib/VersionHistory.js');

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
export class ReactModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'causalvis',
        _view_module : 'causalvis',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : {},
        props : {}
      };
    }
}


// Custom View. Renders the widget model.
export class ReactView extends DOMWidgetView {
    render() {
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);

        // this.input = document.createElement('input');
        // this.input.type = 'text';
        // this.input.id = '_hidden';
        // this.input.style.display = 'none';
        // this.input.value = this.model.get('value');
        // this.input.oninput = this.input_changed.bind(this);

        // this.el.appendChild(this.input);
    }

    value_changed() {
        var props = this.model.get("props");

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }

    input_changed() {
        this.model.set('value', this.input.value);
        this.model.save_changes();
    }

}

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class DAGModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'causalvis',
        _view_module : 'causalvis',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
      };
    }
}

// Custom View. Renders the widget model.
export class DAGView extends DOMWidgetView {
    render() {
        // Render component
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);

        // Create input element to track changes in DAG
        this.inputDAG = document.createElement('input');
        this.inputDAG.type = 'text';
        this.inputDAG.id = `_hiddenDAG${this.model.model_id}`;
        this.inputDAG.style.display = 'none';
        this.inputDAG.value = this.model.get('DAG');
        this.inputDAG.oninput = this.dag_changed.bind(this);

        this.el.appendChild(this.inputDAG);

        // Create input element to track changes in colliders
        this.inputColliders = document.createElement('input');
        this.inputColliders.type = 'text';
        this.inputColliders.id = `_hiddenColliders${this.model.model_id}`;
        this.inputColliders.style.display = 'none';
        this.inputColliders.value = this.model.get('colliders');
        this.inputColliders.oninput = this.colliders_changed.bind(this);

        this.el.appendChild(this.inputColliders);

        // Create input element to track changes in mediators
        this.inputMediators = document.createElement('input');
        this.inputMediators.type = 'text';
        this.inputMediators.id = `_hiddenMediators${this.model.model_id}`;
        this.inputMediators.style.display = 'none';
        this.inputMediators.value = this.model.get('mediators');
        this.inputMediators.oninput = this.mediators_changed.bind(this);

        this.el.appendChild(this.inputMediators);

        // Create input element to track changes in confounds
        this.inputConfounds = document.createElement('input');
        this.inputConfounds.type = 'text';
        this.inputConfounds.id = `_hiddenConfounds${this.model.model_id}`;
        this.inputConfounds.style.display = 'none';
        this.inputConfounds.value = this.model.get('confounds');
        this.inputConfounds.oninput = this.confounds_changed.bind(this);

        this.el.appendChild(this.inputConfounds);

        // Create input element to track changes in prognostics
        this.inputPrognostics = document.createElement('input');
        this.inputPrognostics.type = 'text';
        this.inputPrognostics.id = `_hiddenPrognostics${this.model.model_id}`;
        this.inputPrognostics.style.display = 'none';
        this.inputPrognostics.value = this.model.get('prognostics');
        this.inputPrognostics.oninput = this.prognostics_changed.bind(this);

        this.el.appendChild(this.inputPrognostics);
    }

    value_changed() {
        var props = this.model.get("props");

        props = {...props,
                "_svg": `svgDAG${this.model.model_id}`,
                "_dag": `_hiddenDAG${this.model.model_id}`,
                "_colliders": `_hiddenColliders${this.model.model_id}`,
                "_mediators": `_hiddenMediators${this.model.model_id}`,
                "_confounds": `_hiddenConfounds${this.model.model_id}`,
                "_prognostics": `_hiddenPrognostics${this.model.model_id}`};

        // console.log(props, this);

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }

    dag_changed() {
        // console.log("widget", this.inputDAG.value)
        this.model.set('DAG', JSON.parse(this.inputDAG.value));
        this.model.save_changes();
    }

    colliders_changed() {
        this.model.set('colliders', JSON.parse(this.inputColliders.value));
        this.model.save_changes();
    }

    mediators_changed() {
        this.model.set('mediators', JSON.parse(this.inputMediators.value));
        this.model.save_changes();
    }

    confounds_changed() {
        this.model.set('confounds', JSON.parse(this.inputConfounds.value));
        this.model.save_changes();
    }

    prognostics_changed() {
        this.model.set('prognostics', JSON.parse(this.inputPrognostics.value));
        this.model.save_changes();
    }
}

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class CohortModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'causalvis',
        _view_module : 'causalvis',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
      };
    }
}

// Custom View. Renders the widget model.
export class CohortView extends DOMWidgetView {
    // Defines how the widget gets rendered into the DOM
    render() {
        // Render component
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);
        
        // Create input element to track changes in DAG
        this.inputSelection = document.createElement('input');
        this.inputSelection.type = 'text';
        this.inputSelection.id = `_hiddenSelection${this.model.model_id}`;
        this.inputSelection.style.display = 'none';
        this.inputSelection.value = this.model.get('selection');
        this.inputSelection.oninput = this.selection_changed.bind(this);

        this.el.appendChild(this.inputSelection);

        // Create input element to track changes in DAG
        this.inputInverseSelection = document.createElement('input');
        this.inputInverseSelection.type = 'text';
        this.inputInverseSelection.id = `_hiddenInverseSelection${this.model.model_id}`;
        this.inputInverseSelection.style.display = 'none';
        this.inputInverseSelection.value = this.model.get('iselection');
        this.inputInverseSelection.oninput = this.iselection_changed.bind(this);

        this.el.appendChild(this.inputInverseSelection);
    }

    value_changed() {
        var props = this.model.get("props");

        props = {...props,
                "_selection": `_hiddenSelection${this.model.model_id}`,
                "_iselection": `_hiddenInverseSelection${this.model.model_id}`};

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }

    selection_changed() {
        this.model.set('selection', JSON.parse(this.inputSelection.value));
        this.model.save_changes();
    }

    iselection_changed() {
        this.model.set('iselection', JSON.parse(this.inputInverseSelection.value));
        this.model.save_changes();
    }
}

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class VersionHistoryModel extends DOMWidgetModel {
    defaults() {
      return {
        ...super.defaults(),
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'causalvis',
        _view_module : 'causalvis',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
      };
    }
}

// Custom View. Renders the widget model.
export class VersionHistoryView extends DOMWidgetView {
    // Defines how the widget gets rendered into the DOM
    render() {
        // Render component
        this.value_changed();

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:props', this.value_changed, this);
        
        // Create input element to track changes in DAG
        this.inputVersionDAG = document.createElement('input');
        this.inputVersionDAG.type = 'text';
        this.inputVersionDAG.id = `_versionDAG${this.model.model_id}`;
        this.inputVersionDAG.style.display = 'none';
        this.inputVersionDAG.value = this.model.get('DAG');
        this.inputVersionDAG.oninput = this.versionDAG_changed.bind(this);

        this.el.appendChild(this.inputVersionDAG);

        // Create input element to track changes in DAG
        this.inputVersionCohort = document.createElement('input');
        this.inputVersionCohort.type = 'text';
        this.inputVersionCohort.id = `_versionCohort${this.model.model_id}`;
        this.inputVersionCohort.style.display = 'none';
        this.inputVersionCohort.value = this.model.get('cohort');
        this.inputVersionCohort.oninput = this.versionCohort_changed.bind(this);

        this.el.appendChild(this.inputVersionCohort);
    }

    value_changed() {
        var props = this.model.get("props");

        props = {...props,
                "_dag": `_versionDAG${this.model.model_id}`,
                "_cohort": `_versionCohort${this.model.model_id}`};

        var component = React.createElement(lib[this.model.attributes.component], props);
        ReactDOM.render(component, this.el);  
    }

    versionDAG_changed() {
        // console.log(this.inputVersionDAG.value);
        this.model.set('DAG', JSON.parse(this.inputVersionDAG.value));
        this.model.save_changes();
    }

    versionCohort_changed() {
        // console.log(this.inputVersionCohort.value);
        this.model.set('cohort', JSON.parse(this.inputVersionCohort.value));
        this.model.save_changes();
    }
}
