import ipywidgets as widgets
from traitlets import Unicode, Dict

@widgets.register
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


@widgets.register
class DAG(BaseWidget):
    def __init__(self, attributes, **kwargs):
        
        self.attributes = attributes

        # print("here", self.data)
        
        super().__init__(
            attributes=attributes,
            **kwargs
        )