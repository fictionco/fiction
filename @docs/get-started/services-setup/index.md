---
title: Setting up basic backing services with Factor
description: Learn how to add the basic backing services to Factor
---

# Services Setup

## Db, Email, Storage

To allow maximum flexibility Factor requires 3 key services: email, database, and image storage. Set them up now or later.

## Demo Defaults

If you're just trying out Factor, you don't need to set up any services. Factor will use a demo database (which resets itself every 30 minutes) for data including images and log emails to your terminal.

## Database

### Your DB Connection

All that is needed for your database is a [MongoDB connection url](https://docs.mongodb.com/manual/reference/connection-string/).

There are many ways to setup and host a MongoDB database and each method will have a straight forward way of getting this connection information.

Once you have a string, just add it to `.env` under `FACTOR_DB_CONNECTION`:

```bash
# .env - DB Connection (Mongo Connection String)

# with Mongo Atlas connection URL
FACTOR_DB_CONNECTION="mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"

# or with Mongo installed locally 
FACTOR_DB_CONNECTION="mongodb://127.0.0.1:27017/posts"
```

> **Recommendation**
> Mongo Atlas [Integration Tutorial](./mongo-atlas)
> Mongo Local Server [Setting Up](./mongo-local)

## Image Storage

You'll need somewhere store images uploaded through Factor. For this we recommend an external image storage service that cleanly separates your app from your images.

> **Recommendation**
> Amazon/AWS S3 [Integration Tutorial](./amazon-s3)

## SMTP Email

Every CMS oriented system needs email for things like email notifications, forgot my password emails, email verification, etc. for this Factor integrates a standard SMTP email tool that needs to be connected with an external service.

> **Recommendation**
> Mailgun [Integration Tutorial](./mailgun)
