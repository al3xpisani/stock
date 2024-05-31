#!/bin/sh
echo "Running entrypoint.sh for api-service"
set -e
npm install
npm run start
