# Using a specific version of node:22-alpine for reproducibility
FROM node:22-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install system dependencies that are necessary
RUN apk add --update --no-cache curl redis busybox-extras make g++ iputils bind-tools

# Set environment variables after installing essential packages to benefit from Docker layer caching
ENV PYTHONUNBUFFERED=1 \
    PATH="/usr/src/venv/bin:$PATH"

# Install Python and create a virtual environment to avoid issues with the system-wide Python installation
RUN apk add --no-cache python3 && \
    ln -sf python3 /usr/bin/python && \
    python3 -m venv /usr/src/venv && \
    . /usr/src/venv/bin/activate && \
    pip install --no-cache --upgrade pip setuptools

# Install pnpm globally and cross-env
RUN npm install --location=global pnpm@9.4.0 cross-env

# Check pnpm version for debugging purposes
RUN pnpm -v

# Copy the local source code to the work directory in the container
COPY . .

# Fetch production dependencies using pnpm
RUN pnpm fetch --prod

# Install production dependencies using pnpm
RUN cross-env INSTALL_ENV=production pnpm i --prod --offline --frozen-lockfile

FROM base as fiction-sites
EXPOSE 6565
CMD npm -w @fiction/www exec -- fiction run sites

FROM base as fiction-www
EXPOSE 4444
CMD npm -w @fiction/www exec -- fiction run app

FROM base as fiction-beacon
EXPOSE 4444
CMD npm -w @fiction/www exec -- fiction run beacon
