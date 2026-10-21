export const downloadCsv = (rows: Array<Array<string | number>>, filename: string): void => {
  const escapeCell = (cell: string | number): string => `"${String(cell).replaceAll('"', '""')}"`
  const content = rows.map((row) => row.map(escapeCell).join(';')).join('\r\n')
  const blob = new Blob(['\ufeff', content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const printReport = (): void => window.print()
