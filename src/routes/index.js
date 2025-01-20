const UserRouter = require("./UserRouter")
const TopicRouter = require("./TopicRouter")

const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("api/topic", TopicRouter)
  };
  
  module.exports = routes;