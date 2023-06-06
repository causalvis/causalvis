#!/bin/bash

# Install npm packages
npm install

# Build react components
npm run build

# cd into widget folder
cd causalvis

pip install -e .

jupyter labextension develop causalvis --overwrite

# Exit to main folder
cd ..