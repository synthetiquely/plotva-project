const cloudinary = require('cloudinary');

const profileImage = (req, res) => {
  cloudinary.uploader
    .upload_stream(result => {
      res.json({
        result: result,
      });
    })
    .end(req.file.buffer);
};

module.exports = {
  profileImage,
};
