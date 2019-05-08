# Async Data

> You may want to fetch data and render it on the server-side. Factor.js adds an `asyncData` method to let you handle async operations before setting the component data.

## The asyncData method

Sometimes you just want to fetch data and pre-render it on the server without using a store.
`asyncData` is called every time before loading the **page** component.
It will be called server-side once (on the first request to the Factor app) and client-side when navigating to further routes. 
This method receives [the context](/api/context) as the first argument, you can use it to fetch some data and Factor.js will merge it with the component data.

Factor.js will automatically merge the returned object with the component data.

<div class="alert">
<p>You do **NOT** have access of the component instance through `this` inside `asyncData` because it is called **before initiating** the component.</p>
</div>

Factor.js offers you different ways to use `asyncData`. Choose the one you're the most familiar with:

1. Returning a `Promise`. Factor.js will wait for the promise to be resolved before rendering the component.
2. Using the [async/await](https://javascript.info/async-await) ([learn more about it](https://zeit.co/blog/async-and-await))

<div class="alert">
<p> We are using [axios](https://github.com/mzabriskie/axios) to make isomorphic HTTP requests, we **strongly recommend** to use our [axios module](https://axios.factorjs.org/) for your Factor projects.</p>
</div>

### Returning a Promise

```js
export default {
  asyncData ({ params }) {
    return axios.get(`https://my-api/posts/${params.id}`)
    .then((res) => {
      return { title: res.data.title }
    })
  }
}
```

### Using async/await

```js
export default {
  async asyncData ({ params }) {
    let { data } = await axios.get(`https://my-api/posts/${params.id}`)
    return { title: data.title }
  }
}
```


### Displaying the data

The result from asyncData will be **merged** with data.
You can display the data inside your template like you're used to doing:

```html
<template>
  <h1>{{ title }}</h1>
</template>
```

## The Context

To see the list of available keys in `context`, take a look at the [API Essential `context`](/api/context).

### Use `req`/`res` objects

When `asyncData` is called on server side, you have access to the `req` and `res` objects of the user request.

```js
export default {
  async asyncData ({ req, res }) {
    // Please check if you are on the server side before
    // using req and res
    if (process.server) {
     return { host: req.headers.host }
    }

    return {}
  }
}
```

### Accessing dynamic route data

You can use the `context` parameter to access dynamic route data as well!
For example, dynamic route params can be retrieved using the name of the file or folder that configured it.
If you've defined a file named `_slug.vue` in your `pages` folder, you can access the value via `context.params.slug`:

```js
export default {
  async asyncData ({ params }) {
    const slug = params.slug // When calling /abc the slug will be "abc"
    return { slug }
  }
}
```


### Listening to query changes

The `asyncData` method **is not called** on query string changes by default.
If you want to change this behavior, for example when building a pagination component,
you can set up parameters that should be listened to with the `watchQuery` property of your page component.
Learn more on the [API `watchQuery` page](/api/pages-watchquery) page.

## Handling Errors

Factor.js adds the `error(params)` method in the `context`, which you can call to display the error page. `params.statusCode` will be also used to render the proper status code from the server-side.

Example with a `Promise`:

```js
export default {
  asyncData ({ params, error }) {
    return axios.get(`https://my-api/posts/${params.id}`)
    .then((res) => {
      return { title: res.data.title }
    })
    .catch((e) => {
      error({ statusCode: 404, message: 'Post not found' })
    })
  }
}
```


To customize the error page, take a look at the [views docs](/docs/views#layouts) .