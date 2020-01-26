# Overview

This plugin configures Factor to use Google Cloud Storage for Factor image storage.

## Installation

```bash
yarn add @factor/plugin-storage-google-cloud
```

## Options and Settings

### Required Configuration

```git
# .env / private keys and info

GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
# OR
GOOGLE_APPLICATION_CREDENTIALS_JSON={raw:"json"}

GOOGLE_CLOUD_STORAGE_BUCKET=bucket-name

# REF - https://github.com/motdotla/dotenv
```

> After installation, run `yarn factor setup` for an easy to way to configure this plugin

## How It Works

This plugin uses Factor's filter system to automatically install and configure itself. If you have properly setup your API keys and other required information, it should work as intended.

## Factor Setup CLI

Run `yarn factor setup` for a question based CLI to help you configure this plugin's options.
