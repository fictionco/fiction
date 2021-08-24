---
title: Developer API - Grouping Users
description: Associate identified or anonymous users with groups or organizations
---

The group call is a way of associating an anonymous or identified user with a group or organization. Common examples might be tying a user to a company or a project.

You can call group multiple times with different details to associate the user with multiple groups or to add additional information to the group if the `id` is the same.

## Typical Group Request

Using the JavaScript client a typical group request will look like this:

```js
darwinClient.group("groupId12345", {
  name: "Darwin Inc.",
  industry: "Technology",
  employees: 100,
  plan: "enterprise",
})
```

The above call with associate the current session (user) with a group that has a unique `groupId` and the details provided in the call.

## Group Data Structure

Groups tracking works in a similar way to [user tracking](./track). Each group identification request takes a `groupId` along with `traits` to associate with the group.

<elem-table fields="groups"></elem-table>

## Group ID

A groupId is the identifier you use to associate with the group. You'll need to generate this or otherwise acquire it from your DB.

## Group Traits

<elem-table fields="groupTraits"></elem-table>
