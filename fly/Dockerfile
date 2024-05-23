# Using node:22-alpine as the base image
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PATH="/usr/src/venv/bin:$PATH"

# Install system dependencies
# Then create a virtual environment for Python to avoid issues with the system-wide Python installation
RUN apk add --update --no-cache curl redis busybox-extras make g++ iputils bind-tools python3 && \
    ln -sf python3 /usr/bin/python && \
    python3 -m venv /usr/src/venv && \
    pip install --no-cache --upgrade pip setuptools

# Install pnpm globally and cross-env
RUN npm install --location=global pnpm@8.15.5 cross-env

# Check pnpm version for debugging purposes
RUN pnpm -v

# Copy the local source code to the work directory in the container
COPY . .


# Fetch production dependencies using pnpm
RUN pnpm fetch --prod

# Install production dependencies using pnpm
RUN cross-env INSTALL_ENV=production pnpm i --prod --offline --frozen-lockfile

FROM build as fiction-sites
EXPOSE 6565
CMD npm -w @fiction/www exec -- fiction run sites

FROM build as fiction-www
EXPOSE 4444
CMD npm -w @fiction/www exec -- fiction run app

FROM build as supereon
EXPOSE 3000
CMD npm -w @fiction/supereon exec -- fiction run app

FROM build as andrewpowers
EXPOSE 3000
CMD npm -w @fiction/andrewpowers exec -- fiction run app
