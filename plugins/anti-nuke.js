// Plugin AntiNuke a tema 𝐙𝐘𝐍𝐎 𝐁𝐎𝐓 ⚡
const handler = m => m;

// Lista utenti autorizzati
const registeredAdmins = [
  '393204514107@s.whatsapp.net',
  '@s.whatsapp.net',
];

handler.before = async function (m, { conn, participants, isBotAdmin }) {
  if (!m.isGroup) return;
  if (!isBotAdmin) return;

  const chat = global.db.data.chats[m.chat];
  if (!chat?.antinuke) return;

  const sender = m.key?.participant || m.participant || m.sender;

  // 29 = Promozione admin | 30 = Retrocessione admin
  if (![29, 30].includes(m.messageStubType)) return;

  const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  const BOT_OWNERS = global.owner.map(o => o[0] + '@s.whatsapp.net');

  let founderJid = null;
  try {
    const metadata = await conn.groupMetadata(m.chat);
    founderJid = metadata.owner;
  } catch {
    founderJid = null;
  }

  const allowed = [
    botJid,
    ...BOT_OWNERS,
    ...registeredAdmins,
    founderJid
  ].filter(Boolean);

  // Se autorizzato → ignora
  if (allowed.includes(sender)) return;

  // Demote tutti gli admin non autorizzati
  const usersToDemote = participants
    .filter(p => p.admin)
    .map(p => p.jid)
    .filter(jid => jid && !allowed.includes(jid));

  if (!usersToDemote.length) return;

  await conn.groupParticipantsUpdate(
    m.chat,
    usersToDemote,
    'demote'
  );

  // Blocca il gruppo (solo admin possono scrivere)
  await conn.groupSettingUpdate(m.chat, 'announcement');

  const action =
    m.messageStubType === 29
      ? 'PROMOZIONE NON AUTORIZZATA'
      : 'RETROCESSIONE NON AUTORIZZATA';

  const groupName = m.pushName || 'GRUPPO ZYNO';

  const text = `
⚡ 𝐙𝐘𝐍𝐎 𝐁𝐎𝐓 — ANTI-NUKE SYSTEM ⚡

════════════════════
🚨 INTRUSIONE RILEVATA
════════════════════

👤 @${sender.split('@')[0]}
ha tentato una:
❌ ${action}

☠️ AMMINISTRATORI COMPROMESSI:
${usersToDemote.map(j => `💀 @${j.split('@')[0]}`).join('\n')}

🔒 GRUPPO: *${groupName.toUpperCase()}*
Modalità sicurezza attivata.

👑 OWNER NOTIFICATI:
${BOT_OWNERS.map(x => `🛡️ @${x.split('@')[0]}`).join('\n')}

════════════════════
🛡️ ZYNO DEFENSE CORE ATTIVO
_Minaccia neutralizzata con successo._
════════════════════
`.trim();

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      mentionedJid: [...usersToDemote, ...BOT_OWNERS].filter(Boolean),
    },
  });
};

export default handler;