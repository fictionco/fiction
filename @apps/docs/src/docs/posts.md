# The Post System

Factor is powered by a post system designed to help simplify and standardize the way your app works with your DB.

## Overview

The post system works by combining all your apps data items, e.g. users, pages, posts, etc.. into a single collection in your DB. Each data type is built on a standard "post type" (called `post`) and then extended.

There are some clear advantages to this approach:

1. **Shared functionality.** Most DB items need common functionality like category filtering or permalinks. With a post system all post-types inherit these tools automatically.
1. **Simplicity.** Since all data types are stored in the same place, it makes it much easier to manage your data. For example, to export/import your entire DB, you're just dealing with a single collection.

## Managing Posts

## Working With Posts

### Post Types

### Data Schemas
