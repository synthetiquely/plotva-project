const cloudinary = require('cloudinary');

const profileImage = (req, res) => {
  cloudinary.uploader
    .upload_stream(result => {
      //TODO: save it to user
      res.json({
        result: result,
      });
    })
    .end(req.file.buffer);
};

module.exports = {
  profileImage,
};
