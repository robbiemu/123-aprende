if [ ! -f './dist/server.js' ]; then
export NODE_ENV=development;
export NPM_CONFIG_PRODUCTION=false;
  yarn clean;
export NODE_ENV=production;
export NPM_CONFIG_PRODUCTION=true;
  yarn build-web;
fi

yarn serve;
