const serverless = require('serverless-http');
const express = require('express');
const app = require('../server');

const handlerApp = express();
handlerApp.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});
handlerApp.use(app);

module.exports.handler = serverless(handlerApp);
