#!/bin/bash

git submodule init
git submodule update

# Ignore untracked files in submodule
# untracked
# Only untracked files in submodules will be ignored. Committed differences and modifications to tracked files will show up.
git config submodule.document-generation/stylegan3.ignore untracked