const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '../uploads');

if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true});
  console.log('Upload directory has been created');
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + `${safeName}`);
  }
});

const upload = multer({storage: storage});

module.exports = upload;