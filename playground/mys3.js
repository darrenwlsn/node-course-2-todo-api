app.post('/upload', upload, function (req, res, next) {
  // upload.array('file', 1)
  next();
  res.status(200).send('Uploaded!');
});


const upload = (req, res, next) => {
  multer({
    storage: multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: process.env.AWS_BUCKET,
      key: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname); //use Date.now() for unique file keys
      }
    })
  });
  const result = instance.array('file', 1);
  next(req, res);
};