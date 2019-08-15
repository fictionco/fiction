This plugin configures Factor to use AWS S3 for Factor image storage.

## Installation

```bash
$ yarn add @factor/plugin-storage-s3
```

## Required Configuration

```git
# .env / AWS config info
AWS_ACCESS_KEY=YOURKEY
AWS_ACCESS_KEY_SECRET=YOURSECRET
AWS_S3_BUCKET=your-bucket-name
```

> After installation, run `yarn factor setup` for an easy to way to configure this plugin

## How It Works

This plugin uses Factor's filter system to automatically install and configure itself. If you have properly setup your API keys and other required information, it should work as intended.
