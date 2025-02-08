const UserRouter = require("./UserRouter")
const TopicRouter = require("./TopicRouter")
const QuestionRouter = require("./QuestionRouter")
const QuizRouter = require("./QuizRouter")
const TeamRouter = require("./TeamRouter")
const RequestJoinRouter = require("./RequestJoinRouter")
const ResultRouter = require("./ResultRouter")
const PostRouter = require("./PostRouter")
const CommentRouter = require("./CommentRouter")
const FriendRouter = require("./FriendRouter")
const ConversationRouter = require("./ConversationRouter")
const MessageRouter = require("./MessageRouter")
const routes = (app) => {
    app.use("/api/user", UserRouter);
    app.use("/api/topic", TopicRouter);
    app.use("/api/question", QuestionRouter);
    app.use("/api/quiz", QuizRouter);
    app.use("/api/team", TeamRouter);
    app.use("/api/request-join", RequestJoinRouter);
    app.use("/api/result", ResultRouter);
    app.use("/api/post", PostRouter);
    app.use("/api/comment", CommentRouter);
    app.use("/api/friend", FriendRouter);
    app.use("/api/conversation", ConversationRouter);
    app.use("/api/message", MessageRouter);
  };
  
  module.exports = routes;