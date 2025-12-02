// plugins/owner-rootowner.js
let handler = async (m, { conn, usedPrefix, isROwner }) => {
    if (!isROwner) return m.reply('🚫 Solo el creador puede usar este comando')
    
    let chat = global.db.data.chats[m.chat]
    let args = m.text.trim().split(' ').slice(1)
    let action = args[0]?.toLowerCase()

    if (!action || (action !== 'on' && action !== 'off')) {
        let status = chat.rootowner ? '✅ ACTIVADO' : '❌ DESACTIVADO'
        return m.reply(`╭─「 🛡️ *ROOTOWNER* 🛡️ 」
│ 
│ Estado: ${status}
│ 
│ *Uso:*
│ ${usedPrefix}rootowner on
│ ${usedPrefix}rootowner off
╰─◉`)
    }

    if (action === 'on') {
        chat.rootowner = true
        m.reply(`✅ *RootOwner Activado*\n\nAhora solo tú puedes usar comandos en este grupo.`)
    } else {
        chat.rootowner = false
        m.reply(`✅ *RootOwner Desactivado*\n\nAhora todos pueden usar comandos.`)
    }
}

handler.help = ['rootowner']
handler.tags = ['owner']
handler.command = /^(rootowner|soloyo|onlyme)$/i
handler.group = true
handler.rowner = true

export default handler