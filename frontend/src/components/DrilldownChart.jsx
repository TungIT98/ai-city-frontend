/**
 * DrilldownChart - Chart with click-through drill-down capability
 * Part of Phase 7: Advanced Charts & Visualization (AIC-701)
 */
import { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { ChevronLeft, Download } from 'lucide-react';
import { exportChartAsPNG } from './ChartExport';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend, ArcElement
);

/**
 * DrilldownChart - Interactive chart with drill-down
 */
export function DrilldownChart({
  initialData,
  type = 'bar',
  title,
  onDrilldown,
  height = 300,
  exportFilename,
}) {
  const [level, setLevel] = useState(0);
  const [currentData, setCurrentData] = useState(initialData);
  const [breadcrumb, setBreadcrumb] = useState([{ label: title || 'Data', data: initialData }]);
  const chartRef = useRef(null);

  const handleClick = (datasetIndex, index) => {
    if (!onDrilldown) return;

    const label = currentData.labels[index];
    const drillData = onDrilldown(label, level);

    if (drillData) {
      const newBreadcrumb = [...breadcrumb.slice(0, level + 1), { label, data: drillData }];
      setBreadcrumb(newBreadcrumb);
      setCurrentData(drillData);
      setLevel(level + 1);
    }
  };

  const handleBack = () => {
    if (level > 0) {
      const newLevel = level - 1;
      const newBreadcrumb = breadcrumb.slice(0, newLevel + 1);
      setBreadcrumb(newBreadcrumb);
      setCurrentData(newBreadcrumb[newLevel].data);
      setLevel(newLevel);
    }
  };

  const handleExport = () => {
    if (chartRef.current) {
      exportChartAsPNG(chartRef.current, exportFilename || 'chart');
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        handleClick(elements[0].datasetIndex, elements[0].index);
      }
    },
    plugins: {
      legend: {
        display: currentData.datasets?.some(d => d.label),
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label || context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  // Conditional styling for clickable charts
  const containerStyle = onDrilldown ? {
    cursor: 'pointer',
  } : {};

  const ChartComponent = type === 'bar' ? Bar : type === 'line' ? Line : Doughnut;

  return (
    <div style={{
      background: 'var(--card-bg, #fff)',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid var(--border-color)',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {level > 0 && (
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Go back"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
              {breadcrumb[breadcrumb.length - 1]?.label || title}
            </h4>
            {breadcrumb.length > 1 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                {breadcrumb.map((b, i) => (
                  <span key={i}>
                    {i > 0 && ' › '}
                    <span style={{ fontWeight: i === breadcrumb.length - 1 ? 600 : 400 }}>
                      {b.label}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          title="Export as PNG"
          style={{
            padding: '0.375rem',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Download size={14} />
        </button>
      </div>

      {/* Chart */}
      <div ref={chartRef} style={{ height, ...containerStyle }}>
        <ChartComponent data={currentData} options={chartOptions} />
      </div>

      {/* Drill-down hint */}
      {onDrilldown && (
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          margin: '0.5rem 0 0',
        }}>
          Click on a bar/segment to drill down
        </p>
      )}
    </div>
  );
}

export default DrilldownChart;
