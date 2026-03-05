export default function registerGroupEvents(sock) {
    sock.ev.on('group-participants.update', async (update) => {
      console.log('👥 Atualização de grupo:', update)
      // exemplo: dar boas-vindas a novos membros
      if (update.action === 'add') {
        for (const participant of update.participants) {
          await sock.sendMessage(update.id, { text: `Bem-vindo(a) ${participant}! 🎉` })
        }
      }
    })
  }
  