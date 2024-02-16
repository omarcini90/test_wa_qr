import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routers from './routes';
import logger from './utils/logger';
import { errorMiddleware } from './utils/middlewares/error';
import { extractUser } from "./utils/middlewares/auth"
import path from 'path';
import "./data-source"
import "./wa-message/wa-message.consumer"
import { createServer } from 'http'; // import create server from node js http
import { initiateScoket } from "./web-socket" // import the from websocet file


const app = express();
/*
wrap our express app on create server so it will work under node
http server so latter on our websocker share same contex with websocket
*/
export const server = createServer(app)
const port = 3000;

/* server object import to our socker io so it run same
server object as our express app and export it so we wan use it
on logic at other files
*/
export const io = initiateScoket(server)

/*
move this app.get above all app.use so this will not included in all middleware
most important security middleware it this included the html will not allow to
import outside html script
*/
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get("/app", (req, res) => {
  res.sendFile(path.join(__dirname, '/templates/index.html'))
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(extractUser)



app.use(routers)
app.use(errorMiddleware)

server.listen(port, () => {
  logger.info(`Server listening at http://localhost:${port}`);
})

export default app;