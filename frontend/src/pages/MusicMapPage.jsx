import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Search, Play, Pause, Zap, Music2, Sparkles, RefreshCw } from 'lucide-react';
import { mockSongs } from '../data/mockSongs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

function AlbumNode({ data, selected }) {
  const isCenter = data.isCenter;
  const size = isCenter ? 96 : 74;

  return (
    <div
      className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
        isCenter ? 'scale-105 z-20' : 'hover:scale-110 z-10'
      }`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        style={{ width: size, height: size }}
        className={`relative rounded-full overflow-hidden transition-all duration-300 shadow-2xl ${
          isCenter
            ? 'ring-4 ring-amber-400 ring-offset-4 ring-offset-obsidian shadow-amber-500/40 shadow-2xl'
            : selected
            ? 'ring-3 ring-amber-400/80 ring-offset-2 ring-offset-obsidian'
            : 'ring-2 ring-white/20 hover:ring-amber-400/60'
        }`}
      >
        <img
          src={data.coverUrl}
          alt={data.label}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

        {isCenter && (
          <div className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-obsidian animate-ping" />
        )}
      </div>

      {/* Node Title Pill */}
      <div className="mt-2 text-center max-w-[110px] pointer-events-none">
        <p
          className={`text-[11px] font-medium leading-tight truncate px-2 py-0.5 rounded-full backdrop-blur-md border ${
            isCenter
              ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg'
              : 'bg-charcoal/90 text-white border-white/10 group-hover:border-amber-400/40'
          }`}
        >
          {data.label}
        </p>
        <p className="text-[9px] text-gray-400 truncate mt-0.5">{data.artist}</p>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

const WHY_CONNECTS_NOTES = [
  'Shares matching harmonic minor root with complementary tempo curves.',
  'Parallel emotional timbre with organic acoustic instrumentation and soft vocals.',
  'Overlapping rhythm vectors that effortlessly transition energy without jarring the mood.',
  'Same cinematic production depth, featuring lush string arrangements and spatial reverbs.',
  'Shared melancholic introspection and signature melodic cadence.',
];

function generateGraphData(centerSong, allSongs) {
  const nodes = [];
  const edges = [];

  const centerX = 400;
  const centerY = 280;

  nodes.push({
    id: centerSong.id,
    type: 'albumNode',
    position: { x: centerX - 48, y: centerY - 48 },
    data: {
      label: centerSong.title,
      artist: centerSong.artist,
      coverUrl: centerSong.coverUrl,
      isCenter: true,
      song: centerSong,
    },
  });

  const relatedSongs = (centerSong.relatedIds || [])
    .map((id) => allSongs.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 6);

  const pool = allSongs.filter(
    (s) =>
      s.id !== centerSong.id &&
      !relatedSongs.some((r) => r.id === s.id) &&
      (s.language === centerSong.language || s.genre === centerSong.genre)
  );

  const finalNeighbors = [...relatedSongs, ...pool].slice(0, 6);
  const count = finalNeighbors.length;
  const radius = 220;

  finalNeighbors.forEach((song, i) => {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle) - 37;
    const y = centerY + radius * Math.sin(angle) - 37;

    nodes.push({
      id: song.id,
      type: 'albumNode',
      position: { x, y },
      data: {
        label: song.title,
        artist: song.artist,
        coverUrl: song.coverUrl,
        isCenter: false,
        song: song,
      },
    });

    edges.push({
      id: `e-${centerSong.id}-${song.id}`,
      source: centerSong.id,
      target: song.id,
      style: {
        stroke: '#F5A623',
        strokeWidth: 1.5,
        strokeOpacity: 0.35,
        strokeDasharray: '4 4',
      },
      animated: true,
    });
  });

  return { nodes, edges };
}

export function MusicMapPage() {
  const [centerSong, setCenterSong] = useState(mockSongs[0]);
  const [search, setSearch] = useState('');
  const { playSong, currentSong, isPlaying } = usePlayer();

  const nodeTypes = useMemo(() => ({ albumNode: AlbumNode }), []);

  const initialGraph = useMemo(() => generateGraphData(mockSongs[0], mockSongs), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateGraphData(centerSong, mockSongs);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [centerSong, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_, node) => {
      const clickedSong = mockSongs.find((s) => s.id === node.id);
      if (clickedSong && clickedSong.id !== centerSong.id) {
        setCenterSong(clickedSong);
      }
    },
    [centerSong]
  );

  const searchResults = search.trim()
    ? mockSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.artist.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const whyConnectsText = useMemo(() => {
    const charCode = centerSong.title.charCodeAt(0) || 0;
    return WHY_CONNECTS_NOTES[charCode % WHY_CONNECTS_NOTES.length];
  }, [centerSong]);

  return (
    <div className="pb-36 md:pb-32 px-3.5 md:px-6 max-w-7xl mx-auto flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-serif text-[26px] leading-[1.15] md:text-3xl lg:text-4xl font-bold text-white">
              Music Map
            </h1>
            <Badge variant="ai">AI</Badge>
          </div>
          <p className="text-gray-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Music Map AI links every track to the songs that share its soul. Drag to explore; click
            any album node to center it and expand new connections.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a song or artist..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 card overflow-hidden shadow-2xl z-30 max-h-56 overflow-y-auto">
              {searchResults.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCenterSong(s);
                    setSearch('');
                  }}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-white/10 text-left transition-colors"
                >
                  <img
                    src={s.coverUrl}
                    alt=""
                    className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{s.title}</p>
                    <p className="text-[11px] text-gray-400 truncate">{s.artist}</p>
                  </div>
                  <Badge variant="language">{s.language}</Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout: Stack canvas FIRST on mobile (h-[52vh]), sidebar card below */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 flex-1 items-stretch">
        {/* React Flow Canvas: Top at h-[52vh] on mobile, right column on desktop */}
        <div className="order-1 lg:order-2 lg:col-span-8 card relative overflow-hidden border-white/10 h-[52vh] lg:h-auto min-h-[340px] lg:min-h-[500px]">
          <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 flex items-center gap-1.5 md:gap-2 bg-charcoal/85 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-white/10 text-[11px] md:text-xs text-gray-300 shadow-md">
            <Music2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Constellation • Tap node to center</span>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            style={{ background: '#09090B' }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="rgba(245, 166, 35, 0.08)" gap={28} size={1} />
            <Controls
              style={{
                background: '#131316',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fill: '#FFFFFF',
              }}
            />
          </ReactFlow>
        </div>

        {/* Active Center Track Detail: Bottom sheet/card on mobile, left sidebar on desktop */}
        <div className="order-2 lg:order-1 lg:col-span-4 card p-4 md:p-6 flex flex-col justify-between border-white/10">
          <div>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <span className="text-[11px] md:text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Active Galactic Center
              </span>
              <button
                onClick={() => {
                  const random = mockSongs[Math.floor(Math.random() * mockSongs.length)];
                  setCenterSong(random);
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Randomize center"
              >
                <RefreshCw className="w-3 h-3" />
                Shuffle
              </button>
            </div>

            {/* Compact horizontal preview on mobile, large square on desktop */}
            <div className="flex items-center gap-3.5 md:block mb-3 md:mb-5">
              <div className="relative w-16 h-16 md:w-full md:aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 ring-1 ring-white/10">
                <img
                  src={centerSong.coverUrl}
                  alt={centerSong.title}
                  className="w-full h-full object-cover"
                />
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="hidden md:block absolute bottom-4 left-4 right-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold uppercase tracking-wider">
                    {centerSong.language}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-1 leading-tight">
                    {centerSong.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-0.5">{centerSong.artist}</p>
                </div>
              </div>

              {/* Mobile text alongside the 16x16 thumbnail */}
              <div className="min-w-0 flex-1 md:hidden">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge variant="language">{centerSong.language}</Badge>
                  <span className="text-[11px] text-gray-400">{centerSong.genre}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white truncate leading-tight">
                  {centerSong.title}
                </h3>
                <p className="text-xs text-gray-300 truncate mt-0.5">{centerSong.artist}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
              <span className="text-[11px] md:text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/5">
                {centerSong.genre}
              </span>
              <span className="text-[11px] md:text-xs px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/5">
                {centerSong.energy} Energy
              </span>
              {centerSong.moods?.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="text-[11px] md:text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Why It Connects Note */}
            <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] md:text-xs font-semibold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>Why It Connects</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "{whyConnectsText}"
              </p>
            </div>
          </div>

          <div className="pt-4 md:pt-6 mt-4 md:mt-6 border-t border-white/5">
            <Button
              onClick={() => playSong(centerSong, mockSongs)}
              size="lg"
              className="w-full shadow-lg shadow-amber-500/20 py-2.5 md:py-3 text-sm md:text-base"
            >
              {isPlaying && currentSong?.id === centerSong.id ? (
                <>
                  <Pause className="w-4 h-4 fill-black" /> Pause Track
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" /> Play Track
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicMapPage;
