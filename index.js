const path = require("path");
const fastifyCookie = require("fastify-cookie");
require('dotenv').config()
const fastify = require("fastify");
const app = fastify();
const compression = require("compression");
const phimbo = require("./routes/series");
const appchinh = require("./routes/index");

const common = require("./src/common");
const run_database = common.initDb();
const region = common.initRegion();
const catagory = common.initCategory();

Promise.all([region, catagory, run_database]);

app.register(fastifyCookie);
app.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: path.join(__dirname, "views"),
});
app.register(require("fastify-static"), {
  root: path.join(__dirname, "public"),
});

app.register(appchinh);
app.register(phimbo);

app.register(
  compression({
    level: 1,
    filter: (req, res) => {
      if (req.header["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

const start = async () => {
  try {
    await app.listen(process.env.PORT);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

const cluster = require("cluster"),
  os = require("os");

if (cluster.isMaster) {
  const cpus = os.cpus().length;

  console.log(`Taking advantage of ${cpus} CPUs`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  // set console's directory so we can see output from workers
  console.dir(cluster.workers, { depth: 0 });

  process.stdin.on("data", (data) => {
    initControlCommands(data);
  });

  cluster.on("exit", (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(
        `\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`
      );
      const nw = cluster.fork();
      console.log(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
    }
  });

  console.log(`Master PID: ${process.pid}`);
} else {
  start();
}
