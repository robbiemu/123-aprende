#!/usr/bin/env bash

for filename in build/static/js/*; do
    sed -i "s?__CALLBACK__?$HEROKU_URL:$PORT\/callback?" $filename
done

node herokuAuth0Update.js

yarn serve-web