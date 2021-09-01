---
title: Developer API - Common Data and Fields
description: The common fields that can exist on any request.
---

## Overview

Each call to Darwin includes some context information designed to help us with filtering and segmentation later.

Most of this "common" data will be included by default, when appropriate.

However, you may want to customize this context information to suit your use case.

## How Common Fields Apply

When you're making a tracking or identification request, you can add context information like this:

```js
darwinClient.track("User Registered", {
  plan: "Pro Annual",
  accountType: "Facebook",
  // now common fields can be added
  anonymousId: "random123",
  context: {
    // my context fields
  },
})
```

## Standard Data for API Calls

Every request made to Darwin can include context information. Some of this information is set by use "implicitly" can be optionally set by you when you make a call.

### Basic fields

Here are the basic fields

```json
{
  "anonymousId": "randomId5555555555",
  "userId": "userId5555555",
  "messageId": "022bb90c-bbac-11e4-8dfc-aa07a5b093db",
  "receivedAt": "2024-12-10T00:00:00.000Z",
  "sentAt": "2024-12-10T00:00:00.000Z",
  "timestamp": "2024-12-10T00:00:00.000Z",
  "type": "track",
  "context": {
    // discussed below
  }
}
```

<elem-table></elem-table>

### Context Data

Context is a dictionary of extra information that provides useful context about a datapoint, for example the user’s ip address or locale. You should only use Context fields for their intended meaning.

Context information is a set of extra information useful for analysis and segmenting. It is set based information from the user's device as well as information set on Darwin's server.

<elem-table fields="context"></elem-table>
