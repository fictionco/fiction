# Stacks

*The goal of stacks is to allow you maximum flexibility regarding the underlying services that power your Factor app. This document discusses their purpose, how to use them and how to build them.*

## Purpose

Any dynamic app&mdash;from a basic blog to an enterprise application&mdash;needs services to have: 

- User Authentication
- Database
- Image Storage
- Hosting/Server

However, there is a problem. 

Because every app has a different way implementing these services there is no consistent interface for extensions to build on. 

This leads to a constant "reinventing of the wheel" since developers have to develop the same functional components to work with different approach to the services layer. 

Stacks solve this problem. Factor creates a consistent interface with tools like `$db`, `$storage` and `$auth`. And stacks are what "match-up" different services to Factor's standard APIs.

## Installing A Stack