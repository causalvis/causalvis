var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'ReactWidget:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'ReactWidget',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

