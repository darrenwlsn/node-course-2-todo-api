const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  region: 'us-east-2'
});

const s3 = new aws.S3();

const upload =
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



const downloadFileFromS3 = async fileName => {
  let params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName
  };

  const resp = new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        // an error occurred
      } else {
        console.log('returned data from s3');
        console.log(data); // successful response
        resolve(data);
      }
    });
  });
  return resp;
};

const downloadFile = async fileName => {
  return await downloadFileFromS3(fileName);
};

const listBucketContents = async () => {
  let params = {
    Bucket: process.env.AWS_BUCKET,
    MaxKeys: 20
  };

  s3.listObjects(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      // an error occurred
      return err;
    } else {
      console.log(data); // successful response
      return data;
    }
  });
};

module.exports = { upload, listBucketContents, downloadFile };
