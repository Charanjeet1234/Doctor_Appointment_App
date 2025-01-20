import multer from "multer";

const storage = multer.diskStorage({
    destination: "uploads",
    filename: function(req, file, callback)
    {
        callback(null, file.originalname)
    }
})

// create instance of storage

const upload = multer({storage})

export default upload;