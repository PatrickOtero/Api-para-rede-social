const { S3 } = require("aws-sdk");
require("dotenv").config();

const s3Client = new S3({
  endpoint: "sfo3.digitaloceanspaces.com",
  region: "us-east-1",
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

const sendImage = async (identity, image) => {
  return await s3Client
    .putObject({
      Bucket: process.env.SPACES_BUCKET,
      Key: identity,
      Body: image,
      ACL: "public-read",
    })
    .promise();
};

const deleteImage = async (identity) => {
  return await s3Client
    .deleteObject({
      Bucket: process.env.SPACES_BUCKET,
      Key: identity,
    })
    .promise();
};

const completeUrl = (identity) => {
  return (
    "https://" +
    process.env.SPACES_BUCKET +
    ".sfo3.digitaloceanspaces.com/" +
    identity
  );
};

module.exports = { sendImage, deleteImage, completeUrl };
