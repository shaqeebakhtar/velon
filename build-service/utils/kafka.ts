import * as fs from 'fs';
import { Kafka } from 'kafkajs';
import * as path from 'path';
import { KAFKA_BROKER, KAFKA_PASSWORD, KAFKA_USER } from '../config';

export const kafka = new Kafka({
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

export const consumer = kafka.consumer({
  groupId: 'build-service-logs-consumer',
});
