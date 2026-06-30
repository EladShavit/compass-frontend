import Papa from 'papaparse'

export function exportTransactionsCsv(transactions, currency = 'ILS', filename = 'compass-transactions.csv') {
  const rows = transactions.map((tx) => ({
    Date: tx.date || '',
    Description: tx.merchants?.name || tx.description || '',
    Amount: Number(tx.amount).toFixed(2),
    Currency: tx.accounts?.currency || currency,
    Direction: tx.direction === 'debit' ? 'Expense' : 'Income',
    Category: tx.categories?.name || '',
    Account: tx.accounts?.name || '',
  }))

  const csv = Papa.unparse(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
