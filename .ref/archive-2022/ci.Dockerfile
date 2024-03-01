FROM node:18-alpine AS build
WORKDIR /usr/src/app

COPY package.json .
COPY packages packages
COPY cdk cdk
COPY scripts scripts
RUN echo "Installing the dependencies with yarn" && \
  yarn install \
  --production=true \
  --ignore-optional \
  --non-interactive \
  --frozen-lockfile && \
  echo "Cleaning Yarn cache" && \
  yarn cache clean
COPY . .

ENTRYPOINT ["npm", "kaption", "start"]
