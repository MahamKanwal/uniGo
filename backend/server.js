import app from "./src/app.js";
import _config from "./src/config/config.js";
import connectDb from "./src/config/db.js";

const port = _config.port || 3000;
const startServer = async () => {
  await connectDb();
  app.listen(port, () => {
    console.log("Server is running on port ", port);
  });
};
startServer();
