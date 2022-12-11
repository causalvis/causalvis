# Causalvis: Visualizations for Causal Inference

This repository contains supplemental materials for the ACM CHI 2023 paper, Visual Reasoning Strategies for Effect Size Causalvis: Visualizations for Causal Inference.

Causalvis is a python library of interactive visualizations for causal inference, designed to work with the [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/getting_started/overview.html) computational environment.

## Contents

The contents of this repository include all code needed to install and run the Causalvis library locally. We also include notebooks that demonstrate the use of each of the Causalvis visualization modules.

src/ *- all javascript frontend code for Causalvis react components*
	- DAG.js: main script for the DAG module
	- CohortEvaluator.js: main script for the CohortEvaluator module
	- TreatmentEffectExplorer.js: main script for the TreatmentEffectExplorer module
	- VersionHistory.js: main script for the VersionHistory module

- CausalStructure/ *- individual components of the DAG module*
	- Attribute.js: single attribute button in the attributes menu on left
	- AttributesManager.js: attributes menu on left
	- DAGEditor.js: svg for visualizing and editing the DAG
	- DownloadDialog.js: dialog box for selecting download options
	- TagDialog.js: dialog box for adding and editing tags for each attribute

- CohortEvaluator/ *- individual components of the CohortEvaluator module*
	- CompareDistributionVis.js: distribution of single continuous covariate for treatment and control groups, including visualization of changes before and after adjustment as well as SMD for all groups
	- CompareHistogramContinuousVis.js: histogram distribution of single continuous covariate for treatment and control groups, including visualization of changes before and after adjustment as well as SMD for all groups (note that this component was eventually excluded from the final Causalvis package)
	- CompareHistogramVis.js: histogram distribution of single binary covariate for treatment and control groups, including visualization of changes before and after adjustment as well as SMD for all groups
	- CovariateBalance.js: container component that organizes the aSMD and detailed covariate views, as well as sorting the order of the covariates in both views
	- CovariateSelector.js: keeps track of the visible covariates in the detailed covariates view
	- DownloadSelectedDialog.js: dialog for viewing and downloading selected (brushed) items in the propensity score plot
	- PropDistribution.js: container component that pre-processes the data for the propensity score plot based on whether IPW or matching is used for cohort construction
	- PropDistributionVis.js: svg for visualizing the propensity score plot
	- SMDMenu.js: the aSMD plot sort menu
	- SMDVis.js: svg for visualizing the aSMD plot

- TreatmentEffectExplorer/ *- individual components of the TreatmentEffectExplorer module*
	- BeeswarmLeft.js: vertically oriented beeswarm plot
	- BeeswarmTop.js: horizontally oriented beeswarm plot
	- Covariate.js: single covariate button in the covariates menu on left
	- CovariatesManager.js: covariates menu on left
	- LegendVis.js: legends for the visualizations shown separately
	- TreatmentEffectVis.js: boxplot visualization of individual treatment effects for each subgroup (note that this component was eventually excluded from the final Causalvis package)
	- TreatmentEffectVis_withViolin.js: boxplot and violin plot visualizations of individual treatment effects for each subgroup

- VersionHistory/ *- individual components of the VersionHistory module*
	- Attribute.js: single attribute button in the attributes dropdown menu
	- AttributesManager.js: attributes dropdown menu
	- CompareVersions.js: container component that keeps track of different cohort versions and covariates used in each
	- CompareVersionsVis.js: svg for visualizing the ATE across versions
	- VersionTree.js: svg for visualizing the icicle plot of different DAG and cohort versions

/lib *- components compiled from /src*

/causalvis *- ipywidget code for the Causalvis pacakge, files not described below are boilerplate code for general ipywidgets*

- causalvis/ *- custom files for Causalvis listed below*
	- widget.js: Python backend for Causalvis, executes data pre-processing where necessary, and manages sending and receiving data from front-end visualization

- lib/ *- custom files for Causalvis listed below*
	- react.js: import compiled react components from /lib and render in Jupyter, manage sending and receiving data from Jupyter

/stories *- manages storybook for quick testing of components in dev mode, no Jupyter installation necessary*

/public *- sample data files needed to run storybook*

## Getting Started with Causalvis

To run the causalvis library, first clone the repo locally:

```bash
git clone https://github.ibm.com/bumchul-kwon/causalvis.git
```

### Installing for Jupyter lab

If this is the first time you are installing causalvis, in the main project folder, run:

```bash
sh ./setup.sh
```

For subsequent builds, run:
```bash
sh ./update.sh
```

If the causalvis widget has been successfully installed, you should see it in the list:
```bash
jupyter labextension list
```

### Running the widget

Open JupyterLab:

```bash
jupyter lab
```

Create a new notebook in python 3, then import the widget and pass it the relevant props.

```py
from causalvis import DAG
DAG(attributes=["A", "B"])
```

### Troubleshooting

If you encounter errors when importing causalvis in Jupyter lab, first ensure that the package is successfully installed and appears in the Jupyter labextension list.

```bash
jupyter labextension list
```

If this has been verified, check that the python version used by Jupyter lab is identical to the version in which causalvis is installed. In cases where there are multiple virtual environments in the same machine, the causalvis package may be installed in a different location.

## Developing for Causalvis

### Installation

To run the causalvis library, first clone the repo and install packages:

```bash
git clone https://github.ibm.com/bumchul-kwon/causalvis.git
npm install
```

### Run Modules

Start the app with:

```bash
npm run storybook
```

This should open a new browser window. Each module is listed separately in the left hand menu. Some modules may have multiple examples.

### Data Sets

All data sets are located under `./public`