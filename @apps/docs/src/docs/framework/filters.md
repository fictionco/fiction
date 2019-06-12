# Factor Filters

Filters are callbacks that Factor passes data through at the moment before it does something with that data. 

They are a simple mechanism for manipulating or "filtering" code in another location throughout a plugin based system. And have some important benefits: 

- Modularity: Filters allow all relevant code for one purpose to stay in one module.
- Timing Control: Filters allow for better control of when and where functions get called in the overall Factor lifecycle.
- Single Interface: Using filters makes it possible to create the feeling of a single consistent interface for working with Factor

## How Filters Work

Each filter has a: 
1. **Filter ID**: A unique system wide ID
2. **Apply Call**: Where and when all the functions added to a filter ID get called
3. **Add Call**: Where functions get added to the filter ID

Below is a conceptual diagram of how a list in one extension might be added-to or modified by other extensions. 

![How Filters Work](./filters-diagram.jpg)

The above diagram is a typical use case. For example, application routes work in this same way. Another scenario might be adding navigation items to a site's global nav component.

## Creating and Using a Filter

```javascript

// From an extension
// The callback recieves the list so just add another item to it
Factor.$filters.add('my-item-list', list => {
  list.push(4)
  return list
})

// Later we apply the filters with an initial or default starting value
const defaultList = [1, 2, 3]

const myItemList = Factor.$filters.apply('my-item-list', defaultList)

console.log(myItemList) // [1, 2, 3, 4]

```

## Priority

Filters that have attached to the same ID "pass" the result of their callback to the next attached item in the chain. Therefore, at certain points it is useful to apply a priority to the order that filters are called in. 

To change the order in which filters fire, use the `priority` option.  Filters added with a priority of a lower number will be sorted before those with lower values. Note that the default priority value is 100. 

```javascript

// From an extension
Factor.$filters.add('my-item-list', list => {
  list.push(4)
  return list
}) // default priority 100

// Later... From another extension
Factor.$filters.add('my-item-list', list => {
  list.push(5)
  return list
}, {priority: 20})

// Later we apply the filters with an initial or default starting value
const defaultList = [1, 2, 3]

const myItemList = Factor.$filters.apply('my-item-list', defaultList)

console.log(myItemList) // [1, 2, 3, 5, 4]

```

## Callbacks and Filters

A common scenario for using Filters is to fire and "await" a list of async callbacks at some point in Factor's lifecycle. 

Since this is encountered so often, Factor has two special helper functions specifically for creating and calling async callbacks `Factor.$filters.callback` and `Factor.$filters.run`.

Here is an example using these helpers: 

```javascript

// Extension A
Factor.$filters.callback('after-signup', (args) => sendWelcomeEmail(args))

// Extension B
Factor.$filters.callback('after-signup', (args) => addToSpreadsheet(args))

// From authentication extension
// uses Promise.all to run all callbacks in parallel
// Returns an array containing the results of all callbacks
const results = await Factor.$filters.run('after-signup', args)

```