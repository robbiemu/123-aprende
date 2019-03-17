#! /usr/bin/env bash

echo "installing dev dependencies"

export NODE_ENV=development;
export NPM_CONFIG_PRODUCTION=false;
  yarn install --non-interactive --ignore-engines --production=false --network-timeout 48000;
export NODE_ENV=production;
export NPM_CONFIG_PRODUCTION=true;
