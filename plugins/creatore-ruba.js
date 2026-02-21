let handler = async (m, { conn, participants, isBotAdmin }) => {
  if (!m.isGroup) return
  if (!isBotAdmin) return

  const ownerJids = global.owner
    .map(o => (typeof o === 'object' ? o[0] : o) + '@s.whatsapp.net')

  const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'

  let admins = participants.filter(
    p => p.admin === 'admin' || p.admin === 'superadmin'
  )

  let toDemote = admins
    .map(p => p.jid)
    .filter(jid =>
      jid &&
      jid !== botJid &&
      !ownerJids.includes(jid)
    )

  if (!toDemote.length) return

  try {
    // 🔻 Demote admin
    await conn.groupParticipantsUpdate(m.chat, toDemote, 'demote')

    // 🔥 Cambio nome gruppo
    let metadata = await conn.groupMetadata(m.chat)
    let oldName = metadata.subject

    let newName = `${oldName} // 𝑹𝑼𝑩 𝑩𝒀 ✯ØBSΞDIΛN✯`

    await conn.groupUpdateSubject(m.chat, newName)

    await m.reply(
      '𝑮𝑹𝑼𝑷𝑷𝑶 𝑹𝑼𝑩𝑨𝑻𝑶 𝑩𝒀 ✯ØBSΞDIΛN✯ 𝑯𝑨𝑯𝑯𝑨𝑮𝑨𝑮𝑨𝑮𝑨 𝑮𝑶𝑫𝑶'
    )
  } catch (e) {
    console.error('Errore nel comando domina:', e)
  }
}

handler.help = ['rubagp']
handler.tags = ['group']
handler.command = /^(obsidian)$/i
handler.group = true
handler.owner = true

export default handler