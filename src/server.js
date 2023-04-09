const app = require("express")()
const routes = require("./routes")

app.use(routes)

module.exports = app