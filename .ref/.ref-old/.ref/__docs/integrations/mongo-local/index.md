---
title: Mongo Local Server
description: Learn how to use a local Mongo server as the database that powers your Factor install.
---

# Using a local MongoDB server

Perhaps the easiest way to add a database to your app is to install MongoDB on your computer and add its connection information to Factor.

Using a local server is awesome for local development. However, note that in production you'll need to upload and install Mongo into a dedicated server environment and it can be a bit more complicated than just using something like [Mongo Atlas](./../mongo-atlas).

## Install MongoDB

The first step is to install the MongoDB community edition on your computer.

You can install MongoDB by following these instructions ([Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/), [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) or [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)).

Once you have completed the installation process, try typing mongo --version into your command line. You should get a response similar to the following:

```bash
➜ mongo --version
MongoDB shell version v4.2.7
git version: 51d9fe12b5d19720e72dcd7db0f2f17dd9a19212
allocator: system
modules: none
build environment:
    distarch: x86_64
    target_arch: x86_64
```

## Connect in terminal

When you run mongo, it always connects via a URL-like string. By default it is `mongodb://127.0.0.1:27017/`.

It's possible to change the port that Mongo runs on, so it verify this you can connect in your terminal to mongo by just typing `mongo`:

```bash
mongo
```

Which should show the address of the connection.

```bash
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
```

## Create posts database

Next, you'll need to make sure there is a `posts` database in MongoDb. This is the default database used by Factor. To create this, just type `use posts` in your terminal Mongo shell (created after you type `mongo`).

```bash
> use posts
switched to db posts
```

## Add connection into to .env

Now that you've created the posts database, you're all set to add your connection to Factor.

You'll just need the connection url `mongodb://127.0.0.1:27017/` and the db name `posts`

```bash
#.env
FACTOR_DB_CONNECTION="mongodb://127.0.0.1:27017/posts"
```

With that you should be up and running with a local MongoDB server, working and connected to Factor.

To test this, you can start Factor:

```bash
npx factor dev
```
