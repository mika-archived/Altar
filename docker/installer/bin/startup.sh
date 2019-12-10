#!/usr/bin/env bash
set -euo pipefail

# 1st, create project files
perl5.30.1 /usr/local/altar/installer/bin/generate.pl

# 2nd, install dependencies
cd $(perl5.30.1 /usr/local/altar/installer/bin/cpd.pl) && carmel install && carmel rollout

