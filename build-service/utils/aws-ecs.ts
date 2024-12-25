import { ECSClient } from '@aws-sdk/client-ecs';
import {
  AWS_ECS_ACCESS_KEY_ID,
  AWS_ECS_REGION,
  AWS_ECS_SECRET_ACCESS_KEY,
} from '../config';

export const ecsClient = new ECSClient({
  region: AWS_ECS_REGION as string,
  credentials: {
    accessKeyId: AWS_ECS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_ECS_SECRET_ACCESS_KEY as string,
  },
});
