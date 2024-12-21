import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as mime from 'mime-types';
import * as path from 'path';
import { Kafka } from 'kafkajs';

dotenv.config();

const {
  AWS_S3_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
  PROJECT_ID,
  DEPLOYMENT_ID,
  KAFKA_USER,
  KAFKA_PASSWORD,
  KAFKA_BROKER,
} = process.env;

const kafka = new Kafka({
  brokers: [KAFKA_BROKER as string],
  clientId: `deploy-service-${DEPLOYMENT_ID}`,
  sasl: {
    username: KAFKA_USER as string,
    password: KAFKA_PASSWORD as string,
    mechanism: 'plain',
  },
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')],
  },
});

const producer = kafka.producer();

const publishLogs = async (log: string) => {
  await producer.send({
    topic: 'deployment-logs',
    messages: [
      { key: 'log', value: JSON.stringify({ PROJECT_ID, DEPLOYMENT_ID, log }) },
    ],
  });
};

export const s3Client = new S3Client({
  region: AWS_S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  },
});

const init = async () => {
  await producer.connect();

  console.log('Build started...');
  await publishLogs('Build started...');

  const outDirPath = path.join(__dirname, 'output');

  const p = exec(`cd ${outDirPath} && npm install && npm run build`);

  p.stdout?.on('data', async (data) => {
    console.log(data.toString());
    await publishLogs(data.toString());
  });

  p.stdout?.on('error', async (data) => {
    console.log('Error:', data.toString());
    await publishLogs(`error: ${data.toString()}`);
  });

  p.on('close', async () => {
    console.log('Build completed');
    await publishLogs('Build completed');

    const distFolderPath = path.join(outDirPath, 'dist');
    const distFiles = fs.readdirSync(distFolderPath, { recursive: true });

    await publishLogs('Starting to upload...');
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
        await publishLogs(`Uploaded: ${file}`);
      }
    }

    console.log('Deployment completed');
    await publishLogs('Deployment completed');

    process.exit(0);
  });
};

init();
