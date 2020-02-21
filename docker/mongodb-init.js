db = db.getSiblingDB("factor")

db.createUser({
  user: "factor",
  pwd: "factorDEV",
  roles: [
    {
      role: "readWrite",
      db: "factor"
    }
  ]
})
