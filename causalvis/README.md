causalvis
===============================

Visualization for causal inference

Installation
------------

To install use pip:

    $ pip install causalvis

For a development installation (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

    $ git clone https://github.com//causalvis.git
    $ cd causalvis
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix causalvis
    $ jupyter nbextension enable --py --sys-prefix causalvis

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite causalvis

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ yarn run build

You then need to refresh the JupyterLab page when your javascript changes.
