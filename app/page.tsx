"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  ReactFlow, 
  Background, 
  Node, 
  Edge, 
  Position,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css"; 

import { Play, Pause, RotateCcw, Download, ShieldAlert, Layers, BarChart3, Info, Terminal, Radio } from "lucide-react";

interface CascadeNode {
  id: string;
  user: string;
  platform: string;
  type: "origin" | "influencer" | "routing";
  content: string;
  reach: number;
  timestamp: number;
  parentId: string | null;
}

interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  type: "info" | "warning" | "critical" | "success";
}

export default function SocialViralityCascadeExplorer() {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const maxTime = 60;
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All");
  const [hoveredNode, setHoveredNode] = useState<CascadeNode | null>(null);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // 📂 Scenario State Engine (Swaps data files dynamically via FastAPI)
  const [selectedScenario, setSelectedScenario] = useState<string>("A");

  // Core reactive state populated asynchronously via Python FastAPI pipelines
  const [backendNodes, setBackendNodes] = useState<CascadeNode[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Asynchronous API Engine: Queries Pandas filtration pipelines on FastAPI backend
  useEffect(() => {
    async function fetchCascadeData() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/cascade?time=${currentTime}&scenario=${selectedScenario}`);
        if (response.ok) {
          const data = await response.json();
          setBackendNodes(data);
        }
      } catch (error) {
        console.error("FastAPI connection offline. Launch via: uvicorn main:app --reload", error);
      }
    }
    fetchCascadeData();
  }, [currentTime, selectedScenario]);

  // Dynamic Scoreboard contextual parameters mapping
  const scoreboardMetadata = useMemo(() => {
    if (selectedScenario === "B") {
      return {
        totalViews: "1,004,200",
        highestShares: "31,000 shares/min",
        mainApp: "TikTok (67.7% attention share)"
      };
    }
    // Default Scenario A metrics
    return {
      totalViews: "407,600",
      highestShares: "14,200 shares/min",
      mainApp: "TikTok (61.3% attention share)"
    };
  }, [selectedScenario]);

  // Assemble logging entries dynamically based on data returned by Pandas
  useEffect(() => {
    const freshLogs: LogMessage[] = [];
    
    backendNodes.forEach((node) => {
      const timeStr = `[T+${String(node.timestamp).padStart(2, "0")}m]`;
      
      if (node.type === "origin") {
        freshLogs.push({
          id: `log-origin-${node.id}`,
          timestamp: timeStr,
          text: `ALERT: Origin leak detected on ${node.platform} by ${node.user}. Payload: "${node.content.substring(0, 45)}..."`,
          type: "critical"
        });
      } else if (node.type === "influencer") {
        freshLogs.push({
          id: `log-inf-${node.id}`,
          timestamp: timeStr,
          text: `WARNING: High-density Hub reached on ${node.platform} via ${node.user}. Cross-platform acceleration active.`,
          type: "warning"
        });
      } else {
        freshLogs.push({
          id: `log-org-${node.id}`,
          timestamp: timeStr,
          text: `ROUTING: Secondary packet replication verified on ${node.platform} by ${node.user}.`,
          type: "info"
        });
      }
    });

    if (currentTime >= 30) {
      freshLogs.push({
        id: "log-milestone-30",
        timestamp: "[T+30m]",
        text: "SYSTEM: Cascade event has breached global velocity thresholds. Attention ceiling incoming.",
        type: "success"
      });
    }
    if (currentTime >= 60) {
      freshLogs.push({
        id: "log-milestone-60",
        timestamp: "[T+60m]",
        text: "MONITOR: Distribution velocities falling below critical margin. Decay half-life limit achieved.",
        type: "success"
      });
    }

    setLogs(freshLogs.sort((a, b) => a.timestamp.localeCompare(b.timestamp)));
  }, [backendNodes, currentTime]);

  // Timeline playback interval engine
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }
          return prev + 5; 
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Apply visual platform constraints across incoming data arrays
  const visibleRawNodes = useMemo(() => {
    return backendNodes.filter((node) => {
      return selectedPlatform === "All" || node.platform === selectedPlatform;
    });
  }, [backendNodes, selectedPlatform]);

  // Custom Branded Platform Nodes
  const flowNodes = useMemo<Node[]>(() => {
    return visibleRawNodes.map((node, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      let borderColor = "border-slate-800";
      let bgColor = "bg-slate-950/90";
      let textColor = "text-slate-300";
      let platformBadgeColor = "bg-slate-900 text-slate-400 border-slate-800";

      if (node.platform === "X") {
        borderColor = node.type === "origin" ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.25)]" : "border-slate-600";
        bgColor = "bg-black/90";
        textColor = "text-white";
        platformBadgeColor = "bg-white text-black border-white/20";
      } else if (node.platform === "TikTok") {
        borderColor = "border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)]";
        bgColor = "bg-zinc-950";
        textColor = "text-slate-100";
        platformBadgeColor = "bg-pink-950/40 text-pink-400 border-pink-500/30";
      } else if (node.platform === "LinkedIn") {
        borderColor = "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]";
        bgColor = "bg-slate-950";
        textColor = "text-slate-100";
        platformBadgeColor = "bg-blue-950 text-blue-400 border-blue-500/30";
      } else if (node.platform === "Reddit") {
        borderColor = "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]";
        bgColor = "bg-stone-900/95";
        textColor = "text-slate-100";
        platformBadgeColor = "bg-orange-950/40 text-orange-400 border-orange-500/30";
      }

      return {
        id: node.id,
        data: { 
          label: (
            <div 
              className="flex flex-col items-center justify-center p-2 text-center relative"
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div className="text-[10px] font-mono font-bold truncate max-w-[115px] tracking-tight">{node.user}</div>
              <div className={`text-[8px] font-mono font-bold tracking-widest mt-1 uppercase px-1.5 py-0.5 rounded border ${platformBadgeColor}`}>
                {node.platform}
              </div>
              <div className="mt-1 text-[8px] px-1.5 py-0.2 bg-black/40 rounded border border-slate-800/60 text-slate-500 font-mono">
                +{node.timestamp}m
              </div>
            </div>
          )
        },
        position: { x: 80 + col * 190 + (row * 20), y: 35 + row * 115 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: "transparent",
          color: "inherit",
          width: 145,
          padding: 0,
          borderRadius: "6px"
        },
        className: `border transition-all duration-300 rounded-md cursor-grab active:cursor-grabbing ${borderColor} ${bgColor} ${textColor}`
      };
    });
  }, [visibleRawNodes]);

  // Animated platform link edges
  const flowEdges = useMemo<Edge[]>(() => {
    const edges: Edge[] = [];
    visibleRawNodes.forEach((node) => {
      if (node.parentId && visibleRawNodes.some(n => n.id === node.parentId)) {
        let edgeColor = "#e2e8f0"; 
        if (node.platform === "TikTok") edgeColor = "#ec4899";
        if (node.platform === "LinkedIn") edgeColor = "#3b82f6";
        if (node.platform === "Reddit") edgeColor = "#f97316";

        edges.push({
          id: `edge-${node.parentId}-${node.id}`,
          source: node.parentId,
          target: node.id,
          animated: true, 
          style: { stroke: edgeColor, strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 12,
            height: 12,
            color: edgeColor
          }
        });
      }
    });
    return edges;
  }, [visibleRawNodes]);

  const currentMetrics = useMemo(() => {
    const totalVisibleReach = visibleRawNodes.reduce((acc, curr) => acc + curr.reach, 0);
    return {
      activeNodes: visibleRawNodes.length,
      accumulatedReach: totalVisibleReach,
      velocity: visibleRawNodes.length > 1 ? `${Math.round(totalVisibleReach / (currentTime || 1))} views/min` : "0 views/min"
    };
  }, [visibleRawNodes, currentTime]);

  const downloadSampleData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backendNodes, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "social_virality_cascade_sample.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#030712]" />;
  }

  return (
    <div className="h-screen w-screen bg-[#030712] text-slate-100 font-sans selection:bg-white/20 overflow-hidden flex flex-col">
      <title>Social Virality Cascade Explorer</title>
      
      {/* Top Navbar Header */}
      <header className="border-b border-slate-800/60 bg-[#090d16] px-6 py-3.5 flex items-center justify-between backdrop-blur-md shrink-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="h-3 w-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          <h1 className="text-md font-semibold tracking-tight text-slate-200">
            Real Rails Intelligence Library <span className="text-slate-500 font-normal">|</span> <span className="text-white font-medium">Social Virality Cascade Explorer</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-mono uppercase bg-slate-800/60 text-slate-300 border border-slate-700/50 px-2.5 py-1 rounded flex items-center gap-1.5">
            <Radio size={11} className="text-white animate-pulse" /> Rail: Distribution & Demand
          </span>
        </div>
      </header>

      {/* Main Framework Body Split Layout */}
      <main className="flex flex-1 flex-row overflow-hidden w-full">
        
        {/* ============================================================================ */}
        {/* LEFT SECTION: MAP STAGE & LIVE CONSOLE TICKER GRID (Strictly 69% Width)       */}
        {/* ============================================================================ */}
        <section className="w-[69%] p-5 flex flex-col border-r border-slate-800/40 h-full overflow-hidden justify-between space-y-4">
          
          {/* Header Action Menu strip */}
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-2.5 shrink-0">
            <div>
              <h2 className="text-sm font-medium text-slate-300">Cascade Replay Stage</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Scroll or pinch layout to zoom, click and drag background to pan network topology.</p>
            </div>
            <div className="flex items-center space-x-2">
              {/* Incident Scenario Selector Dropdown */}
              <select 
                value={selectedScenario} 
                onChange={(e) => { setSelectedScenario(e.target.value); setCurrentTime(0); }}
                className="bg-slate-900 border border-slate-800 text-xs text-white rounded px-3 py-1.5 focus:outline-none focus:border-white"
              >
                <option value="A">Incident A: Corporate Security Leak</option>
                <option value="B">Incident B: Hardware Smart Ring Rumor</option>
              </select>

              {/* Platform Filter Dropdown */}
              <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-3 py-1.5 focus:outline-none focus:border-white"
              >
                <option value="All">All Platforms</option>
                <option value="X">X (Twitter)</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="TikTok">TikTok</option>
                <option value="Reddit">Reddit</option>
              </select>
            </div>
          </div>

          {/* Large Expandable View Stage Mapping Canvas */}
          <div className="relative flex-[3.5] bg-[#050911] rounded-lg border border-slate-800/80 overflow-hidden shadow-inner w-full">
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              fitView
              attributionPosition="bottom-right"
            >
              <Background color="#1e293b" gap={20} size={1} />
            </ReactFlow>

            {/* Hover Data HUD Overlay Card */}
            <div className="absolute top-3 left-3 z-20 min-w-[250px] max-w-xs bg-[#0a0f1d]/95 backdrop-blur-md border border-slate-800 rounded p-2.5 shadow-2xl pointer-events-none">
              {hoveredNode ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white font-mono">{hoveredNode.user}</span>
                    <span className="text-[8px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {hoveredNode.platform}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic line-clamp-2">"{hoveredNode.content}"</p>
                  <div className="pt-1 border-t border-slate-800/60 flex justify-between text-[9px] font-mono text-slate-400">
                    <span>Reach: <strong className="text-slate-200">{hoveredNode.reach.toLocaleString()}</strong></span>
                    <span>T + {hoveredNode.timestamp}m</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Info size={12} className="text-slate-400" /> Hover cursor over graph nodes to decode logs.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Playback Tracker Deck */}
          <div className="bg-[#090d16] border border-slate-800/80 rounded-lg p-3.5 space-y-2.5 shrink-0 w-full shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded flex items-center justify-center transition-colors shadow-sm bg-white hover:bg-slate-200 text-black"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>
                <button
                  onClick={() => { setIsPlaying(false); setCurrentTime(0); }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <span className="text-xs font-mono text-slate-400 px-1">
                  Timeline Offset: <strong className="text-white font-bold">T + {currentTime} minutes</strong>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800/40 px-2.5 py-1 rounded">
                <div>Nodes: <span className="text-slate-200 font-bold">{currentMetrics.activeNodes}</span></div>
                <div>Reach: <span className="text-white font-bold">{currentMetrics.accumulatedReach.toLocaleString()}</span></div>
                <div>Velocity: <span className="text-slate-300 font-bold">{currentMetrics.velocity}</span></div>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max={maxTime}
              step="5"
              value={currentTime}
              onChange={(e) => setCurrentTime(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
            />
          </div>

          {/* Live System Terminal Monitor Alert Log Ticker Component */}
          <div className="bg-black border border-slate-800 rounded-lg p-3 font-mono text-xs flex flex-col flex-[0.9] min-h-[105px] max-h-[125px] shadow-2xl shrink-0 w-full">
            <div className="flex items-center space-x-2 border-b border-slate-900 pb-1.5 mb-1.5 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
              <Terminal size={11} className="text-white" />
              <span>Real-Time Intelligence Network Ticker Log</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800 pr-1 text-[11px]">
              {logs.length === 0 ? (
                <div className="text-slate-600 italic animate-pulse">Awaiting timeline activation sequence... Press play to stream packet logs.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
                    <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                    <span className={`
                      ${log.type === "critical" ? "text-amber-500 font-medium" : ""}
                      ${log.type === "warning" ? "text-yellow-400/90" : ""}
                      ${log.type === "success" ? "text-white font-bold" : ""}
                      ${log.type === "info" ? "text-slate-300" : ""}
                    `}>
                      {log.text}
                    </span>
                  </div>
                ))
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RIGHT SECTION: BRIEFING TEXT CONTEXT SIDEBAR (Strictly 31% Width)         */}
        {/* ========================================================================= */}
        <section className="w-[31%] bg-[#060a12] p-5 flex flex-col space-y-5 h-full overflow-y-auto border-l border-slate-800/10 shrink-0 justify-between">
          
          <div className="space-y-5">
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">Dashboard Breakdown</h3>
              <h2 className="text-sm font-bold text-slate-200 mt-1">Incident Tactical Intelligence Brief</h2>
            </div>

            <hr className="border-slate-800/60" />

            {/* KPI Analytics Cards Panel */}
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-slate-900/50 border border-slate-800/80 rounded p-2.5 font-mono">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Total Aggregate Views</div>
                <div className="text-lg font-bold text-white mt-0.5 tracking-tight">{scoreboardMetadata.totalViews}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/50 border border-slate-800/80 rounded p-2.5 font-mono">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Peak Velocity</div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">{scoreboardMetadata.highestShares}</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800/80 rounded p-2.5 font-mono">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Primary Rail Share</div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate">{scoreboardMetadata.mainApp.split(" ")[0]}</div>
                </div>
              </div>
              <div className="bg-slate-900/30 border border-slate-950 rounded px-2.5 py-1 text-[10px] font-mono text-slate-500 flex justify-between">
                <span>Attention Density:</span>
                <span className="text-slate-400 font-medium">{scoreboardMetadata.mainApp.substring(scoreboardMetadata.mainApp.indexOf("("))}</span>
              </div>
            </div>

            {/* Insight Segment 1 */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                <BarChart3 size={12} className="text-slate-200" /> 1. Why This Matters
              </h4>
              <div className="bg-slate-900/40 border border-slate-800/60 rounded p-3 text-xs text-slate-400 leading-relaxed space-y-2">
                <p>
                  Algorithmic amplification from a single tier-1 platform account determines whether content reaches mass distribution or decays within the originating network.
                </p>
                <p className="text-slate-200 font-medium text-[11px]">
                  Absent high-density node acceleration, localized information anomalies consistently fail to breach cross-platform velocity thresholds.
                </p>
              </div>
            </div>

            {/* Insight Segment 2 */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                <ShieldAlert size={12} className="text-slate-200" /> 2. Who Controls the Rail
              </h4>
              <div className="bg-slate-900/40 border border-slate-800/60 rounded p-3 text-xs text-slate-400 leading-relaxed">
                <p>
                  Propagation velocity depends strictly on proprietary algorithmic ingestion models. These platform routing engines prioritize engagement based on thematic volatility and interactive friction coefficients to maximize terminal user attention share.
                </p>
              </div>
            </div>
          </div>

          {/* Export Action */}
          <div className="pt-2 shrink-0">
            <button
              onClick={downloadSampleData}
              className="w-full py-2 bg-slate-900 border border-slate-800 hover:border-white/40 hover:bg-slate-800 rounded text-xs font-mono font-medium text-slate-300 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
            >
              <Download size={12} className="text-white" />
              <span>Save Data File to Computer</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}