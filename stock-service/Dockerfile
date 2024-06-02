FROM node:21.6.2-slim

ENV STOCK_SERVICE_VAR stock-service
USER node

WORKDIR /usr/src/app

COPY --chown=node:node ${STOCK_SERVICE_VAR}/entrypoint.sh ./

COPY --chown=node:node ${STOCK_SERVICE_VAR}/package*.json ./

COPY . .

