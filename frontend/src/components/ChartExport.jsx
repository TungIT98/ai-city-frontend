/**
 * ChartExport - PNG/CSV export utilities for charts and tables
 * Part of Phase 7: Advanced Charts & Visualization (AIC-701)
 */

/**
 * Export a chart canvas as PNG image
 * @param {HTMLCanvasElement} canvas - Chart canvas element
 * @param {string} filename - Output filename (without extension)
 */
export const exportChartAsPNG = (canvas, filename = 'chart') => {
  if (!canvas) {
    console.warn('No canvas element provided for PNG export');
    return;
  }

  // For Chart.js charts, get the canvas from the ref
  const canvasEl = canvas instanceof HTMLCanvasElement ? canvas : canvas.$el;

  if (!canvasEl) {
    console.warn('Canvas element not found');
    return;
  }

  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvasEl.toDataURL('image/png', 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export table data as CSV
 * @param {HTMLTableElement} table - Table element
 * @param {string} filename - Output filename (without extension)
 */
export const exportTableAsCSV = (table, filename = 'data') => {
  if (!table) {
    console.warn('No table element provided for CSV export');
    return;
  }

  const rows = table.querySelectorAll('tr');
  const csvContent = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    const rowData = [];
    cells.forEach(cell => {
      // Escape quotes and wrap in quotes
      const text = cell.textContent.replace(/"/g, '""').trim();
      rowData.push(`"${text}"`);
    });
    csvContent.push(rowData.join(','));
  });

  const csv = csvContent.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export array data as CSV
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column definitions [{key, label}]
 * @param {string} filename - Output filename
 */
export const exportDataAsCSV = (data, columns, filename = 'export') => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data provided for CSV export');
    return;
  }

  // Build header row
  const headers = columns.map(col => `"${col.label || col.key}"`).join(',');

  // Build data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key] ?? '';
      // Format numbers with commas
      if (typeof value === 'number') {
        value = value.toLocaleString();
      }
      // Escape and wrap
      value = String(value).replace(/"/g, '""').trim();
      return `"${value}"`;
    }).join(',');
  });

  const csv = [headers, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export chart as SVG (for vector quality)
 * @param {HTMLCanvasElement} canvas - Chart canvas
 * @param {string} filename - Output filename
 */
export const exportChartAsSVG = (canvas, filename = 'chart') => {
  const canvasEl = canvas instanceof HTMLCanvasElement ? canvas : canvas.$el;
  if (!canvasEl) return;

  // Convert canvas to PNG for embedding in SVG
  const dataUrl = canvasEl.toDataURL('image/png');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvasEl.width}" height="${canvasEl.height}">
  <image width="${canvasEl.width}" height="${canvasEl.height}" xlink:href="${dataUrl}"/>
</svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.svg`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export menu dropdown component
 */
export function ExportMenu({ chartRef, tableRef, data, columns, filename }) {
  const handlePNG = () => {
    if (chartRef?.current) {
      exportChartAsPNG(chartRef.current, filename);
    }
  };

  const handleCSV = () => {
    if (tableRef) {
      exportTableAsCSV(tableRef, filename);
    } else if (data && columns) {
      exportDataAsCSV(data, columns, filename);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      display: 'flex',
      gap: '0.25rem',
      zIndex: 10,
    }}>
      <button
        onClick={handlePNG}
        title="Export as PNG"
        style={{
          padding: '0.375rem 0.625rem',
          fontSize: '0.75rem',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
        }}
      >
        PNG
      </button>
      <button
        onClick={handleCSV}
        title="Export as CSV"
        style={{
          padding: '0.375rem 0.625rem',
          fontSize: '0.75rem',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
        }}
      >
        CSV
      </button>
    </div>
  );
}
