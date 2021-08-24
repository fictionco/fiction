---
title: How To Manage Private Keys in a Javascript Project
---

In 2019, web development means working with tons of APIs and microservices. And with these APIs, comes dozens of private keys that need to be managed in your development environment.

After some research it seems like no one really presents an 'easy' way of dealing with these so I'd like to propose a new solution: encrypting a JSON and simplifying your 'secrets' to one all important password.

## Typical Approach

The "recommended" approach to private keys is to use what's called "environmental variables" which are variables stored with your cloud provider. However, this quickly becomes problematic for two reasons:

1. Managing private keys in the cloud becomes complicated fast. As even a small project is going to have 10 or more keys to deal with. What keys are stored? What's the name of the variable they are stored under?
2. Figuring out how to get these keys into appicable environments can be an issue. For me it was a problem using them locally for testing.
3. Dealing with production vs staging vs development keys makes the problem(s) worse

The other way some people might deal with this is to have a local file with private keys in it. However, the existence of this file creates security concerns for any grown-up project and adding it to source control is even a worse idea.

So what's the solution?

## A Better Way to Manage Private Keys

After spending some time with Google looking for better ideas, I couldn't find any better recommendations but had an idea. First, let's look at exactly what the solution needs to accomplish:

1. The "actual" keys can never be commited to source control (git)
2. The keys need to be stored securly somewhere where they can be accessed by all backend services
3. The key management solution should not create chronic workflow issues
4. The solution should handle different keys for different environments (dev, staging, production)

### Crypto JSON + A Master Password

![How This Works](https://fiction-com.s3.us-west-1.amazonaws.com/5df93870982d4c002c6b4bc1.jpeg)

The solution is simple. Simply, use a password to encrypt a JSON file. That way you can save the encrypted JSON file in source control and only need to deal with a single "master password" to unlock it. Here's how it works:

1. Create a local file called private-keys-raw.json. This is a formatted file with all private keys that only top level admins should have access to (no source control)
2. Create a local passwords.json file (or store the same info in an env variable)

- Note that there should be a password for each build environment. That way you don't need to share the production password with every developer/contractor

3. Use this NPM package [Crypto JSON](https://www.npmjs.com/package/crypto-json). This allows you to encrypt the file while leaving the formatting in place.
4. On your server, use the passwords to decrypt the file. Giving you access to your keys.

## Summary

Using a single passwords field and an encrypted JSON file massively simplifies this common development problem. To recap, all you need to do is:

- create a passwords file
- encypt with the passwords
- decrypt the file in your backend environment

This meets all the contraints described above, most notably it doesn't create any new workflow problems around security.
