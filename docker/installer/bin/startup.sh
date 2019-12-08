#!/usr/bin/env bash
set -euo pipefail

# 1st, create project files
perl5.30.1 /usr/local/PROJECT/installer/bin/generate.pl

# 2nd, install dependencies
carmel install

