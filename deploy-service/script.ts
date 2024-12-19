import { PutObjectCommand } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';
import { AWS_S3_BUCKET, PROJECT_ID } from './config';
import { s3Client } from './utils/object-store';

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
          Key: `__outputs/${PROJECT_ID}/${filePath}`,
          Body: fs.createReadStream(filePath),
          ContentType: mime.lookup(filePath) || 'application/octet-stream',
        });

        await s3Client.send(command);
      }
    }

    console.log('Deployment completed');
  });
};

init();
