#!/bin/sh
echo "Running entrypoint.sh for stock-service"
set -e
npm install
npm run start
