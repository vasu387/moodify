import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Copy,
  Check,
  Zap,
  MessageCircle,
  Play,
  Pause,
  Sparkles,
  Radio,
  Share2,
  Volume2,
  ArrowRight,
  LogOut,
  Send,
} from 'lucide-react';
import { createRoom, MockSocket } from '../services/socket';
import { mockSongs } from '../data/mockSongs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { usePlayer } from '../context/PlayerContext';

const EMOJIS = ['🔥', '❤️', '😭', '🎧', '✨'];

const INITIAL_MESSAGES = [
  {
    id: 1,
    user: 'Karthik',
    text: 'That bridge in Kanave Kanave always gives chills 🌌',
    time: '11:42 PM',
  },
  {
    id: 2,
    user: 'Ananya',
    text: 'Listening from Toronto! Sync is flawless ❤️',
    time: '11:43 PM',
  },
];

export function MusicTogetherPage() {
  const [roomCode, setRoomCode] = useState('');
  const [joinInput, setJoinInput] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [floatingReactions, setFloatingReactions] = useState([]);
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedInitialTrack, setSelectedInitialTrack] = useState(mockSongs[0]);

  // Sockets & Audio Context
  const [socket, setSocket] = useState(null);
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  const chatBottomRef = useRef(null);

  // Countdown handler before entering room
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setInRoom(true);
      setCountdown(null);
      if (selectedInitialTrack) {
        playSong(selectedInitialTrack);
      }
    }
  }, [countdown, selectedInitialTrack, playSong]);

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  // Auto scroll chat
  useEffect(() => {
    if (inRoom) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, inRoom]);

  const handleStartRoom = () => {
    const code = createRoom();
    setRoomCode(code);
    initSocketConnection(code);
    setCountdown(3);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!joinInput.trim()) return;
    const cleanCode = joinInput.trim().toUpperCase();
    setRoomCode(cleanCode);
    initSocketConnection(cleanCode);
    setInRoom(true);
  };

  const initSocketConnection = (code) => {
    /**
     * PHASE 2 INTEGRATION POINT:
     * In Phase 2 with FastAPI:
     * const ws = new WebSocket(`ws://localhost:8000/ws/room/${code}`);
     * For now, MockSocket simulates bi-directional events locally.
     */
    const sock = new MockSocket(code);
    sock.connect();

    sock.on('chat', (msg) => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: msg.fromSelf ? 'You' : 'Companion',
          text: msg.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    });

    sock.on('reaction', (data) => {
      addReaction(data.emoji);
    });

    setSocket(sock);
  };

  const copyInvite = () => {
    const inviteUrl = `${window.location.origin}/together?room=${roomCode}`;
    navigator.clipboard.writeText(inviteUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const addReaction = (emoji) => {
    const id = Date.now() + Math.random();
    const xPos = Math.floor(Math.random() * 70) + 15; // 15% to 85%
    setFloatingReactions((prev) => [...prev, { id, emoji, xPos }]);

    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);

    if (socket) {
      socket.send('reaction', { emoji });
    }
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    const text = inputMessage.trim();
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: 'You',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputMessage('');

    if (socket) {
      socket.send('chat', { text });
    }
  };

  // 3-2-1 Countdown Overlay
  if (countdown !== null && countdown > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian text-center px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full" />
          <div className="relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Calibrating Room Audio Clock
            </span>
            <div className="font-serif text-8xl md:text-9xl font-extrabold text-white animate-pulse">
              {countdown}
            </div>
            <p className="font-serif italic text-xl text-gray-400">
              Synchronizing with {selectedInitialTrack?.title || 'Moodify Radio'}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Listening Room View
  if (inRoom) {
    const activeTrack = currentSong || selectedInitialTrack || mockSongs[0];
    const upNext = mockSongs.filter((s) => s.id !== activeTrack.id).slice(0, 4);

    return (
      <div className="pb-36 md:pb-36 px-3.5 md:px-6 max-w-6xl mx-auto relative overflow-hidden">
        {/* Floating Reactions Container */}
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {floatingReactions.map((r) => (
            <div
              key={r.id}
              style={{ left: `${r.xPos}%` }}
              className="absolute bottom-28 text-3xl animate-bounce transition-all duration-1000 transform -translate-y-48 opacity-90"
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Room Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Badge variant="beta">LIVE SYNCED ROOM</Badge>
              <span className="text-xs text-gray-400">Phase 2 WebSocket Architecture</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white">
              Room <span className="text-amber-400 font-mono tracking-wider">{roomCode}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={copyInvite}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Invite Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Share Invite Code</span>
                </>
              )}
            </button>

            <button
              onClick={() => setInRoom(false)}
              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Synced Player & Live Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Synced Player & Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Now Playing Banner */}
            <div className="card p-6 border-amber-500/20 relative overflow-hidden bg-gradient-to-b from-charcoal to-obsidian">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl ring-2 ring-amber-500/30">
                  <img
                    src={activeTrack.coverUrl}
                    alt={activeTrack.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] text-amber-400 font-semibold uppercase">
                    Synced
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="language">{activeTrack.language}</Badge>
                    <span className="text-xs text-gray-400">{activeTrack.genre}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-white truncate">
                    {activeTrack.title}
                  </h2>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{activeTrack.artist}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{activeTrack.album}</p>

                  <div className="flex items-center gap-3 mt-4">
                    <Button
                      onClick={() => playSong(activeTrack)}
                      variant="primary"
                      size="sm"
                      className="px-4"
                    >
                      {isPlaying && currentSong?.id === activeTrack.id ? (
                        <>
                          <Pause className="w-4 h-4 fill-black" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-black" /> Play in Room
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-gray-500">
                      ⚡ Playback timestamp locks across all clients
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-time Emoji Reactions Bar */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block mb-2.5">
                  Send Instant Reaction (All listeners will see this)
                </span>
                <div className="flex items-center gap-3">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addReaction(emoji)}
                      className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 active:scale-90 border border-white/5 flex items-center justify-center text-xl transition-all"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shared Queue List */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-base font-bold text-white">Shared Listening Queue</h3>
                <span className="text-xs text-gray-400">{upNext.length + 1} tracks scheduled</span>
              </div>
              <div className="space-y-2">
                {upNext.map((song, i) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs text-gray-500 font-mono w-4">{i + 2}</span>
                      <img
                        src={song.coverUrl}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">{song.title}</p>
                        <p className="text-[11px] text-gray-400 truncate">{song.artist}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => playSong(song)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20"
                    >
                      Play Next
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Chat Demo */}
          <div className="lg:col-span-5 card flex flex-col h-[520px] border-white/10">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-base font-bold text-white">Live Room Chat</h3>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 3 Online
              </span>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
              <div className="text-center my-2">
                <span className="text-[10px] text-gray-500 bg-white/5 px-3 py-1 rounded-full uppercase tracking-wider">
                  Room created • Connected via WebSocket
                </span>
              </div>

              {chatMessages.map((msg) => {
                const isMe = msg.user === 'You';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[11px] font-semibold text-gray-300">{msg.user}</span>
                      <span className="text-[10px] text-gray-500">{msg.time}</span>
                    </div>
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        isMe
                          ? 'bg-amber-500 text-black font-medium rounded-tr-none'
                          : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={sendChatMessage} className="p-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message room..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Lobby Preview & Entry
  return (
    <div className="pb-36 md:pb-36 px-3.5 md:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Badge variant="beta">Phase 2 Preview</Badge>
          <span className="text-[11px] md:text-xs uppercase tracking-wider text-gray-400 font-semibold">
            Social Synced Audio
          </span>
        </div>
        <h1 className="font-serif text-[26px] leading-[1.15] md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-3">
          Listen together, <span className="text-amber-400 italic">miles apart</span>
        </h1>
        <p className="text-gray-400 text-xs md:text-base max-w-2xl leading-relaxed">
          Synced playback, shared queue, live reactions. Share a single 6-digit party code to
          listen in unison with friends anywhere in the world. No sign-up required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Start or Join Room */}
        <div className="card p-6 md:p-8 space-y-6 border-white/10">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              Create a Listening Room
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Spin up an instant room. You can invite anyone with a simple link or a 6-character
              party code.
            </p>

            {/* Optional starting track */}
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Starting Track
              </label>
              <select
                value={selectedInitialTrack?.id}
                onChange={(e) => {
                  const s = mockSongs.find((item) => item.id === e.target.value);
                  setSelectedInitialTrack(s);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                {mockSongs.slice(0, 10).map((s) => (
                  <option key={s.id} value={s.id} className="bg-charcoal text-white">
                    {s.title} — {s.artist} ({s.language})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleStartRoom}
              size="lg"
              className="w-full text-base font-semibold shadow-lg shadow-amber-500/10"
            >
              <Zap className="w-5 h-5 mr-1" />
              Start a listening room
            </Button>
            <p className="text-[11px] text-gray-500 text-center mt-2">
              Free • No sign-up • Zero latency lock
            </p>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white mb-1">Got a link or party code?</h4>
            <p className="text-xs text-gray-400 mb-3">
              Paste the 6-character room code to sync directly.
            </p>

            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                placeholder="e.g., MD88K2"
                maxLength={6}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm uppercase tracking-widest font-mono text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50"
              />
              <Button type="submit" variant="secondary" size="md">
                Join
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side: Animated Preview Card & Floating Emojis */}
        <div className="space-y-4">
          <div className="card p-6 md:p-8 border-amber-500/20 bg-gradient-to-br from-charcoal via-amber-950/10 to-charcoal relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 animate-pulse" />
                  Synced Playback Demo
                </span>
                <span className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                  3 • 2 • 1 • Play!
                </span>
              </div>

              <div className="flex items-center gap-4 bg-black/40 p-3.5 rounded-2xl border border-white/5 mb-6">
                <img
                  src={mockSongs[1].coverUrl}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-amber-500/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-white font-bold text-base truncate">
                    {mockSongs[1].title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{mockSongs[1].artist}</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-full w-2/3 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Floating Interactive Emoji preview */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  Tap to test live room reactions:
                </span>
                <div className="flex items-center gap-3">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      onClick={() => addReaction(e)}
                      className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-90"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-gray-400 leading-relaxed">
                <p className="font-mono text-amber-400/90 mb-1">
                  // FastAPI WebSocket Backend Ready (Phase 2):
                </p>
                <p>
                  Built with modular room adapters. In Phase 2, this connects to{' '}
                  <code className="text-white">ws://localhost:8000/ws/room/:code</code> for zero-lag
                  inter-city audio clock synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicTogetherPage;

