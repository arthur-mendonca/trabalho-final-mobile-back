const express = require("express");
require("dotenv").config();

const db = require("./db/models");
const app = express();

const port = process.env.PORT || 5000;

async function connectDB() {
  try {
    await db.sequelize.authenticate();
  } catch (error) {
    const code = (error && (error.parent?.code || error.original?.code || error.code)) || 'unknown';
    console.error(`🔁 Conexão ao banco de dados falhou: ${code} - ${error.message}`);
  }
}

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log("🚀 Servidor escutando na porta " + port);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exitCode = 1;
  }
};

process.on('SIGINT', async () => {
  try { await db.sequelize.close(); } catch { }
  process.exit(0);
});
process.on('SIGTERM', async () => {
  try { await db.sequelize.close(); } catch { }
  process.exit(0);
});

startServer()

module.exports = app;