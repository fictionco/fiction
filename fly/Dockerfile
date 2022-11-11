FROM node:18-alpine AS build
WORKDIR /usr/src/app

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache curl make g++ iputils bind-tools python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN npm install --location=global pnpm cross-env

COPY . .

RUN pnpm fetch --prod

RUN echo "installing dependencies with PNPM"
RUN cross-env INSTALL_ENV=production pnpm i --prod --offline --frozen-lockfile

FROM build as www
EXPOSE 3000
CMD npm -w @factor/www exec -- factor run www

FROM build as andrewpowers
EXPOSE 3000
CMD npm -w @factor/andrewpowers exec -- factor run app

FROM build as supereon
EXPOSE 3000
CMD npm -w @factor/supereon exec -- factor run app

