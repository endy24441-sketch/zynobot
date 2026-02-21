// ⚡ ZYNO BOT — AntiTag Futuristico
let handler = m => m;

handler.before = async function (m, { conn, isAdmin, isPrems, isBotAdmin, isOwner, isROwner }) {
    if (!m.isGroup) return false;

    const botNumber = conn.decodeJid(conn.user?.jid || conn.user?.id || '');
    const isBot = m.sender === botNumber;

    if (m.mentionedJid && m.mentionedJid.length > 0 && !isBot && !isOwner && !isROwner && !isAdmin && !isPrems) {
        const tagLimit = 40;
        let warnLimit = 3;

        if (m.mentionedJid.length > tagLimit) {
            const userJid = conn.decodeJid(m.sender);

            global.db.data.users[userJid] ??= { warn: 0, warnReasons: [] };
            global.db.data.users[userJid].warn += 1;
            global.db.data.users[userJid].warnReasons.push('tag eccessivi');

            // Cancella messaggio se possibile
            if (isBotAdmin) {
                try {
                    await conn.sendMessage(m.chat, {
                        delete: {
                            remoteJid: m.chat,
                            fromMe: false,
                            id: m.key.id,
                            participant: m.key.participant,
                        },
                    });
                } catch (e) {
                    console.error('Errore nella cancellazione del messaggio:', e);
                }
            }

            let warnCount = global.db.data.users[userJid].warn;
            let remaining = warnLimit - warnCount;

            if (warnCount < warnLimit) {
                await conn.sendMessage(m.chat, { 
                    text: `╔═══━─━─━─━─━─━─━═══╗
⚡ 𝐙𝐘𝐍𝐎 𝚩𝚯𝐓 • ANTI-TAG
╚═══━─━─━─━─━─━─━═══╝

⚠️ Tag massivi rilevati

🔹 Avvertimento: ${warnCount}/${warnLimit}
🔹 Restanti prima dell'espulsione: ${remaining}

Prossima violazione → isolamento dal sistema ZYNO.
━━━━━━━━━━━━━━━━━━`
                });
            } else {
                // Reset warn
                global.db.data.users[userJid].warn = 0;
                global.db.data.users[userJid].warnReasons = [];

                if (isBotAdmin) {
                    try {
                        await conn.groupParticipantsUpdate(m.chat, [userJid], 'remove');
                        await conn.sendMessage(m.chat, { 
                            text: `⛔ @${userJid.split('@')[0]} ESPULSO DAL SISTEMA ZYNO DOPO 3 VIOLAZIONI`,
                            mentions: [userJid]
                        });
                    } catch {
                        await conn.sendMessage(m.chat, { 
                            text: `⚠️ @${userJid.split('@')[0]} DOVREBBE ESSERE ESPULSO, MA IL BOT NON È ADMIN`,
                            mentions: [userJid]
                        });
                    }
                } else {
                    await conn.sendMessage(m.chat, { 
                        text: `⚠️ @${userJid.split('@')[0]} DOVREBBE ESSERE ESPULSO, MA IL BOT NON È ADMIN`,
                        mentions: [userJid]
                    });
                }
            }

            return true;
        }
    }

    return false;
};

export default handler;