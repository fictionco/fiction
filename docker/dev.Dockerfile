FROM node:14-alpine AS build

WORKDIR /src

RUN yarn install

ENTRYPOINT ["npx", "factor", "dev"]

