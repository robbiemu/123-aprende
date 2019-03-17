if [ ! -f './src/config/private.js' ]; then
    echo $PRIVATE_JS > ./src/config/private.js
export NODE_ENV=development;
export YARN_PRODUCTION=false;
  echo "yarn install --non-interactive --ignore-engines --production=false";
  yarn install --non-interactive --ignore-engines --production=false --network-timeout 48000;
export NODE_ENV=production;
export YARN_PRODUCTION=true;
export HEROKU_URL=$(heroku info -s -a dgmd-e60 | grep web_url | cut -d= -f2)
  yarn build-web;
fi

yarn serve-web;
