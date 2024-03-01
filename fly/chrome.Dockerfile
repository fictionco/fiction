FROM mcr.microsoft.com/playwright:v1.27.0-focal as os

RUN apt-get update -y && \
  apt-get -y install sudo python3 build-essential


RUN npm install --location=global pnpm@7.9.4 cross-env

# https://stackoverflow.com/a/39855387/1858322
RUN useradd -ms /bin/bash cicero
WORKDIR /usr/local/bin/cicero/

RUN chown -R cicero /usr/local/bin/cicero/
RUN chmod -R 777 /usr/local/bin/cicero/

USER cicero

COPY --chown=cicero . .

RUN pnpm fetch --prod

RUN echo "installing dependencies with PNPM"
RUN cross-env INSTALL_ENV=production pnpm i --prod --offline --frozen-lockfile
RUN pnpm i playwright @faker-js/faker -w

FROM os as kaption-example
EXPOSE 1111
CMD cross-env SERVICE=example npm run app-service
