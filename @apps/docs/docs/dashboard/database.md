# Database 

*Factor includes conventions and tools for database functionality based on the MongoDB/Mongoose API. While it's easiest to integrate "mongo-like" databases, it's possible to use others. This doc will discuss how to use and work with the database layer.*

> **Server vs Client**
> For security reasons, all transactions in the database need to happen on the server-side. And for this purpose there are two components to Factor's database. A client-side component, which makes sense to the database endpoint. And an endpoint API which carries out authenticated operations on the database.