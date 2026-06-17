import Papa from 'papaparse'
import * as XLSX from 'xlsx'

// Hebrew + English aliases for each compass field
const FIELD_ALIASES = {
  date: ['date', 'תאריך', 'תאריך עסקה', 'תאריך חיוב', 'transaction date', 'value date', 'posting date'],
  amount: ['amount', 'סכום', 'סכום חיוב', 'סכום עסקה', 'debit', 'credit', 'חיוב', 'זכות', 'sum'],
  description: ['description', 'פירוט', 'תיאור', 'שם בית עסק', 'merchant', 'payee', 'details', 'narrative', 'reference'],
  direction: ['direction', 'כיוון', 'type', 'סוג', 'debit/credit', 'dr/cr'],
}

/**
 * Try to auto-match a column header to a Compass field.
 * Returns the field name ('date'|'amount'|'description'|'direction') or null.
 */
export function detectField(header) {
  const h = header.trim().toLowerCase()
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some(a => h === a || h.includes(a))) return field
  }
  return null
}

/**
 * Build an initial column mapping from an array of header strings.
 * Returns { [header]: compassField | '' }
 */
export function buildInitialMapping(headers) {
  const mapping = {}
  const usedFields = new Set()
  for (const h of headers) {
    const field = detectField(h)
    if (field && !usedFields.has(field)) {
      mapping[h] = field
      usedFields.add(field)
    } else {
      mapping[h] = ''
    }
  }
  return mapping
}

/**
 * Parse a CSV file. Returns { headers: string[], rows: object[] }
 */
export function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        resolve({ headers, rows: results.data })
      },
      error: (err) => reject(new Error(err.message)),
    })
  })
}

/**
 * Parse an Excel (.xlsx / .xls) file. Returns { headers: string[], rows: object[] }
 * Handles files with metadata rows above the actual header (common in Israeli bank exports).
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array', cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        // Get raw 2D array so we can find the real header row ourselves
        const raw2d = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', cellDates: true })

        // Find the header row: first row that has 3+ non-empty short string cells
        // (metadata/title rows typically have 1 long cell; data rows have numbers/dates)
        let headerRowIdx = 0
        for (let i = 0; i < Math.min(raw2d.length, 20); i++) {
          const row = raw2d[i]
          const shortStringCells = row.filter(
            c => typeof c === 'string' && c.trim().length > 0 && c.trim().length < 120
          )
          if (shortStringCells.length >= 3) {
            headerRowIdx = i
            break
          }
        }

        // Clean headers: replace \r\n / \n with space, trim whitespace
        const headers = raw2d[headerRowIdx].map(h => String(h).replace(/[\r\n]+/g, ' ').trim()).filter(h => h)

        // Build row objects from the rows after the header row
        const rows = []
        for (let i = headerRowIdx + 1; i < raw2d.length; i++) {
          const rowArr = raw2d[i]
          if (rowArr.every(c => c === '' || c === null || c === undefined)) continue
          const obj = {}
          headers.forEach((h, colIdx) => {
            // The raw2d row may have fewer cells than headers — default to ''
            const val = raw2d[headerRowIdx][colIdx] !== undefined ? rowArr[colIdx] : ''
            obj[h] = val ?? ''
          })
          rows.push(obj)
        }

        resolve({ headers, rows })
      } catch (err) {
        reject(new Error('Failed to parse Excel file: ' + err.message))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Dispatch to CSV or Excel parser based on file extension.
 */
export async function parseSpreadsheetFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()
  if (ext === 'csv') return parseCsvFile(file)
  if (ext === 'xlsx' || ext === 'xls') return parseExcelFile(file)
  throw new Error(`Unsupported file type: .${ext}`)
}

/**
 * Normalise a date value to YYYY-MM-DD.
 * Handles JS Date objects (from SheetJS), DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD.
 */
function normaliseDate(raw) {
  if (!raw) return null
  if (raw instanceof Date) {
    return raw.toISOString().substring(0, 10)
  }
  const s = String(raw).trim()
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10)
  // DD/MM/YYYY or DD.MM.YYYY
  const dmy = s.match(/^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{4})/)
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`
  // MM/DD/YYYY
  const mdy = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}`
  return null
}

/**
 * Apply column mapping to raw rows and produce normalised transaction objects.
 * mapping: { [columnHeader]: compassField | '' }
 * Returns array of { date, amount, description, direction, include: true }
 */
export function applyMapping(rows, mapping) {
  const colFor = (field) => Object.keys(mapping).find(k => mapping[k] === field)

  const dateCol   = colFor('date')
  const amountCol = colFor('amount')
  const descCol   = colFor('description')
  const dirCol    = colFor('direction')

  const results = []

  for (const row of rows) {
    const rawDate   = dateCol   ? row[dateCol]   : null
    const rawAmount = amountCol ? row[amountCol] : null
    const rawDesc   = descCol   ? row[descCol]   : ''
    const rawDir    = dirCol    ? row[dirCol]    : null

    const date = normaliseDate(rawDate)
    const amount = Math.abs(parseFloat(String(rawAmount).replace(/[,\s]/g, '')) || 0)
    const description = String(rawDesc).trim()

    if (!date || !amount || !description) continue

    // Infer direction from raw value or direction column
    let direction = 'debit'
    if (rawDir) {
      const d = String(rawDir).toLowerCase()
      if (d.includes('credit') || d.includes('זכות') || d.includes('income') || d.includes('הכנסה')) {
        direction = 'credit'
      }
    } else if (rawAmount && parseFloat(String(rawAmount).replace(/[,\s]/g, '')) < 0) {
      // Negative amounts are often credits in some bank formats
      direction = 'credit'
    }

    results.push({ date, amount, description, direction, include: true })
  }

  return results
}
