const mongoose = require("mongoose");

const connectionDatabase = async () => {
  await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "PDFMern",
    })
    .then((data) => {
      console.log(`connected to MongoDb server: ${data.connection.host} `);
    })
    .catch((error) => {
      console.log("Error Connecting to MongoDB:", error);
    });
};

module.exports = connectionDatabase;
