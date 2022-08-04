# Causalvis

Causalvis is a python library of interactive visualizations for causal inference, designed to work with the [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/getting_started/overview.html) computational environment.

## Getting Started with Causalvis

To run the causalvis library, first clone the repo and install packages:

```bash
git clone https://github.ibm.com/bumchul-kwon/causalvis.git
npm install
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