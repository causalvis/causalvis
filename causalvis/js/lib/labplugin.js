var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'causalvis:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'causalvis',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

