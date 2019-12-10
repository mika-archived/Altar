#!/usr/bin/env bash
set -euo pipefail

docker build --tag mikazuki/altar-perl-cleaner:latest --file ./latest/Dockerfile .
