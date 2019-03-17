echo "building web root (build/)";
echo $PRIVATE_JS > ./src/config/private.js
yarn postinstall;
yarn build-web;

echo "running production server";
yarn serve-web;
