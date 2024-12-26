import { createClient } from '@clickhouse/client';
import {
  CLICKHOUSE_DB,
  CLICKHOUSE_PASSWORD,
  CLICKHOUSE_URL,
  CLICKHOUSE_USER,
} from '../config';

export const clickhouseClient = createClient({
  url: CLICKHOUSE_URL as string,
  database: CLICKHOUSE_DB as string,
  username: CLICKHOUSE_USER as string,
  password: CLICKHOUSE_PASSWORD as string,
});
