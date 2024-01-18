import dotenv from 'dotenv'
import "colors";
import express from "express";
import cors from "cors";

if (process.env.ENVFILE) {
  dotenv.config({ path: process.env.ENVFILE });
} else {
  dotenv.config();
}

import logger from "./logger.js";

const app = express();
app.use(cors())

const welcome = [
  "",
  "                                                                   ",
  " *    * ***** ***** *****        *****  *****   ****  *    * *   * ",
  " *    *   *     *   *    *       *    * *    * *    *  *  *   * *  ",
  " ******   *     *   *    * ***** *    * *    * *    *   **     *   ",
  " *    *   *     *   *****        *****  *****  *    *   **     *   ",
  " *    *   *     *   *            *      *   *  *    *  *  *    *   ",
  " *    *   *     *   *            *      *    *  ****  *    *   *   ",
  "                                                                   ",
  "",
].map(row => row.replace(/\s/g, '#'.blue).replace(/\*/g, '#'.yellow)).join("\n");
logger.info(welcome);

const PORT = 8213;

const customHeader = process.env.CUSTOM_HEADER ?? "token";
const urlBase = () => {
  return process.env.REMOTE_URL ?? "https://www.google.com"
}

app.use((req, res) => {
    const url = urlBase() + req.originalUrl;
    const requestInit = {
      method: req.method,
      headers: {
        [customHeader]: req.headers["customHeader"],
        "Content-Type": "application/json",
      },
    }
    let childLogger = logger.child({url, requestInit});

    res.setHeader("Content-Type", "application/json");

    fetch(url, requestInit).then(async (response) => {
      res.statusCode = response.status;
      if (response.ok) {
        return response.json(); // o response.text() si esperas texto en lugar de un objeto JSON
      } else {
        childLogger = childLogger.child({
          status: response.status,
          statusText: response.statusText,
        })
        throw new Error(await response.text());
      }
    }).then((data) => {
      childLogger.info({jsonLength: data.length}, 'Nueva solicitud respondida de forma satisfactoria');
      res.write(JSON.stringify(data));
      res.end();
    }).catch((error) => {
      childLogger.error(error.stack);
      res.write(
        error.message
      );
      res.end();
    });
}).listen(PORT, () => {
  const PORT_VALUE = `${PORT}`.yellow
  const HTTP_PROXY_SERVER = "http proxy server".blue;
  const STARTED = "started".green;
  const ON_PORT = "on port".blue;
  logger.info(
    `${HTTP_PROXY_SERVER} ${STARTED} ${ON_PORT} ${PORT_VALUE}
      `
  );
});
