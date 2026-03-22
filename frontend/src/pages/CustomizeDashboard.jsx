/**
 * Customize Dashboard - Drag-and-drop widget layout editor
 * Phase 6 Feature (AIC-601)
 */
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link, useNavigate } from 'react-router-dom';
import { GripVertical, Eye, EyeOff, Save, RotateCcw, Layout, Check } from 'lucide-react';
import './CustomizeDashboard.css';

// Available widgets
const availableWidgets = [
  { id: 'metrics-overview', name: 'Metrics Overview', description: 'Total leads, conversion rate, revenue', icon: '📊', default: true },
  { id: 'visitor-chart', name: 'Visitor Trends', description: '6-month visitor line chart', icon: '📈', default: true },
  { id: 'lead-distribution', name: 'Lead Distribution', description: 'Doughnut chart by source', icon: '🍩', default: true },
  { id: 'conversion-table', name: 'Conversion by Source', description: 'Table with source breakdown', icon: '📋', default: true },
  { id: 'ai-insights', name: 'AI Insights', description: 'Latest AI-generated insights', icon: '🤖', default: false },
  { id: 'recent-leads', name: 'Recent Leads', description: 'Latest 5 leads', icon: '👥', default: false },
  { id: 'activity-feed', name: 'Activity Feed', description: 'Real-time activity stream', icon: '🔔', default: false },
  { id: 'performance-chart', name: 'Performance Chart', description: 'Agent performance metrics', icon: '⚡', default: false },
  { id: 'revenue-summary', name: 'Revenue Summary', description: 'MRR, ARR, growth metrics', icon: '💰', default: false },
  { id: 'funnel-viz', name: 'Conversion Funnel', description: 'Visual funnel breakdown', icon: '🎯', default: false },
];

// Saved layouts
const savedLayouts = [
  { id: 'default', name: 'Default', widgets: ['metrics-overview', 'visitor-chart', 'lead-distribution', 'conversion-table'] },
  { id: 'sales', name: 'Sales Focus', widgets: ['metrics-overview', 'recent-leads', 'funnel-viz', 'conversion-table'] },
  { id: 'executive', name: 'Executive', widgets: ['revenue-summary', 'ai-insights', 'visitor-chart', 'performance-chart'] },
  { id: 'minimal', name: 'Minimal', widgets: ['metrics-overview', 'conversion-table'] },
];

function SortableWidget({ widget, isVisible, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`widget-item ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="widget-grip" {...attributes} {...listeners}>
        <GripVertical size={16} />
      </div>
      <div className="widget-icon">{widget.icon}</div>
      <div className="widget-info">
        <span className="widget-name">{widget.name}</span>
        <span className="widget-desc">{widget.description}</span>
      </div>
      <button className={`visibility-toggle ${isVisible ? 'active' : ''}`} onClick={() => onToggle(widget.id)}>
        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
}

function CustomizeDashboard() {
  const [widgets, setWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboard_widgets');
    if (saved) {
      return JSON.parse(saved);
    }
    return availableWidgets.filter(w => w.default).map(w => w.id);
  });
  const [savedLayoutName, setSavedLayoutName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedLayoutsList, setSavedLayoutsList] = useState(() => {
    const saved = localStorage.getItem('dashboard_layouts');
    return saved ? JSON.parse(saved) : savedLayouts;
  });
  const [compareMode, setCompareMode] = useState(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('dashboard_widgets', JSON.stringify(newOrder));
        return newOrder;
      });
    }
  };

  const toggleWidget = (widgetId) => {
    setWidgets(prev => {
      let newWidgets;
      if (prev.includes(widgetId)) {
        newWidgets = prev.filter(id => id !== widgetId);
      } else {
        newWidgets = [...prev, widgetId];
      }
      localStorage.setItem('dashboard_widgets', JSON.stringify(newWidgets));
      return newWidgets;
    });
  };

  const resetToDefault = () => {
    const defaultWidgets = availableWidgets.filter(w => w.default).map(w => w.id);
    setWidgets(defaultWidgets);
    localStorage.setItem('dashboard_widgets', JSON.stringify(defaultWidgets));
  };

  const saveLayout = () => {
    if (!savedLayoutName.trim()) return;

    const newLayout = {
      id: `custom-${Date.now()}`,
      name: savedLayoutName,
      widgets: widgets,
    };

    const updated = [...savedLayoutsList.filter(l => l.id !== newLayout.id), newLayout];
    setSavedLayoutsList(updated);
    localStorage.setItem('dashboard_layouts', JSON.stringify(updated));
    setSavedLayoutName('');
    setShowSaveModal(false);
  };

  const applyLayout = (layout) => {
    setWidgets(layout.widgets);
    localStorage.setItem('dashboard_widgets', JSON.stringify(layout.widgets));
  };

  const deleteLayout = (layoutId) => {
    if (layoutId.startsWith('custom-')) {
      const updated = savedLayoutsList.filter(l => l.id !== layoutId);
      setSavedLayoutsList(updated);
      localStorage.setItem('dashboard_layouts', JSON.stringify(updated));
    }
  };

  return (
    <div className="customize-dashboard">
      <div className="customize-header">
        <div>
          <h1>Customize Dashboard</h1>
          <p>Drag and drop widgets to arrange your dashboard layout</p>
        </div>
        <div className="header-actions">
          <button className={`btn-secondary ${compareMode ? 'active' : ''}`} onClick={() => setCompareMode(!compareMode)}>
            <Layout size={16} />
            {compareMode ? 'Hide' : 'Compare'} Mode
          </button>
          <button className="btn-secondary" onClick={resetToDefault}>
            <RotateCcw size={16} />
            Reset
          </button>
          <button className="btn-secondary" onClick={() => setShowSaveModal(true)}>
            <Save size={16} />
            Save Layout
          </button>
          <Link to="/dashboard" className="btn-primary">
            <Eye size={16} />
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="customize-layout">
        {/* Saved Layouts */}
        <div className="saved-layouts">
          <h3>Saved Layouts</h3>
          <div className="layouts-list">
            {savedLayoutsList.map(layout => (
              <div key={layout.id} className="layout-card">
                <div className="layout-info">
                  <span className="layout-name">{layout.name}</span>
                  <span className="layout-count">{layout.widgets.length} widgets</span>
                </div>
                <div className="layout-actions">
                  <button className="apply-btn" onClick={() => applyLayout(layout)}>
                    Apply
                  </button>
                  {layout.id.startsWith('custom-') && (
                    <button className="delete-btn" onClick={() => deleteLayout(layout.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget Editor */}
        <div className="widget-editor">
          <h3>Dashboard Widgets</h3>
          <p className="editor-hint">Drag widgets to reorder, click eye to toggle visibility</p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={widgets} strategy={rectSortingStrategy}>
              <div className="widgets-grid">
                {widgets.map(widgetId => {
                  const widget = availableWidgets.find(w => w.id === widgetId);
                  return widget ? (
                    <SortableWidget
                      key={widget.id}
                      widget={widget}
                      isVisible={true}
                      onToggle={toggleWidget}
                    />
                  ) : null;
                })}
              </div>
            </SortableContext>
          </DndContext>

          {/* Hidden widgets */}
          <h4 className="hidden-title">Hidden Widgets</h4>
          <div className="widgets-grid hidden-widgets">
            {availableWidgets
              .filter(w => !widgets.includes(w.id))
              .map(widget => (
                <div key={widget.id} className="widget-item hidden" onClick={() => toggleWidget(widget.id)}>
                  <div className="widget-icon">{widget.icon}</div>
                  <div className="widget-info">
                    <span className="widget-name">{widget.name}</span>
                    <span className="widget-desc">{widget.description}</span>
                  </div>
                  <button className="visibility-toggle" onClick={(e) => { e.stopPropagation(); toggleWidget(widget.id); }}>
                    <Eye size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Save Dashboard Layout</h3>
            <input
              type="text"
              placeholder="Layout name..."
              value={savedLayoutName}
              onChange={e => setSavedLayoutName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={saveLayout}>
                <Check size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Mode Info */}
      {compareMode && (
        <div className="compare-mode-banner">
          <Layout size={18} />
          <span>Compare Mode: Side-by-side view of current vs previous period enabled</span>
          <button onClick={() => setCompareMode(false)}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default CustomizeDashboard;
