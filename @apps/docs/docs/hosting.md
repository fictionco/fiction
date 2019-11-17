# Hosting Your Factor App

## Overview

Hosting and serving your Factor application is designed to be easy. In fact, what you are doing with your local server is exactly the same as what you will run in your "live" server environment.

### Basic Steps to "Go Live"

Typical steps:

1. Get A NodeJs Server
1. Configure server with environmental variables (e.g. `DB_CONNECTION`)
1. Deploy code to server
1. Build your production app with `yarn factor build` (creates `dist` folder)
1. Start your server in production mode with `factor serve`

## Where to Host

You should be able to run Factor with any host or cloud provider that offers NodeJS hosting or ability to create NodeJS apps. Recommended providers:

- [Heroku](https://heroku.com)

## Examples

### Heroku
