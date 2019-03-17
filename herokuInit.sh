if [ ! -f './server/index.js' ]; then
export NODE_ENV=development;
export NPM_CONFIG_PRODUCTION=false;
  yarn install --non-interactive --ignore-engines --production=false;
export NODE_ENV=production;
export NPM_CONFIG_PRODUCTION=true;
export HEROKU_URL=$(heroku info -s -a dgmd-e60 | grep web_url | cut -d= -f2)
  yarn build-web;
fi

yarn serve-web;
