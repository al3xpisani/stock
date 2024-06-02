FROM node:21.6.2-slim

ENV API_SERVICE_VAR api-service
USER node

WORKDIR /usr/src/app

COPY --chown=node:node ${API_SERVICE_VAR}/entrypoint.sh ./

COPY --chown=node:node ${API_SERVICE_VAR}/package*.json ./

COPY . .

