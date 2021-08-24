require("jest-fetch-mock").enableMocks()
require("dotenv").config({
  path: require("path").resolve(process.cwd(), ".env"),
})
