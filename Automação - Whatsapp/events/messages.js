// guarda o último horário de resposta por usuário
const lastResponseTime = {}

export default function registerMessageEvents(sock) {
  sock.ev.on('messages.upsert', async (msg) => {
    if (msg.type !== 'notify') return

    const m = msg.messages[0]
    if (!m.message || m.key.fromMe) return

    const text = m.message.conversation || m.message.extendedTextMessage?.text || ''
    const lowerText = text.toLowerCase()
    const name = m.pushName || 'amigo'
    const sender = m.key.remoteJid

    console.log(`📩 Mensagem recebida de ${name}: ${text}`)

    // cooldown de 2 horas
    const now = Date.now()
    const cooldown = 2 * 60 * 60 * 1000 // 2h em ms

    if (lastResponseTime[sender] && now - lastResponseTime[sender] < cooldown) {
      console.log(`⏳ Ignorando mensagem de ${name}, ainda em cooldown`)
      return
    }
    lastResponseTime[sender] = now

    try {
      const cumprimentos = ['oi', 'iae', 'eai', 'ei']
      const despedidas = ['tchau', 'flw']

      if (cumprimentos.includes(lowerText)) {
        await sock.sendMessage(sender, { text: `opa👋, a disposição!` })
      } else if (despedidas.includes(lowerText)) {
        await sock.sendMessage(sender, { text: 'flw' })
      } else if (lowerText.includes('horas')) {
        const hora = new Date().toLocaleTimeString('pt-BR')
        await sock.sendMessage(sender, { text: `Agora são ${hora}.` })
      } else if (lowerText.includes('obrigado')) {
        await sock.sendMessage(sender, { text: `De nada! 🙌` })
      } else if (lowerText.includes('piada')) {
        await sock.sendMessage(sender, { text: `Por que o programador foi ao médico? Porque estava com um loop infinito! 😂` })
      } else {
        await sock.sendMessage(sender, { text: `espera só uma coisinha que eu respondo assim que der!\n👍` })
      }
    } catch (err) {
      console.error('❌ Erro ao enviar resposta:', err)
    }
  })
}
