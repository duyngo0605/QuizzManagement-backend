const UserRouter = require("./UserRouter")
const TopicRouter = require("./TopicRouter")
const AnswerRouter = require("./AnswerRouter")
const QuestionRouter = require("./QuestionRouter")
const QuizRouter = require("./QuizRouter")
const TeamController = require("./TeamController")

const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("api/topic", TopicRouter);
    app.use("api/answer", AnswerRouter);
    app.use("api/question", QuestionRouter);
    app.use("api/quiz", QuizRouter);
    app.use("api/team", TeamController);
  };
  
  module.exports = routes;