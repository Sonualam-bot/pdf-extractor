const app = require("./app");

const dotenv = require("dotenv");

const connectionDatabase = require("./database/db");

// dotenv.config
dotenv.config({ path: "backend/config/config.env" });

//connecting to database
connectionDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
