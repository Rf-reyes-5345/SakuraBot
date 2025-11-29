const handler = async (m, { conn, text, participants, isAdmin, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return
  if (!isAdmin) return

  // Obtener usuario target
  let targetUser = null
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    targetUser = m.mentionedJid[0]
  } else if (m.quoted) {
    targetUser = m.quoted.sender
  }

  if (!targetUser) return

  // Verificar que el target está en el grupo
  const userInGroup = participants.find(p => p.id === targetUser)
  if (!userInGroup) return

  // Verificar si ya es admin
  if (userInGroup.admin === 'admin' || userInGroup.admin === 'superadmin') return

  await m.react('🕒')

  try {
    // Dar admin
    await conn.groupParticipantsUpdate(m.chat, [targetUser], 'promote')
    await m.react('✅')

  } catch (error) {
    await m.react('❌')
  }
}

handler.help = ['promote']
handler.tags = ['group']
handler.command = /^(promote)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler