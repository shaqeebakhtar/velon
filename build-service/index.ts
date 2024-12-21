import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { createClient } from '@clickhouse/client';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import { Kafka } from 'kafkajs';
import * as path from 'path';
import { generateSlug } from 'random-word-slugs';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const {
  PORT,
  AWS_S3_REGION,
  AWS_S3_BUCKET,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_ECS_REGION,
  AWS_ECS_CLUSTER,
  AWS_ECS_TASK,
  AWS_ECS_ACCESS_KEY_ID,
  AWS_ECS_SECRET_ACCESS_KEY,
  CLICKHOUSE_URL,
  CLICKHOUSE_DB,
  CLICKHOUSE_USER,
  CLICKHOUSE_PASSWORD,
  KAFKA_BROKER,
  KAFKA_USER,
  KAFKA_PASSWORD,
} = process.env;

const port = PORT || 9000;
const app: Express = express();

const io = new Server();

app.use(express.json());

const clickhouseClient = createClient({
  host: CLICKHOUSE_URL as string,
  database: CLICKHOUSE_DB as string,
  username: CLICKHOUSE_USER as string,
  password: CLICKHOUSE_PASSWORD as string,
});

const kafka = new Kafka({
  clientId: 'build-service',
  brokers: [KAFKA_BROKER as string],
  sasl: {
    username: KAFKA_USER as string,
    password: KAFKA_PASSWORD as string,
    mechanism: 'plain',
  },
  ssl: {
    ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')],
  },
});

const ecsClient = new ECSClient({
  region: AWS_ECS_REGION as string,
  credentials: {
    accessKeyId: AWS_ECS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_ECS_SECRET_ACCESS_KEY as string,
  },
});

app.post('/project', async (req: Request, res: Response) => {
  const { repositoryUrl, slug } = req.body;
  const projectSlug = slug ?? generateSlug();

  const command = new RunTaskCommand({
    cluster: AWS_ECS_CLUSTER as string,
    taskDefinition: AWS_ECS_TASK as string,
    launchType: 'FARGATE',
    count: 1,
    networkConfiguration: {
      awsvpcConfiguration: {
        assignPublicIp: 'ENABLED',
        subnets: [
          'subnet-0ef829913c641e9d1',
          'subnet-0ac3e1be8cc3058bf',
          'subnet-03acd400dd8be08eb',
        ],
        securityGroups: ['sg-0cb2648df020809c0'],
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: 'deploy-image',
          environment: [
            {
              name: 'GIT_REPOSITORY_URL',
              value: repositoryUrl,
            },
            {
              name: 'PROJECT_ID',
              value: projectSlug,
            },
            {
              name: 'DEPLOYMENT_ID',
              value: uuidv4(),
            },
            {
              name: 'AWS_S3_REGION',
              value: AWS_S3_REGION as string,
            },
            {
              name: 'AWS_S3_BUCKET',
              value: AWS_S3_BUCKET as string,
            },
            {
              name: 'AWS_ACCESS_KEY_ID',
              value: AWS_S3_ACCESS_KEY_ID as string,
            },
            {
              name: 'AWS_SECRET_ACCESS_KEY',
              value: AWS_S3_SECRET_ACCESS_KEY as string,
            },
            {
              name: 'KAFKA_BROKER',
              value: KAFKA_BROKER as string,
            },
            {
              name: 'KAFKA_USER',
              value: KAFKA_USER as string,
            },
            {
              name: 'KAFKA_PASSWORD',
              value: KAFKA_PASSWORD as string,
            },
          ],
        },
      ],
    },
  });

  await ecsClient.send(command);

  res.status(200).json({
    status: 'queued',
    data: {
      projectSlug,
      url: `http://${projectSlug}.localhost:8000`,
    },
  });
});

const consumer = kafka.consumer({ groupId: 'build-service-logs-consumer' });

const init = async () => {
  await consumer.connect();
  await consumer.subscribe({ topics: ['deployment-logs'] });

  await consumer.run({
    autoCommit: false,
    eachBatch: async ({
      batch,
      heartbeat,
      commitOffsetsIfNecessary,
      resolveOffset,
    }) => {
      const messages = batch.messages;
      for (const message of messages) {
        const { DEPLOYMENT_ID, log } = JSON.parse(
          message?.value?.toString() as string
        );

        try {
          const { query_id } = await clickhouseClient.insert({
            table: 'deployment_logs',
            values: [
              {
                log_id: uuidv4(),
                deployment_id: DEPLOYMENT_ID,
                log,
              },
            ],
            format: 'JSONEachRow',
          });

          console.log(query_id);

          resolveOffset(message.offset);
          await commitOffsetsIfNecessary();
          await heartbeat();
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
};
init();

io.on('connection', (socket) => {
  socket.on('subscribe_logs', (slug) => {
    socket.join(slug);
  });
});

app.listen(port, () => console.log(`Build service is running on port ${port}`));
io.listen(9001);
