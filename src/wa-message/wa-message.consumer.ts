import { Client, ClientOptions, LocalAuth, Message } from "whatsapp-web.js"
import qrcode from "qrcode-terminal"
import logger from "../utils/logger";
import { io } from "..";
import config from "../config";

const waNumbers = ['5215555059804']

const clients: Record<string, Client> = {}

waNumbers.forEach((waNumber) => {
  const clientConfig: ClientOptions = {
    webVersionCache: {
        type: 'local',
        path: config.wa_session_file_path + "/.web_cache"
      },
    authStrategy: new LocalAuth({
      clientId: waNumber,
      dataPath: config.wa_session_file_path
    })
  }

  const client = new Client(clientConfig)

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
    io.emit(waNumber + '_qr', qr)
  })

  client.on('authenticated', (session) => {
    logger.info(`Client ${waNumber} authenticated`)
  })

  client.on('ready', () => {
    logger.info(`Client ${waNumber} ready`)
  })

  client.on('message', (message: Message) => {
    logger.info(`Client ${waNumber} received message: ${message.body}`)
    client.sendMessage(message.from, `You said: ${message.body}`)
  })

  clients[waNumber] = client

  client.initialize()

})

export default clients