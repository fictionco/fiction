# Overview

This plugin configures Factor to use AWS S3 for Factor image storage.

## Installation

```bash
npm add  @factor/plugin-storage-s3
```

## Options and Settings

### Required Configuration

```git
# .env / AWS config info
AWS_ACCESS_KEY=YOUR-KEY
AWS_ACCESS_KEY_SECRET=YOUR-SECRET
AWS_S3_BUCKET=your-bucket-name
```

> After installation, run `npx factor setup` for an easy to way to configure this plugin

## How It Works

This plugin uses Factor's filter system to automatically install and configure itself. If you have properly setup your API keys and other required information, it should work as intended.

## Factor Setup CLI

Run `npx factor setup` for a question based CLI to help you configure this plugin's options.
