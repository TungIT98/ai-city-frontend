/**
 * PDF Export Utility
 * Phase 8: AIC-801 - PDF Report Export
 */
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

/**
 * Export a DOM element as PDF
 */
export const exportElementToPDF = async (elementId, filename = 'report.pdf', title = 'AI City Report') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element with id "${elementId}" not found`);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0f172a',
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, canvas.width, canvas.height, 'F');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
  const x = (pageWidth - imgWidth * ratio) / 2;
  const y = (pageHeight - imgHeight * ratio) / 2;

  pdf.addImage(imgData, 'PNG', x, y, imgWidth * ratio, imgHeight * ratio);
  pdf.save(filename);
};

/**
 * Export chart as PDF
 */
export const exportChartToPDF = async (chartRef, filename = 'chart.pdf', title = 'Chart') => {
  const canvas = chartRef?.current?.chart?.canvas;
  if (!canvas) throw new Error('Chart canvas not found');

  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png', 1.0);

  pdf.setFontSize(16);
  pdf.setTextColor(249, 250, 251);
  pdf.text(title, 14, 20);

  pdf.addImage(imgData, 'PNG', 14, 30, pdf.internal.pageSize.getWidth() - 28, pdf.internal.pageSize.getHeight() - 50);
  pdf.save(filename);
};

/**
 * Generate a multi-page PDF report
 */
export const generatePDFReport = async (options = {}) => {
  const {
    title = 'AI City Report',
    subtitle = '',
    sections = [],
    metrics = [],
    date = new Date().toLocaleDateString(),
    filename = 'aicity-report.pdf',
  } = options;

  const pdf = new jsPDF('portrait', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 20;

  // Helper: check page break
  const checkPageBreak = (needed = 40) => {
    if (yPos + needed > pageHeight - 20) {
      pdf.addPage();
      yPos = 20;
    }
  };

  // Helper: section header
  const addSectionHeader = (text) => {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setTextColor(34, 211, 238); // cyan-400
    pdf.text(text, 14, yPos);
    yPos += 8;
    pdf.setDrawColor(55, 65, 81);
    pdf.line(14, yPos, pageWidth - 14, yPos);
    yPos += 6;
  };

  // Title page
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setFontSize(28);
  pdf.setTextColor(249, 250, 251);
  pdf.text(title, pageWidth / 2, 60, { align: 'center' });

  if (subtitle) {
    pdf.setFontSize(14);
    pdf.setTextColor(156, 163, 175);
    pdf.text(subtitle, pageWidth / 2, 75, { align: 'center' });
  }

  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text(`Generated: ${date}`, pageWidth / 2, 90, { align: 'center' });
  pdf.text('AI City Dashboard', pageWidth / 2, 98, { align: 'center' });

  yPos = 120;

  // Executive Summary / Metrics
  if (metrics.length > 0) {
    addSectionHeader('Key Metrics');
    metrics.forEach((metric, i) => {
      checkPageBreak(14);
      const x = 14 + (i % 2) * (pageWidth / 2 - 14);
      const y = yPos + Math.floor(i / 2) * 14;
      pdf.setFontSize(9);
      pdf.setTextColor(156, 163, 175);
      pdf.text(metric.label, x, y);
      pdf.setFontSize(18);
      pdf.setTextColor(34, 211, 238);
      pdf.text(metric.value, x, y + 7);
    });
    yPos += Math.ceil(metrics.length / 2) * 14 + 10;
  }

  // Sections
  for (const section of sections) {
    if (section.type === 'table' && section.data) {
      addSectionHeader(section.title);
      checkPageBreak(60);

      const tableData = section.data.map(row =>
        section.columns.map(col => {
          const val = row[col.key];
          return typeof val === 'number' ? val.toLocaleString() : (val || '-');
        })
      );

      pdf.autoTable({
        startY: yPos,
        head: [section.columns.map(c => c.label)],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 41, 59],
          textColor: [156, 163, 175],
          fontSize: 9,
        },
        bodyStyles: {
          fillColor: [15, 23, 42],
          textColor: [249, 250, 251],
          fontSize: 9,
        },
        alternateRowStyles: {
          fillColor: [30, 41, 59],
        },
        margin: { left: 14, right: 14 },
        tableLineColor: [55, 65, 81],
        tableLineWidth: 0.1,
      });

      yPos = pdf.lastAutoTable.finalY + 15;
    } else if (section.type === 'text') {
      addSectionHeader(section.title);
      checkPageBreak(30);
      pdf.setFontSize(10);
      pdf.setTextColor(209, 213, 219);
      const lines = pdf.splitTextToSize(section.content, pageWidth - 28);
      pdf.text(lines, 14, yPos);
      yPos += lines.length * 5 + 10;
    } else if (section.type === 'chart' && section.elementId) {
      addSectionHeader(section.title);
      checkPageBreak(80);
      try {
        const el = document.getElementById(section.elementId);
        if (el) {
          const canvas = await html2canvas(el, {
            scale: 1.5,
            backgroundColor: '#0f172a',
            logging: false,
          });
          const imgData = canvas.toDataURL('image/png');
          const imgW = pageWidth - 28;
          const imgH = (canvas.height / canvas.width) * imgW;
          pdf.addImage(imgData, 'PNG', 14, yPos, imgW, Math.min(imgH, pageHeight - yPos - 20));
          yPos += imgH + 10;
        }
      } catch {
        pdf.setFontSize(10);
        pdf.setTextColor(156, 163, 175);
        pdf.text('[Chart placeholder]', 14, yPos);
        yPos += 15;
      }
    }
  }

  // Footer on all pages
  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(75, 85, 99);
    pdf.text(`AI City Dashboard | Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  pdf.save(filename);
};

/**
 * Pre-built report templates
 */
export const REPORT_TEMPLATES = {
  weeklySummary: {
    title: 'Weekly Summary Report',
    subtitle: 'AI City Dashboard - Week Overview',
    metrics: [
      { label: 'New Leads', value: '847' },
      { label: 'Conversion Rate', value: '12.3%' },
      { label: 'Revenue', value: '$142,500' },
      { label: 'Active Users', value: '3,241' },
    ],
  },
  monthlyMRR: {
    title: 'Monthly MRR Report',
    subtitle: 'Revenue & Subscription Metrics',
    metrics: [
      { label: 'MRR', value: '$185,000' },
      { label: 'New MRR', value: '$12,400' },
      { label: 'Churn Rate', value: '3.1%' },
      { label: 'LTV', value: '$2,850' },
    ],
  },
  leadPipeline: {
    title: 'Lead Pipeline Report',
    subtitle: 'Sales Funnel Analysis',
    metrics: [
      { label: 'Total Leads', value: '2,847' },
      { label: 'Qualified', value: '342' },
      { label: 'Opportunities', value: '156' },
      { label: 'Closed Won', value: '47' },
    ],
  },
};
