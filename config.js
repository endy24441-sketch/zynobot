import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import chalk from 'chalk'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import NodeCache from 'node-cache'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const moduleCache = new NodeCache({ stdTTL: 300 });

/*⭑⭒━━━✦❘༻☾⋆⁺₊✧ 𝓿𝓪𝓻𝓮𝓫𝓸𝓽 ✧₊⁺⋆☽༺❘✦━━━⭒⭑*/

global.endy = ['212679283897',]
global.owner = 
  ['212679283897', 'Endy', true],
  ['212722652082', 'medalis', true],
  ['393926427789', 'mors', true],
  ['5511967898841', 'ksav', true],
  ['212775270361', 'ZynoBot', true],
]
global.mods = ['xxxxxxxxxx', 'xxxxxxxxxx', 'xxxxxxxxxx']
global.prems = ['xxxxxxxxxx', 'xxxxxxxxxx', 'xxxxxxxxxx']

[ SYSTEM :: INFO BOT ]

global.nomepack = '𝒁𝒚𝒏𝒐 ༒︎ 𝑩𝒐𝒕'
global.nomebot = '𖣘 𝒁𝒚𝒏𝒐 𖣘'
global.wm = '𝒁𝒚𝒏𝒐 ༒︎ 𝑩ot'
global.autore = '𝐄𝐧𝐝𝐲'
global.dev = 'ت︎-𝐄𝐧𝐝𝐲'
global.testobot = `༻⋆⁺₊𝔃𝔂𝓷𝓸𝓫𝓸𝓽₊⁺⋆༺`
global.versione = pkg.version
global.errore = '⚠️ *Errore inatteso!* Usa il comando `.segnala _errore_` per avvisare lo sviluppatore.'

/*⭑⭒━━━✦❘༻🌐 LINK 🌐༺❘✦━━━⭒⭑*/

global.repobot = 'https://github.com/Endy35-gif/ZynoBot2',
global.gruppo = 'https://chat.whatsapp.com/LAjAXzrmZ2vF8jJTNy7lzq?mode=gi_t',
global.canale = 'https://whatsapp.com/channel/0029Vb7DfzZ7Noa0LayyC90q',
global.insta = 'https://www.instagram.com/zynobot.md?igsh=bHdvcG10bGFoeHo2',

/*⭑⭒━━━✦❘༻ MODULI ༺❘✦━━━⭒⭑*/

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

/*⭑⭒━━━✦❘🗝️ API KEYS 🌍༺❘✦━━━⭒⭑*/

global.APIKeys = { // le keys con scritto "varebot" vanno cambiate con keys valide
       spotifyclientid: 'varebot',
    spotifysecret: 'varebot',
    browserless: 'varebot',
    screenshotone: 'varebot',
    screenshotone_default: 'varebot',
    tmdb: 'varebot',
    gemini:'varebot',
    ocrspace: 'varebot',
    assemblyai: 'varebot',
    google: 'varebot',
    googlex: 'varebot',
    googleCX: 'varebot',
    genius: 'varebot',
    unsplash: 'varebot',
    removebg: 'FEx4CYmYN1QRQWD1mbZp87jV',
    openrouter: 'varebot',
    lastfm: '36f859a1fc4121e7f0e931806507d5f9',
}

/*⭑⭒━━━✦❘༻🪷 SISTEMA XP/EURO 💸༺❘✦━━━⭒⭑*/

global.multiplier = 1 // piu è alto piu è facile guardagnare euro e xp

/*⭑⭒━━━✦❘༻📦 RELOAD 📦༺❘✦━━━⭒⭑*/

let filePath = fileURLToPath(import.meta.url)
let fileUrl = pathToFileURL(filePath).href
const reloadConfig = async () => {
  const cached = moduleCache.get(fileUrl);
  if (cached) return cached;
  unwatchFile(filePath)
  console.log(chalk.bgHex('#3b0d95')(chalk.white.bold("File: 'config.js' Aggiornato")))
  const module = await import(`${fileUrl}?update=${Date.now()}`)
  moduleCache.set(fileUrl, module, { ttl: 300 });
  return module;
}
watchFile(filePath, reloadConfig) 