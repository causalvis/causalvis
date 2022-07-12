import ipywidgets as widgets
from traitlets import Unicode, Dict

# @widgets.register
class BaseWidget(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('ReactView').tag(sync=True)
    _model_name = Unicode('ReactModel').tag(sync=True)
    _view_module = Unicode('causalvis').tag(sync=True)
    _model_module = Unicode('causalvis').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    component = Unicode().tag(sync=True)
    props = Dict().tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__()

        self.component = self.__class__.__name__
        self.props = kwargs

"""
Read and convert a networkx graph into a python Dict

Props:
  - nx_graph: graph in networkx format
"""
def load_nx(nx_graph):
  from networkx.readwrite import json_graph
  import networkx as nx

  pos=nx.spring_layout(nx_graph)

  newPos = {}

  # get x, y layout values for each node
  for p in pos:
      value = pos[p]
      newPos[p] = {"x": value[0], "y": value[1]}

  nx.set_node_attributes(nx_graph,newPos)
  data = json_graph.node_link_data(nx_graph, {"link": "links", "source": "source", "target": "target", "name": "name"})

  nodelink = {}
  nodelink["nodes"] = data["nodes"]
  nodelink["links"] = data["links"]

  return nodelink

"""
The following function initializes the DAG widget
Only one of the input props should be specified, if multiple props are provided,
props will be processed in order of preference as listed below
Input props with the most information (graphs) are prioritized
If not input props are provided, the DAG is initialized as an empty svg

Props:
  - graph: Dict, json formatted graph data of {nodes: [...], links: [...]}
  - nx_graph: NetworkX graph
  - attributes: List, attribute names
  - data: pandas DataFrame
""" 
@widgets.register
class DAG(BaseWidget):
    def __init__(self, graph=None, nx_graph=None, attributes=None, data=None, **kwargs):
        
        if graph:
          self.graph = graph
          self.attributes = None
        elif nx_graph:
          self.graph = load_nx(nx_graph)
          self.attributes = None
        elif attributes:
          self.attributes = attributes
          self.graph = None
        elif data:
          self.attributes = list(data)
          self.graph = None
        else:
          self.attributes = []
          self.graph = None
        
        super().__init__(
            attributes=self.attributes,
            graph=self.graph,
            **kwargs
        )

@widgets.register
class CohortEvaluator(BaseWidget):
    def __init__(self, unadjustedCohort, adjustedCohort=[], treatment="treatment", propensity="propensity", **kwargs):
        
        self.unadjustedCohort = unadjustedCohort
        self.adjustedCohort = adjustedCohort
        self.treatment = treatment
        self.propensity = propensity

        # print("here", self.data)
        
        super().__init__(
            unadjustedCohort=self.unadjustedCohort,
            adjustedCohort=self.adjustedCohort,
            treatment=self.treatment,
            propensity=self.propensity,
            **kwargs
        )

@widgets.register
class TreatmentEffectEvaluator(BaseWidget):
    def __init__(self, data=[], treatment="treatment", outcome="outcome", **kwargs):
        
        self.data = data
        self.treatment = treatment
        self.outcome = outcome

        # print("here", self.data)
        
        super().__init__(
            data=self.data,
            treatment=self.treatment,
            outcome=self.outcome,
            **kwargs
        )