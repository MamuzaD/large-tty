import figlet from 'figlet'

import StandardFont from 'figlet/importable-fonts/Standard.js'
import BigFont from 'figlet/importable-fonts/Big.js'
import SmallFont from 'figlet/importable-fonts/Small.js'
import MiniFont from 'figlet/importable-fonts/Mini.js'
import TermFont from 'figlet/importable-fonts/Term.js'

figlet.parseFont('Standard', StandardFont)
figlet.parseFont('Big', BigFont)
figlet.parseFont('Small', SmallFont)
figlet.parseFont('Mini', MiniFont)
figlet.parseFont('Term', TermFont)

const loadedFonts = new Set(['Standard', 'Big', 'Small', 'Mini', 'Term'])

type FontLoader = () => Promise<{ default: string }>

const fontLoaders: Partial<Record<string, FontLoader>> = {
  '3-D': () => import('figlet/importable-fonts/3-D.js'),
  '3x5': () => import('figlet/importable-fonts/3x5.js'),
  '5 Line Oblique': () => import('figlet/importable-fonts/5 Line Oblique.js'),
  Acrobatic: () => import('figlet/importable-fonts/Acrobatic.js'),
  Alligator: () => import('figlet/importable-fonts/Alligator.js'),
  Alligator2: () => import('figlet/importable-fonts/Alligator2.js'),
  Alphabet: () => import('figlet/importable-fonts/Alphabet.js'),
  Avatar: () => import('figlet/importable-fonts/Avatar.js'),
  Banner: () => import('figlet/importable-fonts/Banner.js'),
  'Banner3-D': () => import('figlet/importable-fonts/Banner3-D.js'),
  Banner3: () => import('figlet/importable-fonts/Banner3.js'),
  Banner4: () => import('figlet/importable-fonts/Banner4.js'),
  Barbwire: () => import('figlet/importable-fonts/Barbwire.js'),
  Basic: () => import('figlet/importable-fonts/Basic.js'),
  Bell: () => import('figlet/importable-fonts/Bell.js'),
  Big: async () => ({ default: BigFont }),
  'Big Chief': () => import('figlet/importable-fonts/Big Chief.js'),
  Binary: () => import('figlet/importable-fonts/Binary.js'),
  Block: () => import('figlet/importable-fonts/Block.js'),
  Bubble: () => import('figlet/importable-fonts/Bubble.js'),
  Bulbhead: () => import('figlet/importable-fonts/Bulbhead.js'),
  Caligraphy2: () => import('figlet/importable-fonts/Caligraphy2.js'),
  Caligraphy: () => import('figlet/importable-fonts/Caligraphy.js'),
  Catwalk: () => import('figlet/importable-fonts/Catwalk.js'),
  Chunky: () => import('figlet/importable-fonts/Chunky.js'),
  Coinstak: () => import('figlet/importable-fonts/Coinstak.js'),
  Colossal: () => import('figlet/importable-fonts/Colossal.js'),
  Computer: () => import('figlet/importable-fonts/Computer.js'),
  Contessa: () => import('figlet/importable-fonts/Contessa.js'),
  Contrast: () => import('figlet/importable-fonts/Contrast.js'),
  Cosmike: () => import('figlet/importable-fonts/Cosmike.js'),
  Cricket: () => import('figlet/importable-fonts/Cricket.js'),
  Cursive: () => import('figlet/importable-fonts/Cursive.js'),
  Cyberlarge: () => import('figlet/importable-fonts/Cyberlarge.js'),
  Cybermedium: () => import('figlet/importable-fonts/Cybermedium.js'),
  Cybersmall: () => import('figlet/importable-fonts/Cybersmall.js'),
  Diamond: () => import('figlet/importable-fonts/Diamond.js'),
  Digital: () => import('figlet/importable-fonts/Digital.js'),
  Doh: () => import('figlet/importable-fonts/Doh.js'),
  Doom: () => import('figlet/importable-fonts/Doom.js'),
  'Dot Matrix': () => import('figlet/importable-fonts/Dot Matrix.js'),
  'Dr Pepper': () => import('figlet/importable-fonts/Dr Pepper.js'),
  'Efti Chess': () => import('figlet/importable-fonts/Efti Chess.js'),
  'Efti Font': () => import('figlet/importable-fonts/Efti Font.js'),
  'Efti Piti': () => import('figlet/importable-fonts/Efti Piti.js'),
  'Efti Robot': () => import('figlet/importable-fonts/Efti Robot.js'),
  'Efti Italic': () => import('figlet/importable-fonts/Efti Italic.js'),
  'Efti Wall': () => import('figlet/importable-fonts/Efti Wall.js'),
  'Efti Water': () => import('figlet/importable-fonts/Efti Water.js'),
  Epic: () => import('figlet/importable-fonts/Epic.js'),
  Fender: () => import('figlet/importable-fonts/Fender.js'),
  'Four Tops': () => import('figlet/importable-fonts/Four Tops.js'),
  Fuzzy: () => import('figlet/importable-fonts/Fuzzy.js'),
  Goofy: () => import('figlet/importable-fonts/Goofy.js'),
  Gothic: () => import('figlet/importable-fonts/Gothic.js'),
  Graffiti: () => import('figlet/importable-fonts/Graffiti.js'),
  Hollywood: () => import('figlet/importable-fonts/Hollywood.js'),
  Invita: () => import('figlet/importable-fonts/Invita.js'),
  Isometric1: () => import('figlet/importable-fonts/Isometric1.js'),
  Isometric2: () => import('figlet/importable-fonts/Isometric2.js'),
  Isometric3: () => import('figlet/importable-fonts/Isometric3.js'),
  Isometric4: () => import('figlet/importable-fonts/Isometric4.js'),
  Italic: () => import('figlet/importable-fonts/Italic.js'),
  Ivrit: () => import('figlet/importable-fonts/Ivrit.js'),
  Jazmine: () => import('figlet/importable-fonts/Jazmine.js'),
  Jerusalem: () => import('figlet/importable-fonts/Jerusalem.js'),
  Katakana: () => import('figlet/importable-fonts/Katakana.js'),
  Kban: () => import('figlet/importable-fonts/Kban.js'),
  'Larry 3D': () => import('figlet/importable-fonts/Larry 3D.js'),
  LCD: () => import('figlet/importable-fonts/LCD.js'),
  Lean: () => import('figlet/importable-fonts/Lean.js'),
  Letters: () => import('figlet/importable-fonts/Letters.js'),
  Linux: () => import('figlet/importable-fonts/Linux.js'),
  Lockergnome: () => import('figlet/importable-fonts/Lockergnome.js'),
  Madrid: () => import('figlet/importable-fonts/Madrid.js'),
  Marquee: () => import('figlet/importable-fonts/Marquee.js'),
  Maxfour: () => import('figlet/importable-fonts/Maxfour.js'),
  Mike: () => import('figlet/importable-fonts/Mike.js'),
  Mini: async () => ({ default: MiniFont }),
  Mirror: () => import('figlet/importable-fonts/Mirror.js'),
  Mnemonic: () => import('figlet/importable-fonts/Mnemonic.js'),
  Morse: () => import('figlet/importable-fonts/Morse.js'),
  Moscow: () => import('figlet/importable-fonts/Moscow.js'),
  'Nancyj-Fancy': () => import('figlet/importable-fonts/Nancyj-Fancy.js'),
  'Nancyj-Underlined': () =>
    import('figlet/importable-fonts/Nancyj-Underlined.js'),
  Nancyj: () => import('figlet/importable-fonts/Nancyj.js'),
  Nipples: () => import('figlet/importable-fonts/Nipples.js'),
  'NT Greek': () => import('figlet/importable-fonts/NT Greek.js'),
  O8: () => import('figlet/importable-fonts/O8.js'),
  Ogre: () => import('figlet/importable-fonts/Ogre.js'),
  Pawp: () => import('figlet/importable-fonts/Pawp.js'),
  Peaks: () => import('figlet/importable-fonts/Peaks.js'),
  Pebbles: () => import('figlet/importable-fonts/Pebbles.js'),
  Pepper: () => import('figlet/importable-fonts/Pepper.js'),
  Poison: () => import('figlet/importable-fonts/Poison.js'),
  Puffy: () => import('figlet/importable-fonts/Puffy.js'),
  Pyramid: () => import('figlet/importable-fonts/Pyramid.js'),
  Rectangles: () => import('figlet/importable-fonts/Rectangles.js'),
  Relief: () => import('figlet/importable-fonts/Relief.js'),
  Relief2: () => import('figlet/importable-fonts/Relief2.js'),
  Reverse: () => import('figlet/importable-fonts/Reverse.js'),
  Roman: () => import('figlet/importable-fonts/Roman.js'),
  Rot13: () => import('figlet/importable-fonts/Rot13.js'),
  Rounded: () => import('figlet/importable-fonts/Rounded.js'),
  'Rowan Cap': () => import('figlet/importable-fonts/Rowan Cap.js'),
  Rozzo: () => import('figlet/importable-fonts/Rozzo.js'),
  Runic: () => import('figlet/importable-fonts/Runic.js'),
  Runyc: () => import('figlet/importable-fonts/Runyc.js'),
  'S Blood': () => import('figlet/importable-fonts/S Blood.js'),
  Script: () => import('figlet/importable-fonts/Script.js'),
  Serifcap: () => import('figlet/importable-fonts/Serifcap.js'),
  Shadow: () => import('figlet/importable-fonts/Shadow.js'),
  Short: () => import('figlet/importable-fonts/Short.js'),
  Slant: () => import('figlet/importable-fonts/Slant.js'),
  Slide: () => import('figlet/importable-fonts/Slide.js'),
  'SL Script': () => import('figlet/importable-fonts/SL Script.js'),
  Small: async () => ({ default: SmallFont }),
  'Small Isometric1': () =>
    import('figlet/importable-fonts/Small Isometric1.js'),
  'Small Keyboard': () => import('figlet/importable-fonts/Small Keyboard.js'),
  'Small Script': () => import('figlet/importable-fonts/Small Script.js'),
  'Small Shadow': () => import('figlet/importable-fonts/Small Shadow.js'),
  'Small Slant': () => import('figlet/importable-fonts/Small Slant.js'),
  'Small Tengwar': () => import('figlet/importable-fonts/Small Tengwar.js'),
  Speed: () => import('figlet/importable-fonts/Speed.js'),
  Stampatello: () => import('figlet/importable-fonts/Stampatello.js'),
  Standard: async () => ({ default: StandardFont }),
  'Star Wars': () => import('figlet/importable-fonts/Star Wars.js'),
  Stellar: () => import('figlet/importable-fonts/Stellar.js'),
  Stop: () => import('figlet/importable-fonts/Stop.js'),
  Straight: () => import('figlet/importable-fonts/Straight.js'),
  Tanja: () => import('figlet/importable-fonts/Tanja.js'),
  Tengwar: () => import('figlet/importable-fonts/Tengwar.js'),
  Term: async () => ({ default: TermFont }),
  Thick: () => import('figlet/importable-fonts/Thick.js'),
  Thin: () => import('figlet/importable-fonts/Thin.js'),
  'Three Point': () => import('figlet/importable-fonts/Three Point.js'),
  Ticks: () => import('figlet/importable-fonts/Ticks.js'),
  'Ticks Slant': () => import('figlet/importable-fonts/Ticks Slant.js'),
  'Tinker-Toy': () => import('figlet/importable-fonts/Tinker-Toy.js'),
  Tombstone: () => import('figlet/importable-fonts/Tombstone.js'),
  Trek: () => import('figlet/importable-fonts/Trek.js'),
  Tsalagi: () => import('figlet/importable-fonts/Tsalagi.js'),
  'Two Point': () => import('figlet/importable-fonts/Two Point.js'),
  Univers: () => import('figlet/importable-fonts/Univers.js'),
  'USA Flag': () => import('figlet/importable-fonts/USA Flag.js'),
  Wavy: () => import('figlet/importable-fonts/Wavy.js'),
  Weird: () => import('figlet/importable-fonts/Weird.js'),
}

export const FONTS = Object.keys(fontLoaders).sort()

export const DEFAULT_FONT_INDEX = FONTS.indexOf('Standard')

const FONT_TIERS = ['Big', 'Standard', 'Small', 'Mini', 'Term']

const MAX_FIG_LINES = 5

export async function loadFont(name: string): Promise<boolean> {
  if (loadedFonts.has(name)) return true
  const loader = fontLoaders[name]
  if (!loader) return false
  try {
    const mod = await loader()
    figlet.parseFont(name, mod.default)
    loadedFonts.add(name)
    return true
  } catch {
    return false
  }
}

export function isFontLoaded(name: string): boolean {
  return loadedFonts.has(name)
}

export function isASCII(s: string): boolean {
  for (const ch of s) {
    const cp = ch.codePointAt(0)
    if (cp == null || cp > 127) return false
  }
  return true
}

function filterToASCII(s: string): string {
  let result = ''
  for (const ch of s) {
    const cp = ch.codePointAt(0)
    if (cp != null && cp <= 127) result += ch
  }
  return result
}

function renderFig(text: string, font: string): string {
  // Defensive: the UI should enforce ASCII-only, but don't let non-ASCII
  // leak into figlet or the output if something bypasses the UI.
  text = filterToASCII(text)
  try {
    const result = figlet.textSync(text, { font })
    return result.replace(/\n+$/, '')
  } catch {
    return text
  }
}

function maxLineWidth(s: string): number {
  let max = 0
  for (const line of s.split('\n')) {
    if (line.length > max) max = line.length
  }
  return max
}

function fitWidth(s: string, maxW: number): string {
  return s
    .split('\n')
    .map((line) => (line.length > maxW ? line.slice(0, maxW) : line))
    .join('\n')
}

function findMaxFit(
  items: string[],
  sep: string,
  font: string,
  maxW: number,
): number {
  if (items.length === 0) return 0
  if (maxLineWidth(renderFig(items[0], font)) > maxW) return 0
  if (maxLineWidth(renderFig(items.join(sep), font)) <= maxW)
    return items.length

  let lo = 1
  let hi = items.length
  let best = 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const candidate = renderFig(items.slice(0, mid).join(sep), font)
    if (maxLineWidth(candidate) <= maxW) {
      best = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return best
}

function findMaxRuneFit(chars: string[], font: string, maxW: number): number {
  if (maxLineWidth(renderFig(chars.join(''), font)) <= maxW) return chars.length

  let lo = 1
  let hi = chars.length
  let best = 1
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const candidate = renderFig(chars.slice(0, mid).join(''), font)
    if (maxLineWidth(candidate) <= maxW) {
      best = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return best
}

function tryWrap(
  text: string,
  font: string,
  maxW: number,
  maxLines: number,
): [string, boolean] {
  const full = renderFig(text, font)
  if (maxLineWidth(full) <= maxW) return [full, true]

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return ['', true]

  const rows: string[] = []
  let i = 0

  while (i < words.length && rows.length < maxLines) {
    const best = findMaxFit(words.slice(i), ' ', font, maxW)

    if (best === 0) {
      const word = words[i]
      if (!word) return [rows.join('\n'), false]

      const runes = [...word]
      if (runes.length === 0) return [rows.join('\n'), false]

      if (maxLineWidth(renderFig(runes[0], font)) > maxW) {
        return [rows.join('\n'), false]
      }

      let ci = 0
      while (ci < runes.length && rows.length < maxLines) {
        const n = findMaxRuneFit(runes.slice(ci), font, maxW) || 1
        const chunk = renderFig(runes.slice(ci, ci + n).join(''), font)
        rows.push(fitWidth(chunk, maxW))
        ci += n
      }
      if (ci < runes.length) return [rows.join('\n'), false]
      i++
      continue
    }

    const chunk = renderFig(words.slice(i, i + best).join(' '), font)
    rows.push(fitWidth(chunk, maxW))
    i += best
  }

  return [rows.join('\n'), i >= words.length]
}

export function wrapFiglet(
  text: string,
  preferredFont: string,
  maxW: number,
  maxLines: number = MAX_FIG_LINES,
): { text: string; usedFont: string } {
  const fontsToTry = [preferredFont]
  for (const f of FONT_TIERS) {
    if (f !== preferredFont && loadedFonts.has(f)) fontsToTry.push(f)
  }

  for (const font of fontsToTry) {
    if (!loadedFonts.has(font)) continue
    const [result, ok] = tryWrap(text, font, maxW, maxLines)
    if (ok) return { text: result, usedFont: font }
  }

  const [result] = tryWrap(text, 'Term', maxW, maxLines)
  return { text: result, usedFont: 'Term' }
}
