---
title: Mongo Atlas
description: Learn how to use Mongo Atlas as the database that powers your Factor install.
---

# Steps to Using Atlas

For many users, the easiest way to get a DB is likely using [Mongo Atlas](https://www.mongodb.com/cloud/atlas). This is a hosted and managed service by the creators of MongoDb. It's cost efficient (and scalable) to use with Factor.

The steps to get a connection string are as follows:

## Create Atlas Account

Set up an account at [Mongo Atlas](https://www.mongodb.com/cloud/atlas)

## Create New Database

Next you'll need to create a database. Under **Clusters** > **Collections** click "create database" and create a new database named whatever you'd like.

Then, add a new collection for Factor. Call it `posts`.

![Adding DB and Collection](./add-db-and-collection.jpg)

## Create an Access User

You'll need to create a user that has the privileges needed to interact directly with your db. To do this go to **Database Access** > **Add New Database User**.

Create a username and password for that user. This information will be added directly into your connection string.

![Create A User](./create-user.jpg)

## Whitelist IPs

As a security measure, Atlas requires that you whitelist IP addresses that have permissions to interact directly with your database. If security is important, we recommend using this feature; however in many scenarios it's ok to "whitelist all IPs." This can make it easier to get things working without hiccups.

To do this go to: **Network Access** > **IP Whitelist**. Add `0.0.0.0` to whitelist all IPs.

![Network Access IPs](./whitelist-ip.jpg)

## Get The Connection

Finally, get the connection info. Go to **Connect** > **Connect Application**. This will spit out a full connection string that you can add to your `.env` in your Factor app.

```bash
# .env - DB Connection (Mongo Connection String)
FACTOR_DB_CONNECTION="mongodb+srv://demo:demo@cluster0-yxsfy.mongodb.net/demo?retryWrites=true&w=majority"
```
