const autocannon = require("autocannon");
const { PassThrough } = require("stream");

function run(url) {
  const buffer = [];
  const output = new PassThrough();
  const instance = autocannon({
    url,
    connections: 100,
    duration: 20,
  });
  autocannon.track(instance, { outputStream: output });
  output.on("data", (data) => buffer.push(data));
  instance.on("done", () => process.stdout.write(Buffer.concat(buffer)));
}

run("http://localhost:8080/info");
