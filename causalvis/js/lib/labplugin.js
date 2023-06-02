import {ReactModel, ReactView, DAGModel, DAGView, CohortModel, CohortView, VersionHistoryModel, VersionHistoryView, version} from './index';
import {IJupyterWidgetRegistry} from '@jupyter-widgets/base';

export const helloWidgetPlugin = {
  id: 'causalvis:plugin',
  requires: [IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'causalvis',
          version: version,
          exports: { ReactModel, ReactView, DAGModel, DAGView, CohortModel, CohortView, VersionHistoryModel, VersionHistoryView }
      });
  },
  autoStart: true
};

export default helloWidgetPlugin;
