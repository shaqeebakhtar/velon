import dotenv from 'dotenv';

dotenv.config();

export const {
  AWS_S3_REGION,
  AWS_S3_BUCKET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  PROJECT_ID,
} = process.env;
