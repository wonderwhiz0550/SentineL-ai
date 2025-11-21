import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, ShieldAlert, PhoneCall, BrainCircuit, GitBranch, 
  FileText, Scale, CheckCircle2, Users, Zap, Bot, 
  Database, FileCheck, Rocket, Plus, Minus, Maximize,
  Move, MousePointer2, Hand
} from 'lucide-react';

// --- Data Constants ---
// Theme 2 (Elegant Corporate) color palette applied inline:
// bg: #0F1724
// text: #F8FAFC
// gold accent: #F6C85F
// active green: #16A34A
// critical coral: #EF6C6C
// neutral edge: #8A94A6
// gov trigger: #60A5FA

const INITIAL_NODES = [
  // Section 1: Real-Time
  { id: '1', x: 50, y: 100, type: 'glass', label: 'Input', subLabel: 'Incoming Transaction', icon: Zap },
  { id: '2', x: 350, y: 70, type: 'decision', label: 'Decision Engine', icon: Activity },
  { id: '3', x: 350, y: 250, type: 'glass', label: 'Result', subLabel: 'Genuine', icon: CheckCircle2, status: 'active', color: 'text-[#16A34A] bg-[#16A34A]/12' },
  { id: '4', x: 650, y: 100, type: 'glass', label: 'Alert', subLabel: 'Fraud Detected', icon: ShieldAlert, status: 'critical', color: 'text-[#EF6C6C] bg-[#EF6C6C]/12' },
  { id: '5', x: 650, y: 300, type: 'glass', label: 'Action', subLabel: 'Customer Call', icon: PhoneCall },

  // Section 2: GenAI Solution
  { id: '6', x: 50, y: 500, type: 'glass', label: 'Input', subLabel: 'Call Transcript', icon: FileText },
  { id: '7', x: 350, y: 500, type: 'glass', label: 'GenAI Analysis', subLabel: 'Extract Fraud M.O.', icon: BrainCircuit, color: 'text-[#8B5CF6] bg-[#8B5CF6]/12' },
  { id: '8', x: 350, y: 620, type: 'glass', label: 'Optimization', subLabel: 'Rec. New Features', icon: Database },
  { id: '9', x: 50, y: 620, type: 'glass', label: 'Gate', subLabel: 'Developer Approval', icon: Users },
  { id: '10', x: 50, y: 740, type: 'glass', label: 'MLOps', subLabel: 'Model Retraining', icon: Activity, color: 'text-[#60A5FA] bg-[#60A5FA]/12' },
  { id: '11', x: 350, y: 725, type: 'decision', label: 'KPI Check', icon: Activity },
  { id: '12', x: 650, y: 740, type: 'glass', label: 'Result', subLabel: 'Improvement Found', icon: Rocket, status: 'active' },

  // Section 3: Governance
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

  // Inject Poppins font into head (so you don't have to edit HTML)
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

  // --- Handlers ---

  const handleStart = (clientX, clientY, targetId = null) => {
    // Determine if we are dragging a node or panning the background
    // Node drag only happens in 'edit' mode when clicking a node
    const isNodeDrag = mode === 'edit' && targetId !== null;
    
    setIsDragging(true);
    setDragTargetId(isNodeDrag ? targetId : null);
    setLastPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;

    const deltaX = clientX - lastPos.x;
    const deltaY = clientY - lastPos.y;

    if (dragTargetId) {
      // Dragging Node (Account for scale)
      setNodes((prev) =>
        prev.map((n) =>
          n.id === dragTargetId
            ? { ...n, x: n.x + deltaX / scale, y: n.y + deltaY / scale }
            : n
        )
      );
    } else {
      // Panning Background (Direct 1:1 movement feels best for pan)
      setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    }

    setLastPos({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    setIsDragging(false);
    setDragTargetId(null);
  };

  // --- Mouse Events ---
  const onMouseDown = (e, id = null) => {
    if (e.button !== 0) return;
    // Stop propagation if clicking a node so we don't double trigger
    if (id) e.stopPropagation(); 
    handleStart(e.clientX, e.clientY, id);
  };

  const onMouseMove = (e) => {
    handleMove(e.clientX, e.clientY);
  };

  // --- Touch Events ---
  const onTouchStart = (e, id = null) => {
    if (e.touches.length !== 1) return; // Only support single touch for drag/pan
    if (id) e.stopPropagation();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, id);
  };

  const onTouchMove = (e) => {
    if (e.touches.length !== 1 || !isDragging) return;
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  // --- Zoom ---
  const zoomIn = () => setScale(s => Math.min(s + 0.1, 2));
  const zoomOut = () => setScale(s => Math.max(s - 0.1, 0.2));
  const zoomFit = () => { setScale(0.6); setPan({x: 0, y: 0}); };

  // --- Render Functions ---

  // Helper function to calculate path for rendering
  const renderEdges = () => {
    const OFF = 5000; // Global SVG offset for visibility

    return INITIAL_EDGES.map((edge) => {
      const startNode = nodes.find(n => n.id === edge.source);
      const endNode = nodes.find(n => n.id === edge.target);
      if (!startNode || !endNode) return null;

      // Define default connection points (center-ish of bottom/top)
      let sx = startNode.x + (startNode.type === 'decision' ? 50 : 110);
      let sy = startNode.y + (startNode.type === 'decision' ? 100 : 80);
      let ex = endNode.x + (endNode.type === 'decision' ? 50 : 110);
      let ey = endNode.y; // Default connection to top of target node

      // Override connection points based on handle
      if (edge.sourceHandle === 'right') {
        sx = startNode.x + (startNode.type === 'decision' ? 100 : 220);
        sy = startNode.y + (startNode.type === 'decision' ? 50 : 40);
        ex = endNode.x + 0;
        ey = endNode.y + 20; 
      }
      if (edge.sourceHandle === 'bottom') {
        sx = startNode.x + 50;
        sy = startNode.y + 100;
        // ex, ey remain default (top center of target)
      }
      
      let d = '';
      let labelOffset = 10;
      
      // Special logic for the loop (Node 21 back to 2)
      if (edge.source === '21' && edge.target === '2') {
        sx = startNode.x + 110; sy = startNode.y;
        ex = endNode.x + 50; ey = endNode.y;
        // Use a large curved path that goes up and left
        d = `M ${OFF+sx} ${OFF+sy} C ${OFF+sx + 200} ${OFF+sy - 300}, ${OFF+ex - 400} ${OFF+ey - 200}, ${OFF+ex} ${OFF+ey}`;
        labelOffset = -150; // Adjust label position for the loop
      } else {
        // Standard vertical/horizontal curve
        const controlX = Math.abs(ex - sx) * 0.4; // 40% horizontal control point
        // const controlY = Math.abs(ey - sy) * 0.4; // 40% vertical control point (not used for this path style)
        
        // Simple cubic Bezier for smooth horizontal flow
        d = `M ${OFF+sx} ${OFF+sy} C ${OFF+sx + controlX} ${OFF+sy}, ${OFF+ex - controlX} ${OFF+ey}, ${OFF+ex} ${OFF+ey}`;
      }

      // Ensure the marker arrow matches the stroke color
      const markerId = `arrow-${edge.color.replace('#', '')}`;
      
      return (
        <g key={edge.id}>
          {/* Edge Path */}
          <path 
            d={d} fill="none" stroke={edge.color} strokeWidth="2" 
            markerEnd={`url(#${markerId})`} 
            strokeDasharray={edge.type === 'dashed' ? "6,6" : ""}
            className="transition-opacity duration-300"
          />
          
          {/* Animated Dot (Only for solid lines) */}
          {edge.type !== 'dashed' && (
            <circle r="3" fill={edge.color}>
              <animateMotion dur="4s" repeatCount="indefinite" path={d} />
            </circle>
          )}

          {/* Edge Label */}
          {edge.label && (
            <text x={OFF+(sx + ex) / 2} y={OFF+(sy + ey) / 2 - labelOffset} 
                  fill={edge.color} fontSize="12" fontWeight="bold" 
                  textAnchor="middle" 
                  className="bg-slate-950 px-1 py-0.5 rounded-md backdrop-blur-sm shadow-sm transition-opacity duration-300">
              {edge.label}
            </text>
          )}

          {/* Invisible path to generate the correct arrow head color */}
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
      // inline fontFamily ensures Poppins used even without Tailwind config
      style={{ backgroundColor: '#0F1724', color: '#F8FAFC', fontFamily: "'Poppins', Inter, system-ui, -apple-system, sans-serif" }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-18" 
          style={{ 
            backgroundImage: 'radial-gradient(#1b2430 1px, transparent 1px)', 
            backgroundSize: '30px 30px',
            backgroundPosition: `${pan.x}px ${pan.y}px`, // Apply pan to grid background
            transform: `scale(${scale})`, // Only scale the grid
            transformOrigin: '0 0',
            transition: 'background-position 0.1s linear' // Smooth panning feel
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
              SentineL AI
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

        {/* Background Labels (Zones) */}
        {/* Real-Time Zone */}
        <div className="absolute left-[20px] top-[50px] pointer-events-none">
            <h2 className="text-2xl font-bold" style={{ color: '#9AA4B3', opacity: 0.9 }}>Real-Time Detection</h2>
            <div className="w-[780px] h-[350px] border-2 border-dashed rounded-3xl mt-2" style={{ borderColor: 'rgba(138,148,166,0.08)', background: 'linear-gradient(180deg, rgba(15,23,36,0.02), rgba(15,23,36,0.01))' }}></div>
        </div>
        {/* Solution 1: GenAI & MLOps */}
        <div className="absolute left-[40px] top-[450px] pointer-events-none">
            <h2 className="text-2xl font-bold" style={{ color: '#9AA4B3', opacity: 0.9 }}>Solution 1: GenAI & MLOps Improvement Loop</h2><br></br>
            <div className="w-[750px] h-[380px] border-2 border-dashed rounded-3xl mt-2" style={{ borderColor: 'rgba(96,165,250,0.06)', background: 'linear-gradient(180deg, rgba(9,24,48,0.02), rgba(9,24,48,0.01))' }}></div>
        </div>
        {/* Solution 2: Agent Governance */}
        <div className="absolute left-[800px] top-[100px] pointer-events-none">
            <h2 className="text-2xl font-bold" style={{ color: '#9AA4B3', opacity: 0.9 }}>Solution 2: Agent-Based Governance & Deployment</h2>
            <div className="w-[550px] h-[800px] border-2 border-dashed rounded-3xl mt-2" style={{ borderColor: 'rgba(96,165,250,0.06)', background: 'linear-gradient(180deg, rgba(9,24,48,0.02), rgba(9,24,48,0.01))' }}></div>
        </div>


        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            onMouseDown={(e) => onMouseDown(e, node.id)}
            onTouchStart={(e) => onTouchStart(e, node.id)}
            style={{ 
              left: node.x, 
              top: node.y,
              width: node.type === 'decision' ? 100 : 220,
              height: node.type === 'decision' ? 100 : 'auto'
            }}
            className={`
              absolute group transition-shadow duration-200
              ${mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
              ${dragTargetId === node.id ? 'z-50 shadow-[0_0_50px_rgba(255,255,255,0.06)]' : 'z-20'}
            `}
          >
            {/* Glass Node Style */}
            {node.type === 'glass' && (
              <div className={`
                relative flex items-center gap-4 p-4 rounded-xl border backdrop-blur-xl shadow-2xl select-none
                ${node.status === 'critical' ? 'border-8' : node.status === 'active' ? 'border-8' : 'border-8'}
                ${mode === 'edit' ? '' : ''}
                transition-all
              `} style={{
                borderColor: node.status === 'critical' ? 'rgba(239,108,108,0.18)' :
                              node.status === 'active' ? 'rgba(22,163,74,0.18)' : 'rgba(138,148,166,0.06)',
                background: node.status === 'critical' ? 'rgba(239,108,108,0.04)' :
                            node.status === 'active' ? 'rgba(22,163,74,0.03)' : 'rgba(255,255,255,0.01)'
              }}>
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
            
            {/* Decision Node Style (Diamond) */}
            {node.type === 'decision' && (
              <div className="relative w-24 h-24 mx-auto select-none">
                <div className={`
                  absolute inset-0 rotate-45 rounded-xl border-2 backdrop-blur-md shadow-lg flex items-center justify-center
                  transition-all
                `} style={{ background: 'rgba(15,23,36,0.9)', borderColor: 'rgba(246,200,95,0.12)' }}>
                  <div className="-rotate-45 text-center">
                    {node.icon && <node.icon className="w-6 h-6 mx-auto mb-1" style={{ color: '#F6C85F' }} />}
                    <div className="text-[9px] font-bold leading-none" style={{ color: '#F6C85F' }}>{node.label.toUpperCase()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
