#! /usr/bin/env bash

echo "installing dev dependencies"

export NODE_ENV=development;
export NPM_CONFIG_PRODUCTION=false;
  yarn install --only=dev;
export NODE_ENV=production;
export NPM_CONFIG_PRODUCTION=true;
