import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys'
import cron from 'node-cron'
import fs from 'fs'
import config from './config/settings.js'

// importa os eventos modularizados
import registerConnectionEvents from './events/connection.js'
import registerMessageEvents from './events/messages.js'
import registerGroupEvents from './events/groups.js'

const SESSION_DIR = './session'

async function startBot() {

  // cria/usa a pasta session para guardar login
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  })

  sock.ev.on('creds.update', saveCreds)

  // registra eventos externos
  registerConnectionEvents(sock, startBot)
  registerMessageEvents(sock)
  registerGroupEvents(sock)

  // cron configurado externamente
  cron.schedule(config.cronSchedule, () => {
    sock.sendMessage(config.ownerNumber, { text: config.cronMessage })
  })
}

startBot()
