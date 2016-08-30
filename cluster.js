const cluster = require('cluster');
const http = require('http');
const colors = require('colors');

let numberOfRequest = 0;
const printNumberOfRequest = () => {
  // Keep track of http requests
   setInterval(() => {
    console.log(`Number of Request ${numberOfRequest}`.bold.green);
  }, 1000);

  // Print every 5 minute a report
   setInterval(() => {
     console.log(`***** Report *****`.red.bold);
     console.log(`Total number of requests: ${numberOfRequest}`.red);
     Object.keys(cluster.workers).forEach(function (workerId, index) {
       let color = index % 2 === 0 ? 'blue' : 'yellow';
       console.log(`${index+1}) Worker ${workerId} handle ${cluster.workers[workerId].NumberOfHandledRequest}`[color]);
     });
  }, 5000)
};

if (cluster.isMaster) {

  printNumberOfRequest();
  // Count requests
  function messageHandler(msg) {
    if (isNaN(cluster.workers[this.id].NumberOfHandledRequest)) {
      cluster.workers[this.id].NumberOfHandledRequest = 0;
    } else {
      cluster.workers[this.id].NumberOfHandledRequest++;
    }
    console.log(`Worker ${this.id} handle a request: ${msg.headers['user-agent']}`.blue);
    if (msg.cmd && msg.cmd == 'notifyRequest') {
      numberOfRequest += 1;
    }
  }

  // Start workers and listen for messages containing notifyRequest
  const numCPUs = require('os').cpus().length;
  console.log(`Number of Processes ${numCPUs}`.green);
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  Object.keys(cluster.workers).forEach((id) => {
    cluster.workers[id].on('message', messageHandler);
  });

} else {

  // Worker processes have a http server.
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('Done processing request\n');
    process.send({ cmd: 'notifyRequest', headers: req.headers });
  }).listen(8000);
}