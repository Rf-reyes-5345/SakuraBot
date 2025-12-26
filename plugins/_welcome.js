import { WAMessageStubType } from '@whiskeysockets/baileys'

let handler = m => m
handler.before = async function (m, { conn }) {
    if (!m.messageStubType || !m.isGroup) return true;

    let chat = global.db.data.chats[m.chat];

    if (!chat.welcome) return true;

    const userId = m.messageStubParameters[0];
    if (!userId) return true; 

    let groupMetadata;
    try {
        groupMetadata = await conn.groupMetadata(m.chat);
    } catch (e) {
        return true;
    }

    const groupName = groupMetadata.subject;
    const membersCount = groupMetadata.participants.length; 
    
    const mentionId = userId.split('@')[0];
    const mentionsList = [userId]; 

    const welcomeImageUrl = 'https://cdn.russellxz.click/6ae2181d.jpg';
    const goodbyeImageUrl = 'https://cdn.russellxz.click/9f98f272.jpg';
    
    // Lógica de Bienvenida (ADD)
    if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const finalCount = membersCount + 1; 
        
        let welcomeText = `✨ *¡Bienvenido/a a ${groupName}!* ✨\n\n`;
        welcomeText += `👋 Hola, @${mentionId}!\n`;
        welcomeText += `🎉 Ahora somos *${finalCount}* miembros.\n`; 
        welcomeText += `📜 Por favor, lee la descripción y respeta las normas.\n\n`;
        welcomeText += `*¡Disfruta tu estancia querid@!* 🥳`;

        await conn.sendMessage(m.chat, {
            image: { url: welcomeImageUrl },
            caption: welcomeText,
            mentions: mentionsList
        });
    }

    // Lógica de Despedida (REMOVE/LEAVE)
    if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
        const finalCount = membersCount - 1; 

        let goodbyeText = `👋 *¡Adiós, @${mentionId}!* 👋\n\n`;
        goodbyeText += `📉 El grupo *${groupName}* pierde a un miembro.\n`;
        goodbyeText += `🕊️ Ahora somos *${finalCount}* miembros.\n\n`; 
        goodbyeText += `¡Esperamos verte pronto!`;

        await conn.sendMessage(m.chat, {
            image: { url: goodbyeImageUrl },
            caption: goodbyeText,
            mentions: mentionsList
        });
    }
    
    return true; 
};

handler.group = true; 

export default handler;
