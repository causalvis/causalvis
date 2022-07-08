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