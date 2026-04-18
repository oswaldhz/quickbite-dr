require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

start();

module.exports = { app, server };