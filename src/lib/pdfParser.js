/**
 * PDF Parser — extracts transactions from Israeli credit card statements.
 * Supports:
 *   • Isracard format  (DD.MM.YY  / amounts like ₪50.00)
 *   • Cal format       (DD/MM/YYYY / amounts like ₪ 71.70 with space)
 */
import * as pdfjsLib from 'pdfjs-dist'
import { supabase } from './supabase.js'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href

// ─── Merchant name → English translation ─────────────────────────────────────
// Keys are substrings that appear in the reversed Hebrew description
const MERCHANT_EN = {
  'שופרסל': 'Shufersal',
  'רמי לוי': 'Rami Levy',
  'ויקטורי': 'Victory',
  'יינות ביתן': 'Yeinot Bitan',
  'מגה': 'Mega',
  'קרפור': 'Carrefour',
  'סופר פארם': 'Super-Pharm',
  'סופרפארם': 'Super-Pharm',
  'פארם': 'Super-Pharm',
  'בית מרקחת': 'Pharmacy',
  'פנגו': 'Pango',
  'דלק': 'Dlek Fuel',
  'פז': 'Paz Fuel',
  'דור אלון': 'Dor Alon',
  'סונול': 'Sonol',
  'גז': 'Gas Station',
  'ארומה': 'Aroma Café',
  'קפה': 'Café',
  'בוגרשוב': 'Bugrashov',
  'נספרסו': 'Nespresso',
  'אקספרסו': 'Espresso',
  'מקדונלד': "McDonald's",
  'מקדונלדס': "McDonald's",
  'ברגר קינג': 'Burger King',
  'קנטאקי': 'KFC',
  'דומינו': "Domino's",
  'פיצה': 'Pizza',
  'וולט': 'Wolt',
  'wolt': 'Wolt',
  'ten bis': 'Ten Bis',
  'תן ביס': 'Ten Bis',
  'זארה': 'Zara',
  'hm': 'H&M',
  'h&m': 'H&M',
  'נייקי': 'Nike',
  'אדידס': 'Adidas',
  'fox': 'Fox',
  'קסטרו': 'Castro',
  'רנואר': 'Renoir',
  'כניסה': 'Admission',
  'נטפליקס': 'Netflix',
  'netflix': 'Netflix',
  'ספוטיפיי': 'Spotify',
  'spotify': 'Spotify',
  'אפל': 'Apple',
  'apple': 'Apple',
  'גוגל': 'Google',
  'google': 'Google',
  'אמזון': 'Amazon',
  'amazon': 'Amazon',
  'מיקרוסופט': 'Microsoft',
  'microsoft': 'Microsoft',
  'הוט': 'HOT',
  'hot': 'HOT',
  'yes': 'YES',
  'בזק': 'Bezeq',
  'פרטנר': 'Partner',
  'סלקום': 'Cellcom',
  '019': '019 Mobile',
  'איתוראן': 'Ituran',
  'הראל': "Harel Insurance",
  'מגדל': 'Migdal Insurance',
  'כלל': 'Clal Insurance',
  'מנורה': 'Menora Insurance',
  'בנק': 'Bank',
  'paypal': 'PayPal',
  'bit': 'Bit',
  'עמלה': 'Bank Fee',
}

export function translateMerchant(text) {
  const lower = text.toLowerCase()
  for (const [he, en] of Object.entries(MERCHANT_EN)) {
    if (lower.includes(he.toLowerCase())) return en
  }
  return null
}

// ─── Category keyword mapping ────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  'ce5a64cd-720a-44f1-8c72-433d9c844cb0': ['שופרסל','ארומה','קופי','נספרסו','wolt','פיצה','לחמים','בורגר','ציקן','תן ביס','מסעדה','arcaffe','זוזוברה','דרך היין','סאן קפה','נאייקס','בדקה ה','ecosupp','cafe','coffee'],
  'da8044dd-b308-4865-be48-36cecfe62148': ['פארם','nanit','ביטוח','הראל','מגדל','barber','תספורת','רפואה','קופ"ח','health','בריאות','creator'],
  'f1f06bda-b8a5-4222-b1ee-62c6ad95e160': ['דלק','פנגו','דרך ארץ','דור אלון','כביש','פז','yellow','חניה','גז'],
  '390f9d15-6474-4ba4-8946-12267a2212c5': ['חשמל','מים','yes','אינטרנט','hot','bezeq','שטראוס מים','מי ','איתוראן','וליו','hok','חיוב'],
  '44fa790b-ba52-43c9-b349-8eee3fe889a4': ['netflix','spotify','קולנוע','ספרים','צומת','בידור','פרחי','מרפאט'],
  'e14e7053-b184-4344-9545-7ad494998c29': ['בגד','נעל','ריהוט','loccitane','סטוק','בוגבו','j.m barber'],
  'f84270d3-b6de-4415-9e06-97edbda21eda': ['claude','anthropic','aws','google','apple','microsoft','tech','software'],
  '0ee181b8-cd7e-4954-8d2c-66022bf18068': ['paypal','paybox','bit','העברה'],
}
const DEFAULT_CATEGORY = '0ee181b8-cd7e-4954-8d2c-66022bf18068'

export function guessCategory(text) {
  const lower = text.toLowerCase()
  for (const [catId, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw.toLowerCase()))) return catId
  }
  return DEFAULT_CATEGORY
}

// ─── Text extraction ─────────────────────────────────────────────────────────
// Uses x-position gaps to detect word boundaries: gap > 2× typical char width
// emits double-space "  " between words so reverseHebrew can split them.
export async function extractPdfText(file) {
  const ab = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise
  const allLines = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()

    const byY = {}
    for (const item of content.items) {
      if (!item.str?.trim()) continue
      const y = Math.round(item.transform[5])
      if (!byY[y]) byY[y] = []
      byY[y].push({ x: item.transform[4], str: item.str, w: item.width || 0 })
    }

    const lines = Object.entries(byY)
      .sort(([ya], [yb]) => Number(yb) - Number(ya))
      .map(([, items]) => {
        const sorted = items.sort((a, b) => a.x - b.x)
        let line = sorted[0].str
        for (let i = 1; i < sorted.length; i++) {
          const prev = sorted[i - 1]
          const curr = sorted[i]
          const gap = curr.x - (prev.x + prev.w)
          // Double-space for word boundaries (gap > 5 units in PDF space)
          line += (gap > 5 ? '  ' : ' ') + curr.str
        }
        return line
      })
    allLines.push(...lines)
  }

  return allLines
}

// ─── Isracard parser ─────────────────────────────────────────────────────────
// Line format: [QUALIFIER] RECEIPT_NUM ₪AMOUNT ₪AMOUNT MERCHANT_NAME DD.MM.YY
const ISRACARD_DATE = /(\d{2})\.(\d{2})\.(\d{2})(?!\d)/
const ISRACARD_AMOUNT = /₪([\d,]+\.\d{2})/g

function parseIsracard(lines) {
  const results = []
  for (const line of lines) {
    const dateMatch = line.match(ISRACARD_DATE)
    if (!dateMatch) continue

    const amounts = [...line.matchAll(ISRACARD_AMOUNT)].map((m) =>
      parseFloat(m[1].replace(/,/g, ''))
    )
    if (amounts.length === 0) continue
    const amount = amounts[0]
    if (amount <= 0 || amount > 200000) continue

    const [, dd, mm, yy] = dateMatch
    const date = `20${yy}-${mm}-${dd}`

    // Merchant: text after last amount marker, before the date
    const beforeDate = line.slice(0, dateMatch.index).trim()
    // Remove receipt numbers (long digits) and ₪ amounts
    const desc = beforeDate
      .replace(/₪[\d,]+\.\d{2}/g, '')
      .replace(/\b\d{7,}\b/g, '')
      .replace(/קבע הוראת/g, '')
      .replace(/הנחה ₪[\d.]+/g, '')
      .trim()
      // Collapse multiple spaces
      .replace(/\s+/g, ' ')
      .trim()

    if (!desc || desc.length < 2) continue

    const displayDesc = translateMerchant(desc) || desc
    results.push({
      date,
      amount,
      description: displayDesc,
      direction: 'debit',
      category_id: guessCategory(desc + ' ' + displayDesc),
    })
  }
  return results
}

// ─── Cal parser ──────────────────────────────────────────────────────────────
// Cal PDFs have spaced digits: "0 1 / 0 4 / 2 0 2 6" and spaced Hebrew chars.
// Strategy: compact the line (collapse spaces around / and within number runs)
// then apply standard regex.

const CAL_DATE = /(\d{2})\/(\d{2})\/(\d{4})/
const CAL_AMOUNT = /₪\s*([\d,]+\.\d{2})/g

function compactCalLine(line) {
  // Cal PDFs emit each character individually with spaces.
  // Collapse spaced digits: "0 1" → "01" (two passes for 4-digit years)
  // Collapse spaced ASCII letters: "C L A U D E" → "CLAUDE"
  // Then remove " / " → "/" around date slashes
  return line
    .replace(/(\d) (\d)/g, '$1$2')
    .replace(/(\d) (\d)/g, '$1$2')
    .replace(/ \/ /g, '/')
    .replace(/(?<=[A-Za-z]) (?=[A-Za-z])/g, '')
}

// Hebrew chars in Cal PDFs are individually reversed.
// The extractor emits double-space for word boundaries and single-space within words.
// Algorithm:
//   1. Split on double-space to get word groups (in PDF order = reversed RTL)
//   2. For each word group of single Hebrew chars, collapse and reverse to get the word
//   3. Reverse the order of word groups (RTL → LTR word order)
//   4. Try to translate to English via lookup table
function reverseHebrew(str) {
  const HEBREW = /[א-ת]/
  const isSingleHebrewChars = (tokens) =>
    tokens.length > 1 && tokens.filter(t => t.length === 1 && HEBREW.test(t)).length > tokens.length * 0.5

  // Split on word boundaries (double-space) first
  const wordGroups = str.split(/  +/)
  const reversedWords = wordGroups
    .map(group => {
      const tokens = group.trim().split(/\s+/).filter(Boolean)
      if (isSingleHebrewChars(tokens)) {
        // Single reversed Hebrew chars → collapse and reverse to get the word
        return tokens.reverse().join('')
      }
      return group.trim()
    })
    .filter(Boolean)

  // If we got Hebrew words, reverse their order (RTL word order correction)
  const hasHebrew = reversedWords.some(w => HEBREW.test(w))
  return hasHebrew ? reversedWords.reverse().join(' ') : reversedWords.join(' ')
}

function parseCal(lines) {
  const results = []
  for (const rawLine of lines) {
    const line = compactCalLine(rawLine)
    const dateMatch = line.match(CAL_DATE)
    if (!dateMatch) continue

    const amounts = [...line.matchAll(CAL_AMOUNT)].map((m) =>
      parseFloat(m[1].replace(/,/g, ''))
    )
    if (amounts.length === 0) continue
    const amount = amounts[0]
    if (amount <= 0 || amount > 200000) continue

    const [, dd, mm, yyyy] = dateMatch
    const date = `${yyyy}-${mm}-${dd}`

    const textChunk = line.slice(0, dateMatch.index)
    const rawDesc = textChunk
      .replace(new RegExp(CAL_AMOUNT.source, 'g'), '')
      .replace(/\b\d{3,}\b/g, '')
      .replace(/\$/g, '')
      .replace(/['"]/g, '')
      .trim()

    const hebrewDesc = reverseHebrew(rawDesc)
    if (!hebrewDesc || hebrewDesc.length < 2) continue
    if (rawLine.includes('סה"כ') || rawLine.includes('לתאריך')) continue

    // Translate to English for display; guess category from Hebrew (more keywords)
    const desc = translateMerchant(hebrewDesc) || hebrewDesc

    results.push({
      date,
      amount,
      description: desc,
      direction: 'debit',
      category_id: guessCategory(hebrewDesc + ' ' + desc),
    })
  }
  return results
}

// ─── Detect format ───────────────────────────────────────────────────────────
function detectFormat(lines) {
  let isracard = 0, cal = 0
  for (const line of lines) {
    if (ISRACARD_DATE.test(line)) isracard++
    if (CAL_DATE.test(compactCalLine(line))) cal++
  }
  return cal > isracard ? 'cal' : 'isracard'
}

// ─── Deduplicate ─────────────────────────────────────────────────────────────
function dedup(rows) {
  const seen = new Set()
  return rows.filter((r) => {
    const key = `${r.date}|${r.amount}|${r.description}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─── AI fallback via Supabase Edge Function ──────────────────────────────────
// Called when the regex parsers find 0 transactions (unknown statement layout).
async function parseWithAI(rawText) {
  const { data, error } = await supabase.functions.invoke('parse-statement', {
    body: { rawText },
  })
  if (error) throw new Error(error.message || 'AI parsing failed')
  if (!data?.transactions) return []

  return data.transactions.map((tx) => ({
    date: tx.date,
    amount: Number(tx.amount),
    description: tx.description,
    direction: tx.direction || 'debit',
    category_id: guessCategory(tx.description),
  }))
}

// ─── Public API ──────────────────────────────────────────────────────────────
export async function parsePdfFile(file) {
  const lines = await extractPdfText(file)
  const format = detectFormat(lines)
  const rawText = lines.join('\n')

  let transactions =
    format === 'cal'
      ? dedup(parseCal(lines))
      : dedup(parseIsracard(lines))

  // Fallback: if regex parser found nothing, let OpenAI read the raw text
  if (transactions.length === 0) {
    transactions = await parseWithAI(rawText)
  }

  return { transactions, format, rawText }
}
