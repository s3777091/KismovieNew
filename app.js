var app = require("./index");
var http = require("http");
var https = require('https');

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

const cluster = require("cluster"),
   os = require('os');

if (cluster.isMaster) {
  const cpus = os.cpus().length;

    console.log(`Taking advantage of ${cpus} CPUs`)
    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }
    // set console's directory so we can see output from workers
    console.dir(cluster.workers, {depth: 0});

    // initialize our CLI 
    process.stdin.on('data', (data) => {
        initControlCommands(data);
    })

    cluster.on('exit', (worker, code) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`);
            const nw = cluster.fork();
            console.log(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
        }
    });

    console.log(`Master PID: ${process.pid}`)
} else {
  var port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

  var server = http.createServer(app);


  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);


  function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
  }
}