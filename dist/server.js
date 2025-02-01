"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SocialProfile_1 = __importDefault(require("./Routes/social/SocialProfile"));
const ErrorMiddleware_1 = require("./middlewares/ErrorMiddleware");
const DB_1 = __importDefault(require("./DB"));
const dotenv_1 = require("dotenv");
const UserRoutes_1 = __importDefault(require("./Routes/auth/UserRoutes"));
const SocialFollowers_1 = __importDefault(require("./Routes/social/SocialFollowers"));
const SocialPost_1 = __importDefault(require("./Routes/social/SocialPost"));
const SocialLike_1 = __importDefault(require("./Routes/social/SocialLike"));
const SocialComment_1 = __importDefault(require("./Routes/social/SocialComment"));
const chats_1 = __importDefault(require("./Routes/chat/chats"));
const message_routes_1 = __importDefault(require("./Routes/chat/message.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const socket_1 = require("./socket");
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
(0, DB_1.default)(); // calling the DB connect function here
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
app.set("io", io); //setting the socket io server instance to the app to get it later in the app to emit events
// console.log(app)
(0, socket_1.initializeSocket)(io);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/users", UserRoutes_1.default);
app.use("/api/v1/social", SocialProfile_1.default, SocialFollowers_1.default, SocialPost_1.default, SocialLike_1.default, SocialComment_1.default);
app.use("/api/v1/chat", chats_1.default);
app.use("/api/v1/message", message_routes_1.default);
app.use(ErrorMiddleware_1.errorHandler);
server.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
});
