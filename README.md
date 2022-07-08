# Causalvis

Causalvis is a python library of interactive visualizations for causal inference, designed to work with JupyterLab and Jupyter Notebook.

## Getting Started with Causalvis

To run the causalvis library, first clone the repo and install packages:

```bash
git clone https://github.ibm.com/bumchul-kwon/causalvis.git
npm install
```

### Building React Components

```bash
npm run build
```

This should automatically create a `lib` folder that includes all the components for the visualization modules in `.js` format.

### Installing for JupyterLab and Jupyter Notebook

```bash
cd causalvis/js
npm install
npm run build:labextension # This line builds the widget for use with JupyterLab.
npm run prepublish # This line builds the widget for use with Jupyter Notebook.
cd ..
pip install -e .
cd ..
jupyter nbextension install --py --symlink --sys-prefix causalvis # Skip this line if you are NOT using the widget with Jupyter Notebook
jupyter nbextension enable causalvis --py --sys-prefix # Skip this line if you are NOT using the widget with Jupyter Notebook
```

If the causalvis widget has been successfully installed, you should see it when running:

```bash
jupyter labextension list
```

### Running the widget

Open JupyterLab or Jupyter Notebook using one of the following commands

```bash
jupyter lab
jupyter notebook
```

Create a new notebook in python 3, then import the widget and pass it the relevant props.

```py
from causalvis import DAG
DAG(attributes=["A", "B"])
```

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