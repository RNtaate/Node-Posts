const multer = require('multer');
const path = require('path');

//set up the multer storage
const multerStorage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname + path.extname(file.originalname))
  }
})

//checkFileType function
const checkFileType = (file, cb) => {
  const fileTypes = /jpeg|jpg|gif|png/;

  const extensionName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

  const mimetype = fileTypes.test(file.mimetype)

  if(mimetype && extensionName) {
    return cb(null, true);
  } else {
    cb("Error: Images only!")
  }
}

// initialise the image upload
const multerUpload = multer({
  storage: multerStorage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('postimage');

module.exports = multerUpload;