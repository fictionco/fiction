# The Post System

Factor is powered by a post system designed to help simplify and standardize the way your app works with your DB.

## Overview

The post system works by combining all your apps data items, e.g. users, pages, posts, etc.. into a single collection in your DB. Each data type is built on a standard "post type" (called `post`) and then extended.

There are some clear advantages to this approach:

1. **Shared functionality.** Most DB items need common functionality like category filtering or permalinks. With a post system all post-types inherit these tools automatically.
1. **Simplicity.** Since all data types are stored in the same place, it makes it much easier to manage your data. For example, to export/import your entire DB, you're just dealing with a single collection.

## Dashboard and Posts

The Factor dashboard is designed as an interface to your post system. Each type of post will add its own tab, but management is typically the same across many types. For example, you'll need to list and edit blog posts in a similar way to how you manage pages, or job listings, or users, etc..

Below we'll discuss the basics of adding your own "post types" and configuring your dashboard to edit and manage them.

## Working With Posts

### Post Types

### Data Schemas
