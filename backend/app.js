const mongoose = require("mongoose");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const { PDFDocument } = require("pdf-lib");

const app = express();

app.use(express.json({ limit: "50mb" }));

// Enable CORS for cross-origin requests
const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

// Set the storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Files will be stored in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // storing pdf with original filename
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle file upload
app.post("/upload", upload.single("pdfFile"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
  } else {
    res.json({
      message: "File uploaded successfully",
      filename: req.file.originalname,
    });
  }
});

// Serving the uploaded files
app.use("/files", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to PDFFF");
});

module.exports = app;
