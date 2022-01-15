import { serverHttp } from "./http";
import "./websocket"; // When the server starts, it will automatically start the websocket server.

serverHttp.listen(3000, () => console.log("Server is running on port 3000"));
