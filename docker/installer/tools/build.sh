#!/usr/bin/env bash
set -euo pipefail

PERL_VERSION=5.30.1

docker build --tag mikazuki/altar-perl-installer:$PERL_VERSION --file ./perl$PERL_VERSION/Dockerfile .
