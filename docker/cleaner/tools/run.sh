#!/usr/bin/env bash
set -euo pipefail

ALTAR_PROJECT=$(cat ./altar-project.json)

docker run --rm  -e ALTAR_PROJECT --volume $(pwd)/volume:/usr/local/PROJECT/ mikazuki/altar-perl-cleaner:latest /usr/local/altar/cleaner/bin/startup.sh