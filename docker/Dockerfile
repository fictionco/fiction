FROM node:12.14.1-buster-slim

RUN apt-get update && apt-get -y install --no-install-recommends \
unzip \
bzip2 && \
apt-get -y autoremove && \
apt-get clean && \
rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN mkdir -p /var/factor
WORKDIR /var/factor

COPY . .

RUN yarn install

EXPOSE 3000

RUN chown -R node /var/factor
USER node
CMD ["yarn", "factor", "dev"]
