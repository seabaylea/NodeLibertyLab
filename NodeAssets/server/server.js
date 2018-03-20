// Uncomment following to enable zipkin tracing, tailor to fit your network configuration:
var appzip = require('appmetrics-zipkin')({
    host: 'localhost',
     port: 9411,
     serviceName:'NodeMicroservice'
});

require('appmetrics-dash').attach();
require('appmetrics-prometheus').attach();

const http = require('http');
const appName = require('./../package').name;
const express = require('express');
const log4js = require('log4js');
const localConfig = require('./config/local.json');
const path = require('path');

const logger = log4js.getLogger(appName);
const app = express();
app.use(log4js.connectLogger(logger, { level: process.env.LOG_LEVEL || 'info' }));
const serviceManager = require('./services/service-manager');
require('./services/index')(app);
require('./routers/index')(app);

// Add your code here

const port = process.env.PORT || localConfig.port;
app.listen(port, function(){
  logger.info(`ExpressjsMicroserviceUJRZS listening on http://localhost:${port}/appmetrics-dash`);
  
});

var options = {
  host: 'localhost',
  port: 9080,
  path: '/JavaMicroservice/',
  headers: {
    'Accept': 'text/html'
  }
};

app.get('/', (req, res) => {
    http.get(options, resp => {
        resp.setEncoding("utf8");
        let body = "";
        resp.on("data", data => {
            body += data;
        });
        resp.on("end", () => {
            res.send(body)
        });
    });
});

app.use(function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/assets', '404.html'));
})

app.use(function (err, req, res, next) {
  res.sendFile(path.join(__dirname, '../public/assets', '500.html'));
})
