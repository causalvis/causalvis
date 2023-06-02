#!/bin/bash

# Build react components
npm run build

# cd into widget folder
cd causalvis/js

yarn run build

# Exit to main folder
cd ..
cd ..