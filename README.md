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
 conda create -n causalvis python=3.8 jupyterlab=3.4 ipywidgets=7.6 ipykernel=5.3 scipy pandas scikit-learn

 conda activate causalvis
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

In the root project folder, open JupyterLab:

```bash
jupyter lab
```

The `notebook` folder has a number of examples that demonstrate the various Causalvis modules.
The files labeled 1-4 demonstrate the four visualization modules of Causalvis, and walk through how causal inference might be performed on a student math performance dataset.
Some notebooks may require that additional packages are installed such as [causallib](https://github.com/BiomedSciAI/causallib), [causalnex](https://causalnex.readthedocs.io/en/latest/), and others.
Note that if you created a new conda environment as in the instructions above, it is recommended that you install these packages using `conda`, `conda-forge`, or `pip`.	

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

## Developing for Causalvis

### Installation

To run the causalvis library, first clone the repo and install packages:

```bash
git clone https://github.com/causalvis/causalvis.git
npm install
```

### Run Modules

To streamline development, we first test components in [storybook](https://storybook.js.org/docs/react/get-started/install) without installing into JupyterLab.

Start the app with:

```bash
npm run storybook
```

This should open a new browser window. Each module is listed separately in the left hand menu. Some modules may have multiple examples.

### Data Sets

All data sets are located under `./public`

### Integrating Changes into JupyterLab

```
 conda create -n causalvis-dev python=3.8 jupyterlab=3.4 ipywidgets=7.6 ipykernel=5.3 scikit-learn

 conda activate causalvis-dev
```

Ensure that the [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) package manager has been installed on your machine.
Check for this by running `yarn -v`.

If this is your first time installing causalvis, you can automate the rest of the installation by running:

``` bash
sh ./setup.sh
```

If you would like to complete the initial installation manually, or if `./setup.sh` does not work for any reason, the breakdown of steps are as follows.

Install the relevant npm packages and build:

``` bash
npm install

npm run build
```

Navigate to the causalvis subfolder (the root causalvis folder has a subfolder by the same name). Then run:

``` bash
pip install -e .

jupyter labextension develop causalvis --overwrite
```

The package should show up when you run:

``` bash
jupyter labextension list
```

For subsequent updates, it is sufficient to run:

```
sh ./update.sh
```

If you would like to complete the update manually, or if `./update.sh` does not work for any reason, the breakdown of steps are as follows.

First update the front-end build:

```
npm run build
```

Then navigate to the `causalvis/js` subfolder and run:

```
yarn run build
```

After each update (for both `./update.sh` and manual approaches), make sure to exit and restart JupyterLab completely for changes to take effect. It is not sufficient to restart the kernel.
