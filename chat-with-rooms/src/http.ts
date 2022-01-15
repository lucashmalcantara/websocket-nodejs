import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();

const staticFilesPath = path.join(__dirname, "..", "public");
app.use(express.static(staticFilesPath));

const serverHttp = http.createServer(app);

const io = new Server(serverHttp);

export { serverHttp, io };
