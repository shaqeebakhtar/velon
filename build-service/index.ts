import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { generateSlug } from 'random-word-slugs';

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
} = process.env;

const port = PORT || 9000;
const app: Express = express();

app.use(express.json());

const ecsClient = new ECSClient({
  region: AWS_ECS_REGION as string,
  credentials: {
    accessKeyId: AWS_ECS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_ECS_SECRET_ACCESS_KEY as string,
  },
});

app.post('/project', async (req: Request, res: Response) => {
  const { repositoryUrl } = req.body;
  const projectSlug = generateSlug();

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

app.listen(port, () => console.log(`Build service is running on port ${port}`));
