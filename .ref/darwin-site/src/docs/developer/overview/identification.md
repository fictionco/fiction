---
title: Developer API - Identifying Users
description: How to identify users in Darwin.
---

Darwin lets you identify users to associate actions and traits with events. All that is needed is the unique `userId` and enriching information called `traits` which allows you to add information like `email`, `name`, etc...

## When to make identification calls

For best results, it is recommended that you make an identify call in the following cases:

- **Registration:** When a user signs up
- **Login** When a user logs in
- **Update User** Whenever the traits of a user change. When they add information to their profile or change email.

Additionally, you can optionally make an `identify` call whenever a page is loaded and the user is first known.

The reason for this is to associate a session with a user as fast as possible and coordinate events accordingly. This is optional however.

## Making an Identify Call

```js
import { getClient } from "darwin"

const darwinClient = getClient("API_KEY")

darwinClient.identify("userId12345", {
  name: "Elvis Presley",
  email: "Elvis@example.com",
  plan: "free",
  logins: 5,
})
```

The `identify` call takes a required `userId` as well as an object of "traits" that can be anything you want with the exception of some reserved field names. Traits are discussed below.

<elem-table fields="identify"></elem-table>

## User Identities

The identify call specifies a customer identity that you can reference across the customer’s whole lifetime. Every identify call must have a User ID or an Anonymous ID, depending on how much you know about the user in question.

When tracking users the call to `identify` is what allows you to track behavior across sessions and authentication states. It is generally useful in product analytics and other types of conversion tracking.

Every identify call needs either a `userId` or an `anonymousId`. In the browser, Darwin will automatically create an `anonymousId` and associate it with any calls the user makes. When you know who the user is, you'll make a call to `identify` to associate a user with the anonymousId and connect their analytics data throughout the lifecycle.

### Anonymous ID - The general tracking ID

Before you know who a user is, or if they are a visitor just browsing your site, they will be assigned an `anonymousId`. Darwin will do this automatically in the browser but you'll need to create one yourself if you're doing tracking on the server.

Another way to think about the `anonymousId` is as a generalized tracking ID. It is used for all analytics and so on before you tie a solid identity to a specific visitor.

To create an identification request with only the `anonymousId` the call looks like this:

```js
darwinClient.identify({
  name: "Johnny Appleseed",
})
```

### User Id

User IDs are what identification is all about. This is what allows you to really understand your users and what actions they perform over time. Especially when you drill down. You should identify the visitor in a session whenever possible, following the guidelines above for when/where to do it .

Use the database universal ID for the user. This tends to never change, while usernames and emails can be changed easily.

We recommend using database IDs instead of simple email addresses or usernames, because database IDs never change. That guarantees that even if the user changes their email address, you can still recognize them as the same person in all of your analytics tools. And even better, you’ll be able to correlate analytics data with your own internal database.

The call above with an associated `userId` looks like this:

```js
darwinClient.identify("userId12356", {
  name: "Johnny Appleseed",
})
```

## Traits

Traits are the information that you would like to associate with a user in your analytics. These include demographics like gender or age, or eCommerce information like current plan. It can include free form traits that you define like version of your site they've seen.

While you can generally create traits to your heart's content. There are some traits reserved for simplicity that are common and standardized. This allows for simplist integration with other tools potentially using Darwin's API.

<elem-table fields="traits"></elem-table>

## Example

Here is a full example using the JavaScript client to identify a user.

```js
import { getClient } from "@darwin_/client"

const darwinClient = getClient("PUBLIC_API_KEY")

darwinClient.identify("userId12356", {
  name: "Charles Darwin",
  email: "charles@darwin.so",
  title: "Advisor",
  phone: "+15555555555",
  website: "https://www.darwin.so",
  description: "Wrote about evolution",
})
```

## Recap

Once you've identified a user during a session, we'll be able to tie all tracking events to that specific user. This will help you with product analytics and other enrichment.

Ready to learn about event tracking?
