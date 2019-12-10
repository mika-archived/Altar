#!/usr/bin/env bash
set -euo pipefail

PERL_VERSION=5.30.1
ALTAR_PROJECT=$(cat ./altar-project.json)

docker run --rm  -e ALTAR_PROJECT --env PERL_CARMEL_REPO=/usr/local/PROJECT/caches --volume $(pwd)/volume:/usr/local/PROJECT/ mikazuki/altar-perl-installer:$PERL_VERSION /usr/local/altar/installer/bin/startup.sh