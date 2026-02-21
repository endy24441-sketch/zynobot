// ⚡ ZYNO BOT — AntiTikTok Futuristico
let tiktokRegex = /(?:https?:\/\/|www\.)[^\s]*tiktok[^\s]*|(?:^|\s)[^\s]*tiktok[^\s]*\.(com|it|net|org|ru|me|co|io|tv)(?:\/[^\s]*)?/i;

export async function before(m, { isAdmin, isPrems, isBotAdmin, conn }) {
  if (m.isBaileys || m.fromMe) return true;
  if (!m.isGroup) return false;

  let chat = global.db.data.chats[m.chat];
  if (!chat) return false;

  const warnLimit = 3;
  const senderId = m.key.participant;
  const messageId = m.key.id;

  const isTiktokLink = tiktokRegex.exec(m.text);

  if (chat.antiTiktok && isTiktokLink && !isAdmin && !isPrems && isBotAdmin) {

    global.db.data.users[m.sender] ??= {};
    global.db.data.users[m.sender].warn ??= 0;
    global.db.data.users[m.sender].warnReasons ??= [];

    global.db.data.users[m.sender].warn += 1;
    global.db.data.users[m.sender].warnReasons.push('link tiktok');

    // Cancella il messaggio
    try {
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: messageId,
          participant: senderId,
        },
      });
    } catch (e) {
      console.error('Errore nella cancellazione del messaggio:', e);
    }

    let warnCount = global.db.data.users[m.sender].warn;
    let remaining = warnLimit - warnCount;

    if (warnCount < warnLimit) {
      await conn.sendMessage(m.chat, {
        text: `╔═══━─━─━─━─━─━─━═══╗
⚡ 𝐙𝐘𝐍𝐎 𝚩𝚯𝐓 • ANTI-TIKTOK
╚═══━─━─━─━─━─━─━═══╝

🚨 Link TikTok rilevato

🔹 Avvertimento: ${warnCount}/${warnLimit}
🔹 Restanti prima dell'espulsione: ${remaining}

Prossima violazione → espulsione dal sistema ZYNO.
━━━━━━━━━━━━━━━━━━`
      });
    } else {
      // Reset warn
      global.db.data.users[m.sender].warn = 0;
      global.db.data.users[m.sender].warnReasons = [];

      try {
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        await conn.sendMessage(m.chat, {
          text: `⛔ @${m.sender.split('@')[0]} ESPULSO DAL SISTEMA ZYNO DOPO 3 VIOLAZIONI`,
          mentions: [m.sender]
        });
      } catch {
        await conn.sendMessage(m.chat, {
          text: `⚠️ @${m.sender.split('@')[0]} DOVREBBE ESSERE ESPULSO, MA IL BOT NON È ADMIN`,
          mentions: [m.sender]
        });
      }
    }
  }

  return true;
}