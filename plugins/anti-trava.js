export async function before(m, { conn, isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.isGroup) return false;

    let chat = global.db.data.chats[m.chat] || {};
    let bot = global.db.data.settings[this.user.jid] || {};

    if (chat.antiTrava && m.text.length > 4000) {
        const name = await conn.getName(m.sender);

        // 🩸 ADMIN IMMUNE
        if (isAdmin) {
            return await conn.sendMessage(m.chat, { 
                text: `☠️ 𝐙𝐘𝐍𝐎 𝚩𝚯𝐓 ☠️

@${m.sender.split("@")[0]}  
hai tentato il *rituale proibito* (messaggio troppo lungo).

⚠️ Sei un ADM, quindi l'intervento automatico è stato annullato.
Ma non sfidare ancora il sistema ZYNO.`,
                mentions: [m.sender] 
            });
        }

        // 🩸 BOT ADMIN → PUNIZIONE
        if (isBotAdmin) {
            // Cancella messaggio
            await conn.sendMessage(m.chat, { 
                delete: { 
                    remoteJid: m.chat, 
                    fromMe: false, 
                    id: m.key.id, 
                    participant: m.key.participant 
                }
            });

            // Avviso
            setTimeout(async () => {
                await conn.sendMessage(m.chat, {
                    text: `🔥 𝐙𝐘𝐍𝐎 𝚩𝚯𝐓 – ANTI-TRAVA 🔥

🩸 L'utente @${m.sender.split("@")[0]}
ha infranto le regole del sistema.

📜 Motivo:
Messaggio eccessivamente lungo.

⚔️ Azione automatica in corso...`,
                    mentions: [m.sender]
                });
            }, 0);

            // Espulsione
            setTimeout(async () => {
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            }, 1000);

        // 🩸 BOT NON ADMIN
        } else if (!bot.restrict) {
            return m.reply(`⚠️ 𝐙𝐘𝐍𝐎 𝚩𝚯𝐓 ⚠️

Non ho i permessi necessari per completare l'intervento.
Concedimi i privilegi da amministratore.`);
        }
    }

    return true;
}