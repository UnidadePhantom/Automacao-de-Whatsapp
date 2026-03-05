import qrcode from 'qrcode-terminal'
import { DisconnectReason } from '@whiskeysockets/baileys'
import config from '../config/settings.js'

export default function registerConnectionEvents(sock, startBot) {
  sock.ev.on('connection.update', (update) => {
    const { qr, connection, lastDisconnect } = update

    if (qr) qrcode.generate(qr, { small: true })

    if (connection === 'open') {
      console.log(`✅ ${config.botName} conectado com sucesso!`)
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log('❌ Conexão fechada...', reason)

      // só reinicia se não for logout
      if (reason !== DisconnectReason.loggedOut) {
        startBot()
      } else {
        console.log('⚠️ Sessão expirada, escaneie o QR novamente.')
        // não chama startBot() de novo, deixa o processo aberto
      }
    }
  })
}
