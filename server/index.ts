import http from "http";
import { createInitState } from "../src/state/index.js";

const server = http.createServer((_, res) => {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(createInitState()));
});

server.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});
