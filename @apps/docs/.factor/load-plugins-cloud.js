/******** GENERATED FILE ********/
const files = [
{
  "version": "0.3.0",
  "name": "@factor/core-events",
  "priority": 20,
  "target": [
    "build",
    "app",
    "cloud"
  ],
  "extend": "plugin",
  "cwd": false,
  "main": "plugin.js",
  "id": "events",
  "mainFile": "@factor/core-events"
},
{
  "version": "0.3.0",
  "name": "@factor/core-db",
  "priority": 100,
  "target": [
    "app",
    "cloud",
    "build"
  ],
  "extend": "plugin",
  "cwd": false,
  "main": "plugin.js",
  "id": "db",
  "mainFile": "@factor/core-db"
},
{
  "version": "0.3.0",
  "name": "@factor/app-fallbacks",
  "priority": 100,
  "target": [
    "build",
    "cloud"
  ],
  "extend": "plugin",
  "cwd": false,
  "main": "plugin.js",
  "id": "appFallbacks",
  "mainFile": "@factor/app-fallbacks"
},
{
  "version": "0.3.1",
  "name": "@factor/core-server",
  "priority": 100,
  "target": [
    "build",
    "endpoint"
  ],
  "extend": "plugin",
  "cwd": false,
  "main": "plugin.js",
  "id": "server",
  "mainFile": "@factor/core-server"
},
{
  "version": "0.3.1",
  "name": "@factor/cms-user",
  "priority": 100,
  "target": [
    "app",
    "build",
    "cloud"
  ],
  "extend": "plugin",
  "cwd": false,
  "main": "plugin.js",
  "id": "user",
  "mainFile": "@factor/cms-user"
},
{
  "version": "0.3.0",
  "name": "@factor/cms-user-role-endpoint",
  "priority": 100,
  "target": [
    "endpoint"
  ],
  "extend": "plugin",
  "cwd": false,
  "main": "plugin.js",
  "id": "privs",
  "mainFile": "@factor/cms-user-role-endpoint"
},
{
  "version": "0.3.2",
  "name": "@factor/theme-docs",
  "priority": 100,
  "target": [
    "cloud",
    "app",
    "build"
  ],
  "extend": "theme",
  "cwd": false,
  "main": "src/plugin.js",
  "id": "docs",
  "mainFile": "@factor/theme-docs"
}
]
module.exports = files