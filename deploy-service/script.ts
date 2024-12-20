import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import Redis from 'ioredis';

dotenv.config();

const {
  AWS_S3_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
  PROJECT_ID,
  REDIS_DB_URL,
} = process.env;

const publisher = new Redis(REDIS_DB_URL as string);
const publishLogs = (log: string) => {
  publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
};

export const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  },
});

const init = async () => {
  console.log('Build started...');
  publishLogs('Build started...');

  const outDirPath = path.join(__dirname, 'output');

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout?.on('data', (data) => {
    console.log(data.toString());
    publishLogs(data.toString());
  });

  p.stdout?.on('error', (data) => {
    console.log('Error:', data.toString());
    publishLogs(`error: ${data.toString()}`);
  });

  p.on('close', async () => {
    console.log('Build completed');
    publishLogs('Build completed');

    const distFolderPath = path.join(outDirPath, 'dist');
    const distFiles = fs.readdirSync(distFolderPath, { recursive: true });

    publishLogs('Starting to upload...');
    for (const file of distFiles) {
      const filePath = path.join(distFolderPath, file as string);
      if (!fs.lstatSync(filePath).isDirectory()) {
        const command = new PutObjectCommand({
          Bucket: AWS_S3_BUCKET,
          Key: `__outputs/${PROJECT_ID}/${file}`,
          Body: fs.createReadStream(filePath),
          ContentType: mime.lookup(filePath) || 'application/octet-stream',
        });

        await s3Client.send(command);

        console.log(`Uploaded: ${file}`);
        publishLogs(`Uploaded: ${file}`);
      }
    }

    console.log('Deployment completed');
    publishLogs('Deployment completed');

    process.exit(0);
  });
};

init();
