import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import Redis from 'ioredis';
import { generateSlug } from 'random-word-slugs';
import { Server } from 'socket.io';

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
  REDIS_DB_URL,
} = process.env;

const port = PORT || 9000;
const app: Express = express();

const io = new Server();

const subscriber = new Redis(REDIS_DB_URL as string);

app.use(express.json());

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
              name: 'REDIS_DB_URL',
              value: REDIS_DB_URL as string,
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

io.on('connection', (socket) => {
  socket.on('subscribe_logs', (slug) => {
    socket.join(slug);
  });
});

subscriber.psubscribe('logs:*');
subscriber.on('pmessage', (_, channel, message) => {
  io.to(channel).emit('log', message);
});

app.listen(port, () => console.log(`Build service is running on port ${port}`));
io.listen(9001);
