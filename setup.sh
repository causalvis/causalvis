#!/bin/bash

# Build react components
npm run build

# cd into widget folder
cd causalvis/js

# Install widget packages and build for Jupyter lab
npm install
npm run build:labextension

# Exit to enclosing folder and install
cd ..
pip install -e .

# Exit to main folder
cd ..