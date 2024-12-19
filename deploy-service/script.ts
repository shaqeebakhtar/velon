import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';

dotenv.config();

const {
  AWS_S3_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
  PROJECT_ID,
} = process.env;

export const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  },
});

const init = async () => {
  const outDirPath = path.join(__dirname, 'output');

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout?.on('data', (data) => {
    console.log(data.toString());
  });

  p.stdout?.on('error', (data) => {
    console.log('Error:', data.toString());
  });

  p.on('close', async () => {
    console.log('Build completed');

    const distFolderPath = path.join(outDirPath, 'dist');
    const distFiles = fs.readdirSync(distFolderPath, { recursive: true });

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
      }
    }

    console.log('Deployment completed');
  });
};

init();
