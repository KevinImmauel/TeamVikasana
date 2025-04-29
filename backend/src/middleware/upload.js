const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        console.log(file.name);
        cb(null, file.originalname);
    },

});


const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true); // Accept the file
        } else {
            cb(null, false); // Reject the file
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 10, // Set file size limit to 10MB
    },
});

module.exports = upload;
