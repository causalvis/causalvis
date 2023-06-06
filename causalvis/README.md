# Causalvis: Visualizations for Causal Inference

This repository contains supplemental materials for the ACM CHI 2023 paper titled: 

`Causalvis: Visualizations for Causal Inference`

Causalvis is a python library of interactive visualizations for causal inference, designed to work with the [JupyterLab](https://jupyterlab.readthedocs.io/en/stable/getting_started/overview.html) computational environment.

## Citation

```
@inproceedings{Guo_Causalvis_2023,
    address = {Hamburg, Germany},
    title = {{Causalvis}: Visualizations for Causal Inference},
    booktitle = {Proceedings of the 2023 CHI Conference on Human Factors in Computing Systems},
    publisher = {Association for Computing Machinery},
    author = {Guo, Grace and Karavani, Ehud and Endert, Alex and Kwon, Bum Chul},
    year = {2023}
}
```

## Getting Started with Causalvis

The quickest way to ensure that causalvis is installed correctly is to start with a clean conda environment with the exact versions of the following packages:

```
 conda create -n newenv python=3.8 jupyterlab=3.4 ipywidgets=7.6 ipykernel=5.3 scipy pandas

 conda activate newenv
```

Install pip for this new environment:

```bash
conda install pip
```

Then install causalvis:

```bash
pip install causalvis
```

The package should show up when you run:

``` bash
jupyter labextension list
```

### Running Causalvis

Causalvis is meant to be used in the JupyterLab computational environment. After installation, JupyterLab can be opened from terminal with the following:

```bash
jupyter lab
```

For notebook examples, please refer to the [github repo here](https://github.com/causalvis/causalvis/tree/master/notebook).

The `notebook` folder has a number of examples that demonstrate the various Causalvis modules.
We recommend starting with `Example_All.ipynb`, which has all necessary data sets included and does not require any external packages.
Other demo notebooks will require that certain packages are installed such as [causallib](https://github.com/BiomedSciAI/causallib), [causalnex](https://causalnex.readthedocs.io/en/latest/), [pandas](https://pandas.pydata.org/docs/getting_started/install.html), [scikit-learn](https://scikit-learn.org/stable/install.html), and others.
Note that if you created a new conda environment as recommended above, it is recommended that you install these packages using `conda`, `conda-forge`, or `pip`.    

To use the causalvis modules in your own projects, you can create a new notebook in python3 and instantiate the widget with the relevant props.

```py
from causalvis import DAG
DAG(attributes=["A", "B"])
```

### Troubleshooting

If you encounter errors when importing causalvis in JupyterLab, first ensure that the package is successfully installed and appears in the Jupyter labextension list.

```bash
jupyter labextension list
```

If this has been verified, check that the python version used by JupyterLab is identical to the version in which causalvis is installed. In cases where there are multiple virtual environments in the same machine, the causalvis package may be installed in a different location.

## Documentation

We are working on releasing a comprehensive wiki for causalvis. The link will be updated here as soon as it is ready - check back soon!