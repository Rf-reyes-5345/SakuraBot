let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isAdmin) return m.reply('Solo los administradores pueden usar este comando.')

  const action = args[0]?.toLowerCase()
  if (!global.antilink) global.antilink = {}

  if (!action) {
    return conn.reply(m.chat, `> ⓘ Uso correcto:\n*\( {usedPrefix + command} on* → Activar antilink\n* \){usedPrefix + command} off* → Desactivar antilink`, m)
  }

  if (action === 'on') {
    global.antilink[m.chat] = true
    await conn.reply(m.chat, '✅ *Antilink activado* en este grupo.\nLos usuarios que envíen enlaces serán eliminados automáticamente.', m)
    await m.react('✅')
  } else if (action === 'off') {
    delete global.antilink[m.chat]
    await conn.reply(m.chat, '❌ *Antilink desactivado* en este grupo.', m)
    await m.react('✅')
  } else {
    await conn.reply(m.chat, '❌ Opción inválida. Usa *on* o *off*.', m)
  }
}

handler.before = async (m, { conn, isAdmin, isBotAdmin }) => {
  // Condiciones para ignorar
  if (m.isBaileys) return
  if (!m.isGroup) return
  if (isAdmin) return
  if (!global.antilink?.[m.chat]) return

  const text = m.text || m.caption || ''
  if (!text) return

  // Regex para detectar enlaces
  const linksRegex = /https?:\/\/[^\s]*|www\.[^\s]*|wa\.me\/[0-9]+|chat\.whatsapp\.com\/[A-Za-z0-9]+|t\.me\/[^\s]*|instagram\.com\/[^\s]*|facebook\.com\/[^\s]*|youtube\.com\/[^\s]*|youtu\.be\/[^\s]*|twitter\.com\/[^\s]*|x\.com\/[^\s]*|discord\.gg\/[^\s]*|tiktok\.com\/[^\s]*|bit\.ly\/[^\s]*|tinyurl\.com\/[^\s]*|goo\.gl\/[^\s]*|ow\.ly\/[^\s]*|buff\.ly\/[^\s]*|adf\.ly\/[^\s]*|shorte\.st\/[^\s]*|snip\.ly\/[^\s]*|cutt\.ly\/[^\s]*|is\.gd\/[^\s]*|v\.gd\/[^\s]*|cli\.gs\/[^\s]*|bc\.vc\/[^\s]*|tr\.im\/[^\s]*|prettylink\.pro\/[^\s]*|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?/gi

  if (linksRegex.test(text)) {
    if (!isBotAdmin) return // Bot necesita ser admin

    try {
      // 1. Reaccionar con escoba al mensaje con el link
      await m.react('🧹')

      // 2. Eliminar el mensaje (revoke)
      await conn.sendMessage(m.chat, {
        protocolMessage: {
          key: m.key,
          type: 3 // REVOKE
        }
      })

      // 3. Expulsar al usuario
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')

    } catch (error) {
      console.error('Error en antilink:', error)
      // En caso de fallo, intentar al menos reaccionar
      try {
        await m.react('❌')
      } catch {}
    }
  }
}

handler.help = ['antilink']
handler.tags = ['group']
handler.command = /^(antilink)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler