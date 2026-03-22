/**
 * Sparkline - Mini trend lines for metric cards
 * Part of Phase 7: Advanced Charts & Visualization (AIC-701)
 */
import { useEffect, useRef } from 'react';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale);

/**
 * Sparkline component - lightweight inline chart
 * @param {number[]} data - Array of values
 * @param {string} color - Line color
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 */
export function Sparkline({ data = [], color = '#3b82f6', width = 80, height = 24 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          borderWidth: 1.5,
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 0,
        }],
      },
      options: {
        responsive: false,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { display: false },
          y: {
            display: false,
            min: Math.min(...data) * 0.95,
            max: Math.max(...data) * 1.05,
          },
        },
        elements: {
          line: {
            borderCapStyle: 'round',
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block' }}
      aria-hidden="true"
    />
  );
}

/**
 * Trend indicator with sparkline
 */
export function TrendSparkline({ trend, color = '#3b82f6' }) {
  // Generate sample trend data if not provided
  const data = trend || [
    100, 110, 105, 120, 118, 125, 130, 128, 135, 140
  ];

  return <Sparkline data={data} color={color} width={64} height={20} />;
}

export default Sparkline;
