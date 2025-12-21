let handler = async (m, { conn, args, usedPrefix, isAdmin }) => {
  if (!m.isGroup) return
  if (!isAdmin) return

  const action = args[0]?.toLowerCase()
  if (!global.antilink) global.antilink = {}

  if (!action) {
    return conn.reply(m.chat, `> ⓘ Uso: *${usedPrefix}antilink on/off*`, m)
  }

  if (action === 'on') {
    global.antilink[m.chat] = true
    await m.react('🟢')
  } else if (action === 'off') {
    delete global.antilink[m.chat]
    await m.react('🔴')
  }
}

handler.before = async (m, { conn }) => {
  if (!m.isGroup || m.isBaileys) return
  if (!global.antilink?.[m.chat]) return

  const text = m.text || m.caption
  if (!text) return

  const linkRegex = /(https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/|t\.me\/|instagram\.com\/|facebook\.com\/|youtube\.com\/|youtu\.be\/|x\.com\/|twitter\.com\/|discord\.gg\/|tiktok\.com\/|bit\.ly\/|tinyurl\.com\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i
  if (!linkRegex.test(text)) return

  // 🕐 proceso iniciado
  await m.react('🕐')

  const metadata = await conn.groupMetadata(m.chat)
  const participants = metadata.participants

  const isUserAdmin = participants.some(p => p.id === m.sender && p.admin)
  const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net'
  const isBotAdmin = participants.some(p => p.id === botId && p.admin)

  if (isUserAdmin || !isBotAdmin) return

  try {
    // 🧹 borrar mensaje
    await conn.sendMessage(m.chat, {
      delete: {
        remoteJid: m.chat,
        fromMe: false,
        id: m.key.id,
        participant: m.sender
      }
    })
    await m.react('🧹')

    // ❌ expulsar usuario
    await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    await m.react('✅️')

  } catch (e) {
    console.error(e)
  }
}

handler.help = ['antilink on/off']
handler.tags = ['group']
handler.command = ['antilink']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler