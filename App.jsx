import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, ShieldAlert, PhoneCall, BrainCircuit, GitBranch, 
  FileText, Scale, CheckCircle2, Users, Zap, Bot, 
  Database, FileCheck, Rocket, Plus, Minus, Maximize,
  Move, MousePointer2, Hand
} from 'lucide-react';

// (INITIAL_NODES and INITIAL_EDGES are defined below)
const INITIAL_NODES = [
  { id: '1', x: 50, y: 100, type: 'glass', label: 'Input', subLabel: 'Incoming Transaction', icon: Zap },
  { id: '2', x: 350, y: 70, type: 'decision', label: 'Decision Engine', icon: Activity },
  { id: '3', x: 350, y: 250, type: 'glass', label: 'Result', subLabel: 'As Expected', icon: CheckCircle2, status: 'active', color: 'text-[#16A34A] bg-[#16A34A]/12' },
  { id: '4', x: 650, y: 100, type: 'glass', label: 'Alert', subLabel: 'Fraud Missed', icon: ShieldAlert, status: 'critical', color: 'text-[#EF6C6C] bg-[#EF6C6C]/12' },
  { id: '5', x: 650, y: 300, type: 'glass', label: 'Action', subLabel: 'Customer Call', icon: PhoneCall },

  { id: '6', x: 50, y: 500, type: 'glass', label: 'Input', subLabel: 'Call Transcript', icon: FileText },
  { id: '7', x: 350, y: 500, type: 'glass', label: 'GenAI Analysis', subLabel: 'Extract Fraud M.O.', icon: BrainCircuit, color: 'text-[#8B5CF6] bg-[#8B5CF6]/12' },
  { id: '8', x: 350, y: 620, type: 'glass', label: 'Optimization', subLabel: 'Rec. New Features', icon: Database },
  { id: '9', x: 50, y: 620, type: 'glass', label: 'Gate', subLabel: 'Developer Approval', icon: Users },
  { id: '10', x: 50, y: 740, type: 'glass', label: 'MLOps', subLabel: 'Model Retraining', icon: Activity, color: 'text-[#60A5FA] bg-[#60A5FA]/12' },
  { id: '11', x: 350, y: 725, type: 'decision', label: 'KPI Check', icon: Activity },
  { id: '12', x: 650, y: 740, type: 'glass', label: 'Result', subLabel: 'Improvement Found', icon: Rocket, status: 'active' },

  { id: '13', x: 1000, y: 150, type: 'glass', label: 'Orchestrator', subLabel: 'Governance Agent', icon: Bot, color: 'text-[#60A5FA] bg-[#60A5FA]/12', status: 'active' },
  { id: '14', x: 850, y: 300, type: 'glass', label: 'Agent 1', subLabel: 'TOR Generator', icon: FileCheck },
  { id: '15', x: 1150, y: 300, type: 'glass', label: 'Agent 2', subLabel: 'Repo/Code Scan', icon: GitBranch },
  { id: '16', x: 850, y: 420, type: 'glass', label: 'Agent 3', subLabel: 'Bias Check', icon: Scale },
  { id: '17', x: 1150, y: 420, type: 'glass', label: 'Agent 4', subLabel: 'IMR Validator', icon: ShieldAlert },
  { id: '18', x: 1000, y: 550, type: 'glass', label: 'Output', subLabel: 'Final Doc List', icon: FileText },
  { id: '19', x: 1000, y: 670, type: 'glass', label: 'Presentation', subLabel: 'Points for PPP', icon: Users },
  { id: '20', x: 1000, y: 790, type: 'glass', label: 'Approval', subLabel: 'Panel Approve', icon: CheckCircle2, status: 'critical' },
  { id: '21', x: 1300, y: 790, type: 'glass', label: 'System', subLabel: 'Deploy to Prod', icon: Rocket, color: 'text-[#16A34A] bg-[#16A34A]/12' },
];

const INITIAL_EDGES = [
  { id: 'e1', source: '1', target: '2', color: '#8A94A6' },
  { id: 'e2', source: '2', target: '3', color: '#16A34A', label: 'Safe', sourceHandle: 'bottom' },
  { id: 'e3', source: '2', target: '4', color: '#EF6C6C', label: 'Risk', sourceHandle: 'right' },
  { id: 'e4', source: '4', target: '5', color: '#EF6C6C' },
  { id: 'e5', source: '5', target: '6', color: '#60A5FA', type: 'dashed' }, 
  { id: 'e6', source: '6', target: '7', color: '#60A5FA' },
  { id: 'e7', source: '7', target: '8', color: '#60A5FA' },
  { id: 'e8', source: '8', target: '9', color: '#60A5FA' },
  { id: 'e9', source: '9', target: '10', color: '#60A5FA' },
  { id: 'e10', source: '10', target: '11', color: '#60A5FA' },
  { id: 'e11', source: '11', target: '12', color: '#16A34A', label: 'Better', sourceHandle: 'right' },
  { id: 'e12', source: '11', target: '9', color: '#EF6C6C', label: 'Reject', type: 'dashed', sourceHandle: 'bottom' },
  { id: 'e13', source: '12', target: '13', color: '#60A5FA', label: 'Trigger Gov' },
  { id: 'e14', source: '13', target: '14', color: '#60A5FA' },
  { id: 'e15', source: '13', target: '15', color: '#60A5FA' },
  { id: 'e16', source: '13', target: '16', color: '#60A5FA' },
  { id: 'e17', source: '13', target: '17', color: '#60A5FA' },
  { id: 'e18', source: '14', target: '18', color: '#8A94A6' },
  { id: 'e19', source: '15', target: '18', color: '#8A94A6' },
  { id: 'e20', source: '16', target: '18', color: '#8A94A6' },
  { id: 'e21', source: '17', target: '18', color: '#8A94A6' },
  { id: 'e22', source: '18', target: '19', color: '#cbd5e1' },
  { id: 'e23', source: '19', target: '20', color: '#cbd5e1' },
  { id: 'e24', source: '20', target: '21', color: '#16A34A', label: 'Launch' },
  { id: 'e25', source: '21', target: '2', color: '#64748b', type: 'dashed', label: 'Update Model' },
];

export default function App() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  
  // View State
  const [mode, setMode] = useState('view'); // 'view' | 'edit'
  const [scale, setScale] = useState(0.6); // Start zoomed out slightly for mobile
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragTargetId, setDragTargetId] = useState(null); // null = panning background
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);

  useEffect(() => {
    const id = 'poppins-google-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // --- Sections (draggable + resizable) ---
  const INITIAL_SECTIONS = [
    { id: 'section-rt', x: 20, y: 50, w: 780, h: 350, title: 'Real-Time Detection' },
    { id: 'section-s1', x: 40, y: 450, w: 750, h: 380, title: 'Solution 1: GenAI & MLOps Improvement Loop' },
    { id: 'section-s2', x: 800, y: 100, w: 550, h: 800, title: 'Solution 2: Agent-Based Governance & Deployment' },
  ];

  const [sections, setSections] = useState(INITIAL_SECTIONS);

  // --- Glow Helpers ---
  const hexToRgba = (hex, alpha = 0.35) => {
    if (!hex) return `rgba(246,200,95,${alpha})`;
    let h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(ch => ch + ch).join('');
    if (h.length !== 6) return `rgba(246,200,95,${alpha})`;
    const r = parseInt(h.slice(0,2), 16);
    const g = parseInt(h.slice(2,4), 16);
    const b = parseInt(h.slice(4,6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getGlowColor = (node) => {
    const colorString = node.color || '';
    const match = colorString.match(/#([0-9a-fA-F]{3,6})/);
    if (match) return hexToRgba(`#${match[1]}`, 0.35);

    if (node.status === 'critical') return 'rgba(239,108,108,0.35)';
    if (node.status === 'active') return 'rgba(22,163,74,0.35)';
    return 'rgba(246,200,95,0.28)';
  };

  const handleStart = (clientX, clientY, targetId = null) => {
    const isNodeDrag = mode === 'edit' && targetId && !targetId.startsWith('resize-');
    setIsDragging(true);
    setDragTargetId(isNodeDrag ? targetId : targetId); // can be node id, section id, or resize id
    setLastPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    const deltaX = (clientX - lastPos.x);
    const deltaY = (clientY - lastPos.y);

    // If dragging a section
    if (dragTargetId && dragTargetId.startsWith && dragTargetId.startsWith('section-')) {
      const id = dragTargetId;
      setSections(prev => prev.map(s => s.id === id ? { ...s, x: s.x + deltaX / scale, y: s.y + deltaY / scale } : s));
    }
    // If resizing a section
    else if (dragTargetId && dragTargetId.startsWith && dragTargetId.startsWith('resize-')) {
      const id = dragTargetId.replace('resize-','');
      setSections(prev => prev.map(s => s.id === id ? { ...s, w: Math.max(120, s.w + deltaX / scale), h: Math.max(80, s.h + deltaY / scale) } : s));
    }
    // existing node dragging
    else if (dragTargetId) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragTargetId
            ? { ...n, x: n.x + deltaX / scale, y: n.y + deltaY / scale }
            : n
        )
      );
    } else {
      // panning
      setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    }

    setLastPos({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    setDragTargetId(null);
  };

  const onMouseDown = (e, id = null) => {
    if (e.button !== 0) return;
    if (id) e.stopPropagation();
    handleStart(e.clientX, e.clientY, id);
  };
  const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const onTouchStart = (e, id = null) => {
    if (e.touches.length !== 1) return;
    if (id) e.stopPropagation();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, id);
  };
  const onTouchMove = (e) => {
    if (e.touches.length !== 1 || !isDragging) return;
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.1, 2));
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.2));
  const zoomFit = () => { setScale(0.6); setPan({x: 0, y: 0}); };

  const renderEdges = () => {
    const OFF = 5000;
    return INITIAL_EDGES.map((edge) => {
      const startNode = nodes.find(n => n.id === edge.source);
      const endNode = nodes.find(n => n.id === edge.target);
      if (!startNode || !endNode) return null;

      let sx = startNode.x + (startNode.type === 'decision' ? 50 : 110);
      let sy = startNode.y + (startNode.type === 'decision' ? 100 : 80);
      let ex = endNode.x + (endNode.type === 'decision' ? 50 : 110);
      let ey = endNode.y;

      if (edge.sourceHandle === 'right') {
        sx = startNode.x + (startNode.type === 'decision' ? 100 : 220);
        sy = startNode.y + (startNode.type === 'decision' ? 50 : 40);
        ex = endNode.x + 0;
        ey = endNode.y + 20; 
      }
      if (edge.sourceHandle === 'bottom') {
        sx = startNode.x + 50;
        sy = startNode.y + 100;
      }
      
      let d = '';
      let labelOffset = 10;
      if (edge.source === '21' && edge.target === '2') {
        sx = startNode.x + 110; sy = startNode.y;
        ex = endNode.x + 50; ey = endNode.y;
        d = `M ${OFF+sx} ${OFF+sy} C ${OFF+sx + 200} ${OFF+sy - 300}, ${OFF+ex - 400} ${OFF+ey - 200}, ${OFF+ex} ${OFF+ey}`;
        labelOffset = -150;
      } else {
        const controlX = Math.abs(ex - sx) * 0.4;
        d = `M ${OFF+sx} ${OFF+sy} C ${OFF+sx + controlX} ${OFF+sy}, ${OFF+ex - controlX} ${OFF+ey}, ${OFF+ex} ${OFF+ey}`;
      }

      const markerId = `arrow-${edge.color.replace('#', '')}`;
      
      return (
        <g key={edge.id}>
          <path 
            d={d} fill="none" stroke={edge.color} strokeWidth="2" 
            markerEnd={`url(#${markerId})`} 
            strokeDasharray={edge.type === 'dashed' ? "6,6" : ""}
            className="transition-opacity duration-300"
          />
          
          {edge.type !== 'dashed' && (
            <circle r="3" fill={edge.color}>
              <animateMotion dur="4s" repeatCount="indefinite" path={d} />
            </circle>
          )}

          {edge.label && (
            <text x={OFF+(sx + ex) / 2} y={OFF+(sy + ey) / 2 - labelOffset} 
                  fill={edge.color} fontSize="12" fontWeight="bold" 
                  textAnchor="middle" 
                  className="bg-slate-950 px-1 py-0.5 rounded-md backdrop-blur-sm shadow-sm transition-opacity duration-300">
              {edge.label}
            </text>
          )}

          <marker id={markerId} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={edge.color} />
          </marker>
        </g>
      );
    });
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden touch-none"
      ref={containerRef}
      onMouseDown={(e) => onMouseDown(e, null)}
      onMouseMove={onMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => onTouchStart(e, null)}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEnd}
      style={{ backgroundColor: '#0F1724', color: '#F8FAFC', fontFamily: "'Poppins', Inter, system-ui, -apple-system, sans-serif" }}
    >
      {/* ----- Hover glow CSS (scoped here) ----- */}
      <style>{`
        .node-card {
          transition: transform 180ms cubic-bezier(.2,.9,.3,1), box-shadow 220ms ease, z-index 1;
          will-change: transform, box-shadow;
        }
        .node-card:hover {
          transform: translateY(-6px) scale(1.03);
          z-index: 70;
          box-shadow: 0 10px 40px var(--glow);
          border-color: rgba(255,255,255,0.06);
        }

        .decision-card {
          transition: transform 180ms cubic-bezier(.2,.9,.3,1), box-shadow 220ms ease;
          will-change: transform, box-shadow;
        }
        .decision-card:hover {
          transform: translateY(-6px) rotate(45deg) scale(1.04);
          z-index: 70;
          box-shadow: 0 12px 40px var(--glow);
        }

        .node-wrapper { pointer-events: auto; }

        /* section styles */
        .section-box { border-style: dashed; border-width: 2px; border-radius: 24px; background-clip: padding-box; }
        .section-title { font-weight: 700; font-size: 18px; }
        .section-resizer { width: 14px; height: 14px; border-radius: 3px; background: rgba(255,255,255,0.06); cursor: se-resize; display: flex; align-items: center; justify-content: center; }
      `}</style>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-18" 
        style={{ 
          backgroundImage: 'radial-gradient(#1b2430 1px, transparent 1px)', 
          backgroundSize: '30px 30px',
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          transition: 'background-position 0.1s linear'
        }}>
      </div>

      {/* Header & Mode Toggle */}
      <div className="fixed top-0 left-0 z-50 p-4 w-full pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(15,23,36,0.95) 0%, rgba(15,23,36,0.9) 60%, transparent 100%)' }}>
        <div className="flex justify-between items-start max-w-7xl mx-auto pointer-events-auto">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter"
                style={{ 
                  background: 'linear-gradient(90deg, #F6C85F 0%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 4px 18px rgba(246,200,95,0.12)'
                }}>
              SentineL - AI
            </h1>
            <p className="text-xs font-mono hidden md:block" style={{ color: '#CBD5E1' }}>Interactive Architecture Diagram</p> 
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-[#0F1724]/80 backdrop-blur border rounded-lg p-1 gap-1 shadow-xl" style={{ borderColor: 'rgba(138,148,166,0.12)' }}>
            <button 
              onClick={() => setMode('view')}
              title="Pan/Zoom mode"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all`}
              style={ mode === 'view'
                ? { backgroundColor: 'rgba(246,200,95,0.12)', color: '#F6C85F', boxShadow: '0 6px 20px rgba(246,200,95,0.06)' }
                : { color: '#9AA4B3' }}
            >
              <Hand size={16} />
              <span className="hidden sm:inline">View</span>
            </button>
            <button 
              onClick={() => setMode('edit')}
              title="Drag Nodes mode"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all`}
              style={ mode === 'edit'
                ? { backgroundColor: 'rgba(246,200,95,0.12)', color: '#F6C85F', boxShadow: '0 6px 20px rgba(246,200,95,0.06)' }
                : { color: '#9AA4B3' }}
            >
              <MousePointer2 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 bg-[#0F1724]/90 backdrop-blur rounded-xl p-2 border shadow-2xl pointer-events-auto" style={{ borderColor: 'rgba(138,148,166,0.12)' }}>
        <button onClick={zoomIn} title="Zoom In" className="p-3 hover:bg-[#0f1724]/70 rounded-lg active:bg-[#F6C85F]/10 transition-colors" style={{ color: '#F6C85F' }}>
          <Plus size={24} />
        </button>
        <button onClick={zoomOut} title="Zoom Out" className="p-3 hover:bg-[#0f1724]/70 rounded-lg active:bg-[#F6C85F]/10 transition-colors" style={{ color: '#F6C85F' }}>
          <Minus size={24} />
        </button>
        <div className="h-px mx-1" style={{ backgroundColor: 'rgba(138,148,166,0.12)' }}></div>
        <button onClick={zoomFit} title="Fit View" className="p-3 hover:bg-[#0f1724]/70 rounded-lg active:bg-[#F6C85F]/10 transition-colors" style={{ color: '#F6C85F' }}>
          <Maximize size={24} />
        </button>
      </div>

      {/* --- Infinite Canvas --- */}
      <div 
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, 
          transformOrigin: '0 0',
        }}
        className="absolute top-0 left-0 w-full h-full origin-top-left will-change-transform"
      >

        {/* SVG Edges */}
        <svg className="absolute -top-[5000px] -left-[5000px] w-[10000px] h-[10000px] pointer-events-none overflow-visible z-0">
          {renderEdges()}
        </svg>

        {/* Background Labels (Zones) - now draggable as full containers */}
        {sections.map(sec => (
          <div key={sec.id}
               className="absolute"
               style={{ left: sec.x, top: sec.y, width: sec.w, height: sec.h, touchAction: 'none' }}
          >
            {/* Make the entire bordered area interactive (outer wrapper catches drag) */}
            <div
              onMouseDown={(e) => { if (mode === 'edit') { e.stopPropagation(); onMouseDown(e, sec.id); } }}
              onTouchStart={(e) => { if (mode === 'edit') { e.stopPropagation(); onTouchStart(e, sec.id); } }}
              className="section-box p-4"
              style={{
                position: 'absolute',
                inset: 0,
                borderColor: 'rgba(255,255,255,0.95)',
                background: 'linear-gradient(180deg, rgba(15,23,36,0.02), rgba(15,23,36,0.01))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: 6,
                pointerEvents: 'auto'
              }}
            >
              <div className="flex justify-between items-start w-full">
                <h2 className="section-title" style={{ color: '#F6C85F', opacity: 0.95 }}>{sec.title}</h2>
                {mode === 'edit' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: '#CBD5E1' }}>Drag to move</div>
                  </div>
                )}
              </div>

              {/* content placeholder keeps box height; nodes render on top of sections */}
              <div style={{ flex: 1 }} />

              {/* resize handle (bottom-right) - part of the section so it resizes the whole bordered area */}
              {mode === 'edit' && (
                <div
                  onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, `resize-${sec.id}`); }}
                  onTouchStart={(e) => { e.stopPropagation(); onTouchStart(e, `resize-${sec.id}`); }}
                  className="absolute"
                  style={{ right: 8, bottom: 8, pointerEvents: 'auto' }}>
                  <div className="section-resizer" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Nodes */}
        {nodes.map((node) => {
          const glow = getGlowColor(node);
          return (
            <div
              key={node.id}
              onMouseDown={(e) => onMouseDown(e, node.id)}
              onTouchStart={(e) => onTouchStart(e, node.id)}
              style={{ 
                left: node.x, 
                top: node.y,
                width: node.type === 'decision' ? 100 : 220,
                height: node.type === 'decision' ? 100 : 'auto',
              }}
              className={`absolute node-wrapper group transition-shadow duration-200
                ${mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                ${dragTargetId === node.id ? 'z-50' : 'z-20'}
              `}
            >
              {/* Glass Node */}
              {node.type === 'glass' && (
                <div
                  className={`relative flex items-center gap-4 p-4 rounded-xl border backdrop-blur-xl shadow-2xl select-none node-card`}
                  style={{
                    borderColor: node.status === 'critical' ? 'rgba(239,108,108,0.18)' :
                                node.status === 'active' ? 'rgba(22,163,74,0.18)' : 'rgba(138,148,166,0.06)',
                    background: node.status === 'critical' ? 'rgba(239,108,108,0.04)' :
                                node.status === 'active' ? 'rgba(22,163,74,0.03)' : 'rgba(255,255,255,0.01)',
                    '--glow': glow,
                    boxShadow: dragTargetId === node.id ? `0 12px 60px ${glow}` : undefined
                  }}
                >
                  <div className={`p-2.5 rounded-lg ${node.color || 'bg-[#0b1220] text-[#9AA4B3]'}`}
                       style={{ background: node.color ? undefined : '#0b1220', color: node.color ? undefined : '#9AA4B3' }}>
                    {node.icon && <node.icon size={20} />}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#9AA4B3' }}>{node.label}</div>
                    <div className="text-sm font-medium leading-tight" style={{ color: '#F8FAFC' }}>{node.subLabel}</div>
                  </div>
                </div>
              )}

              {/* Decision Node (diamond) */}
              {node.type === 'decision' && (
                <div className="relative w-24 h-24 mx-auto select-none">
                  <div
                    className={`absolute inset-0 rotate-45 rounded-xl border-2 backdrop-blur-md shadow-lg flex items-center justify-center decision-card`}
                    style={{
                      background: 'rgba(15,23,36,0.9)',
                      borderColor: 'rgba(246,200,95,0.12)',
                      '--glow': glow,
                    }}
                  >
                    <div className="-rotate-45 text-center">
                      {node.icon && <node.icon className="w-6 h-6 mx-auto mb-1" style={{ color: '#F6C85F' }} />}
                      <div className="text-[9px] font-bold leading-none" style={{ color: '#F6C85F' }}>{node.label.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}
