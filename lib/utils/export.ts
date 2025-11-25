// CSV export utilities

export interface ExportData {
  [key: string]: string | number | boolean | null
}

export function generateCSV(data: ExportData[], filename = "export.csv"): void {
  if (data.length === 0) {
    alert("No data to export")
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (value === null || value === undefined) return ""
          const stringValue = String(value)
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function exportComparisonsToCSV(comparisons: any[]) {
  const exportData = comparisons.map((comp) => ({
    id: comp.id,
    product_a: comp.product_a,
    product_b: comp.product_b,
    category: comp.category,
    status: comp.status,
    created_at: new Date(comp.created_at).toLocaleDateString(),
    reviewed_by: comp.reviewed_by || "N/A",
    reviewed_at: comp.reviewed_at ? new Date(comp.reviewed_at).toLocaleDateString() : "N/A",
  }))

  const filename = `comparisons_${new Date().toISOString().split("T")[0]}.csv`
  generateCSV(exportData, filename)
}
