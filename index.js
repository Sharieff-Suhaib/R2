const express = require("express");
const multer = require("multer");
const path = require("path");
const { uploadToR2 } = require("./uploadService.js");

const app = express();
const port = 3000;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,"uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), async (req, res) => {
    console.log("Request received:", req.body);
    console.log("File details:", req.file);
    try{
        await uploadToR2(req.file.path,req.file.filename);
        res.send("File uploaded and processed successfully");
    } catch(error){
        res.status(500).send("Error uploading file");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});