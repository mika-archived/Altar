#!/usr/bin/env bash
set -euo pipefail

PERL_VERSION=5.30.1
ALTAR_PROJECT=$(cat ./altar-project.json)

docker run --rm  -e ALTAR_PROJECT --volume $(pwd)/volume:/usr/local/PROJECT/workspace mikazuki/altar-perl-installer:$PERL_VERSION /usr/local/PROJECT/installer/bin/startup.sh