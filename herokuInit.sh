if [ ! -f './src/config/private.js' ]; then
  echo $PRIVATE_JS > ./src/config/private.js
fi

yarn build-web;
yarn serve-web;
