import express from 'express';
import httpProxy from 'http-proxy';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();

const proxy = httpProxy.createProxy();

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split('.')[0];

  const resolveToPath = `${process.env.AWS_S3_BASEPATH}/${subdomain}`;

  return proxy.web(req, res, { target: resolveToPath, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req) => {
  const url = req.url;
  if (url === '/') proxyReq.path += 'index.html';
});

app.listen(port, () => console.log(`Reverse proxy is running on port ${port}`));
