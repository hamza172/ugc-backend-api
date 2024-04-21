// import { S3 } from 'aws-sdk';
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { fromIni } = require("@aws-sdk/credential-providers");
const { fromEnv } = require("@aws-sdk/credential-providers");

const credentails = fromIni({ profile: "s3_login" });

const fileUpload = async (file) => {
  if (!file) return null
  // set Unique Name of file
  const generateUniqueFileName = (originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    return `${timestamp}-${randomString}-${originalFileName}`;
  };

  // bucket initialization
  const s3BucketName = process.env.AWS_BUCKET_NAME;
  const s3BucketRegion = process.env.AWS_BUCKET_REGION;
  const s3 = new S3Client({ region: s3BucketRegion, credentials: fromEnv() });

  // Store File
  let profileImage = null;
  if (file) {
    const s3UploadParams = new Upload({
      client: s3,
      params: {
        Bucket: s3BucketName,
        Key: generateUniqueFileName(file.originalname),
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });
    await s3UploadParams.done();
    profileImage = s3UploadParams;
  }
  return profileImage.singleUploadResult.Location;
};

module.exports = fileUpload;
