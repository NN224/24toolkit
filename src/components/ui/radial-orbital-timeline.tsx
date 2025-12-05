"use client";

import { useState, useEffect, useRef } from "react";

import { ArrowRight, Link, Zap, Play, Pause, RotateCw, RotateCcw, Info, ZoomIn, ZoomOut, Maximize2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



interface TimelineItem {

  id: number;

  title: string;

  date: string;

  content: string;

  category: string;

  icon: React.ElementType;

  relatedIds: number[];

  status: "completed" | "in-progress" | "pending";

  energy: number;

}



interface RadialOrbitalTimelineProps {

  timelineData: TimelineItem[];

}



export default function RadialOrbitalTimeline({

  timelineData,

}: RadialOrbitalTimelineProps) {

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(

    {}

  );

  const [viewMode, setViewMode] = useState<"orbital">("orbital");

  const [rotationAngle, setRotationAngle] = useState<number>(0);

  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});

  const [centerOffset, setCenterOffset] = useState<{ x: number; y: number }>({

    x: 0,

    y: 0,

  });

  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.3);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [showConnections, setShowConnections] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);

  const orbitRef = useRef<HTMLDivElement>(null);

  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});



  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {

    if (e.target === containerRef.current || e.target === orbitRef.current) {

      setExpandedItems({});

      setActiveNodeId(null);

      setPulseEffect({});

      setAutoRotate(true);

    }

  };



  const toggleItem = (id: number) => {

    setExpandedItems((prev) => {

      const newState = { ...prev };

      Object.keys(newState).forEach((key) => {

        if (parseInt(key) !== id) {

          newState[parseInt(key)] = false;

        }

      });



      newState[id] = !prev[id];



      if (!prev[id]) {

        setActiveNodeId(id);

        setAutoRotate(false);



        const relatedItems = getRelatedItems(id);

        const newPulseEffect: Record<number, boolean> = {};

        relatedItems.forEach((relId) => {

          newPulseEffect[relId] = true;

        });

        setPulseEffect(newPulseEffect);



        centerViewOnNode(id);

      } else {

        setActiveNodeId(null);

        setAutoRotate(true);

        setPulseEffect({});

      }



      return newState;

    });

  };



  useEffect(() => {

    let rotationTimer: NodeJS.Timeout;



    if (autoRotate && viewMode === "orbital") {

      rotationTimer = setInterval(() => {

        setRotationAngle((prev) => {

          const newAngle = (prev + rotationSpeed) % 360;

          return Number(newAngle.toFixed(3));

        });

      }, 50);

    }



    return () => {

      if (rotationTimer) {

        clearInterval(rotationTimer);

      }

    };

  }, [autoRotate, viewMode, rotationSpeed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setAutoRotate(prev => !prev);
          break;
        case '+':
        case '=':
          e.preventDefault();
          setRotationSpeed(prev => Math.min(1, prev + 0.1));
          break;
        case '-':
        case '_':
          e.preventDefault();
          setRotationSpeed(prev => Math.max(0.1, prev - 0.1));
          break;
        case 'c':
          e.preventDefault();
          setShowConnections(prev => !prev);
          break;
        case 's':
          e.preventDefault();
          setShowStats(prev => !prev);
          break;
        case 'Escape':
          setExpandedItems({});
          setActiveNodeId(null);
          setPulseEffect({});
          setAutoRotate(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);



  const centerViewOnNode = (nodeId: number) => {

    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;



    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);

    const totalNodes = timelineData.length;

    const targetAngle = (nodeIndex / totalNodes) * 360;



    setRotationAngle(270 - targetAngle);

  };



  const calculateNodePosition = (index: number, total: number) => {

    const angle = ((index / total) * 360 + rotationAngle) % 360;

    const radius = 200 * zoom;

    const radian = (angle * Math.PI) / 180;



    const x = radius * Math.cos(radian) + centerOffset.x;

    const y = radius * Math.sin(radian) + centerOffset.y;



    const zIndex = Math.round(100 + 50 * Math.cos(radian));

    const opacity = Math.max(

      0.4,

      Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))

    );



    return { x, y, angle, zIndex, opacity };

  };

  // Filter timeline data based on search
  const filteredTimelineData = timelineData.filter(item => 
    searchQuery === "" || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate connection lines between related items
  const getConnectionLines = () => {
    if (!showConnections) return [];
    
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];
    
    timelineData.forEach((item, index) => {
      const sourcePos = calculateNodePosition(index, timelineData.length);
      
      item.relatedIds.forEach((relatedId) => {
        const relatedIndex = timelineData.findIndex(i => i.id === relatedId);
        if (relatedIndex !== -1) {
          const targetPos = calculateNodePosition(relatedIndex, timelineData.length);
          const isActive = activeNodeId === item.id || activeNodeId === relatedId;
          
          lines.push({
            x1: sourcePos.x,
            y1: sourcePos.y,
            x2: targetPos.x,
            y2: targetPos.y,
            opacity: isActive ? 0.6 : 0.2
          });
        }
      });
    });
    
    return lines;
  };



  const getRelatedItems = (itemId: number): number[] => {

    const currentItem = timelineData.find((item) => item.id === itemId);

    return currentItem ? currentItem.relatedIds : [];

  };



  const isRelatedToActive = (itemId: number): boolean => {

    if (!activeNodeId) return false;

    const relatedItems = getRelatedItems(activeNodeId);

    return relatedItems.includes(itemId);

  };



  const getStatusStyles = (status: TimelineItem["status"]): string => {

    switch (status) {

      case "completed":

        return "text-white bg-black border-white";

      case "in-progress":

        return "text-black bg-white border-black";

      case "pending":

        return "text-white bg-black/40 border-white/50";

      default:

        return "text-white bg-black/40 border-white/50";

    }

  };



  // Calculate statistics
  const stats = {
    total: timelineData.length,
    completed: timelineData.filter(item => item.status === "completed").length,
    inProgress: timelineData.filter(item => item.status === "in-progress").length,
    pending: timelineData.filter(item => item.status === "pending").length,
    avgEnergy: Math.round(timelineData.reduce((sum, item) => sum + item.energy, 0) / timelineData.length),
    progress: Math.round(
      (timelineData.filter(item => item.status === "completed").length / timelineData.length) * 100
    ),
  };

  return (

    <div

      className="w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden relative"

      ref={containerRef}

      onClick={handleContainerClick}

    >
      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 text-xs text-white/60">
          <span className="hidden sm:inline">Press </span>
          <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Space</kbd>
          <span className="hidden sm:inline"> to pause, </span>
          <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">C</kbd>
          <span className="hidden sm:inline"> for connections, </span>
          <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">S</kbd>
          <span className="hidden sm:inline"> for stats</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-start gap-4" dir="ltr">
        {/* Stats Card */}
        {showStats && (
          <Card className="bg-black/90 backdrop-blur-lg border-white/20 shadow-xl min-w-[180px]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/80 space-y-1">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-mono">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">Completed:</span>
                <span className="font-mono">{stats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">In Progress:</span>
                <span className="font-mono">{stats.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending:</span>
                <span className="font-mono">{stats.pending}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span>Avg Energy:</span>
                <span className="font-mono">{stats.avgEnergy}%</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span>Progress:</span>
                <span className="font-mono">{stats.progress}%</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${stats.progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowStats(!showStats);
            }}
            className="bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all"
            title={showStats ? "Hide Statistics" : "Show Statistics"}
          >
            <Info size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setAutoRotate(!autoRotate);
            }}
            className="bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all"
            title={autoRotate ? "Pause Rotation" : "Resume Rotation"}
          >
            {autoRotate ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setRotationSpeed(prev => Math.min(1, prev + 0.1));
            }}
            className="bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all"
            title="Increase Speed"
          >
            <RotateCw size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setRotationSpeed(prev => Math.max(0.1, prev - 0.1));
            }}
            className="bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all"
            title="Decrease Speed"
          >
            <RotateCcw size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(prev => Math.min(1.5, prev + 0.1));
            }}
            className="bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(prev => Math.max(0.5, prev - 0.1));
            }}
            className="bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowConnections(!showConnections);
            }}
            className={`bg-black/90 backdrop-blur-lg border-white/20 text-white hover:bg-white/10 transition-all ${showConnections ? 'bg-white/10' : ''}`}
            title={showConnections ? "Hide Connections" : "Show Connections"}
          >
            <Link size={16} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search timeline..."
            className="w-full pl-10 pr-4 py-2 bg-black/90 backdrop-blur-lg border border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:border-white/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-xs text-white/70 text-center">
            Found {filteredTimelineData.length} of {timelineData.length} items
          </div>
        )}
      </div>

      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">

        <div

          className="absolute w-full h-full flex items-center justify-center"

          ref={orbitRef}

          style={{

            perspective: "1000px",

            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,

          }}

        >

          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 animate-pulse flex items-center justify-center z-10">

            <div className="absolute w-20 h-20 rounded-full border border-white/20 animate-ping opacity-70"></div>

            <div

              className="absolute w-24 h-24 rounded-full border border-white/10 animate-ping opacity-50"

              style={{ animationDelay: "0.5s" }}

            ></div>

            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md"></div>

          </div>



          <div className="absolute w-96 h-96 rounded-full border border-white/10" style={{ transform: `scale(${zoom})` }}></div>

          {/* Connection Lines SVG */}
          {showConnections && (
            <svg
              className="absolute w-full h-full pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(147, 51, 234, 0.6)" />
                  <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
                  <stop offset="100%" stopColor="rgba(20, 184, 166, 0.6)" />
                </linearGradient>
              </defs>
              {getConnectionLines().map((line, idx) => (
                <g key={idx}>
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    opacity={line.opacity}
                    className="transition-opacity duration-500"
                    style={{
                      filter: 'blur(0.5px)',
                    }}
                  />
                  {/* Glow effect */}
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="4"
                    opacity={line.opacity * 0.3}
                    className="transition-opacity duration-500"
                    style={{
                      filter: 'blur(2px)',
                    }}
                  />
                </g>
              ))}
            </svg>
          )}

          {filteredTimelineData.map((item, index) => {
            const originalIndex = timelineData.findIndex(i => i.id === item.id);

            const position = calculateNodePosition(originalIndex, timelineData.length);

            const isExpanded = expandedItems[item.id];

            const isRelated = isRelatedToActive(item.id);

            const isPulsing = pulseEffect[item.id];

            const Icon = item.icon;



            const nodeStyle = {

              transform: `translate(${position.x}px, ${position.y}px)`,

              zIndex: isExpanded ? 200 : position.zIndex,

              opacity: isExpanded ? 1 : position.opacity,

            };



            return (

              <div

                key={item.id}

                ref={(el) => (nodeRefs.current[item.id] = el)}

                className="absolute transition-all duration-700 cursor-pointer"

                style={nodeStyle}

                onClick={(e) => {

                  e.stopPropagation();

                  toggleItem(item.id);

                }}

              >

                <div

                  className={`absolute rounded-full -inset-1 ${

                    isPulsing ? "animate-pulse duration-1000" : ""

                  }`}

                  style={{

                    background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,

                    width: `${item.energy * 0.5 + 40}px`,

                    height: `${item.energy * 0.5 + 40}px`,

                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,

                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,

                  }}

                ></div>



                <div

                  className={`

                  w-10 h-10 rounded-full flex items-center justify-center

                  ${

                    isExpanded

                      ? "bg-white text-black"

                      : isRelated

                      ? "bg-white/50 text-black"

                      : "bg-black text-white"

                  }

                  border-2 

                  ${

                    isExpanded

                      ? "border-white shadow-lg shadow-white/30"

                      : isRelated

                      ? "border-white animate-pulse"

                      : "border-white/40"

                  }

                  transition-all duration-300 transform

                  ${isExpanded ? "scale-150" : ""}

                `}

                >

                  <Icon size={16} />

                </div>



                <div

                  className={`

                  absolute top-12  whitespace-nowrap

                  text-xs font-semibold tracking-wider

                  transition-all duration-300

                  ${isExpanded ? "text-white scale-125" : "text-white/70"}

                `}

                >

                  {item.title}

                </div>



                {isExpanded && (

                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-black/90 backdrop-blur-lg border-white/30 shadow-xl shadow-white/10 overflow-visible">

                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-white/50"></div>

                    <CardHeader className="pb-2">

                      <div className="flex justify-between items-center">

                        <Badge

                          className={`px-2 text-xs ${getStatusStyles(

                            item.status

                          )}`}

                        >

                          {item.status === "completed"

                            ? "COMPLETE"

                            : item.status === "in-progress"

                            ? "IN PROGRESS"

                            : "PENDING"}

                        </Badge>

                        <span className="text-xs font-mono text-white/50">

                          {item.date}

                        </span>

                      </div>

                      <CardTitle className="text-sm mt-2">

                        {item.title}

                      </CardTitle>

                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs px-2 py-0 border-white/30 text-white/70 bg-transparent">
                          {item.category}
                        </Badge>
                      </div>

                    </CardHeader>

                    <CardContent className="text-xs text-white/80">

                      <p className="leading-relaxed">{item.content}</p>



                      <div className="mt-4 pt-3 border-t border-white/10">

                        <div className="flex justify-between items-center text-xs mb-1">

                          <span className="flex items-center gap-1">

                            <Zap size={10} />

                            <span>Energy Level</span>

                          </span>

                          <span className="font-mono">{item.energy}%</span>

                        </div>

                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">

                          <div

                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"

                            style={{ width: `${item.energy}%` }}

                          ></div>

                        </div>

                      </div>



                      {item.relatedIds.length > 0 && (

                        <div className="mt-4 pt-3 border-t border-white/10">

                          <div className="flex items-center gap-1 mb-2">

                            <Link size={10} className="text-white/70" />

                            <h4 className="text-xs uppercase tracking-wider font-medium text-white/70">

                              Connected Nodes

                            </h4>

                          </div>

                          <div className="flex flex-wrap gap-1">

                            {item.relatedIds.map((relatedId) => {

                              const relatedItem = timelineData.find(

                                (i) => i.id === relatedId

                              );

                              return (

                                <Button

                                  key={relatedId}

                                  variant="outline"

                                  size="sm"

                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-white/20 bg-transparent hover:bg-white/10 text-white/80 hover:text-white transition-all"

                                  onClick={(e) => {

                                    e.stopPropagation();

                                    toggleItem(relatedId);

                                  }}

                                >

                                  {relatedItem?.title}

                                  <ArrowRight

                                    size={8}

                                    className="ml-1 text-white/60"

                                  />

                                </Button>

                              );

                            })}

                          </div>

                        </div>

                      )}

                    </CardContent>

                  </Card>

                )}

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}
