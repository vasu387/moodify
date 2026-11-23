/**
 * Music Together – WebSocket Service
 * 
 * PHASE 2: Connect to FastAPI WebSocket server
 * 
 * Example FastAPI WebSocket endpoint:
 * @app.websocket("/ws/room/{room_code}")
 * async def room_ws(ws: WebSocket, room_code: str):
 *     await manager.connect(ws, room_code)
 *     ...
 * 
 * To activate in Phase 2:
 * 1. Set WS_BASE to your FastAPI server URL (e.g., 'ws://localhost:8000')
 * 2. Replace MockSocket with RealSocket in the exports below
 */

const WS_BASE = 'ws://localhost:8000';

// --- Mock Socket for Phase 1 Frontend Demo ---
export class MockSocket {
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.listeners = {};
    this.connected = false;
  }

  connect() {
    this.connected = true;
    console.log(`[MockSocket] Connected to room: ${this.roomCode}`);
    // Simulate receiving a welcome message
    setTimeout(() => this.emit('system', { type: 'joined', message: `Welcome to room ${this.roomCode}!` }), 500);
    return this;
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return this;
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  send(type, payload) {
    console.log(`[MockSocket] Sending ${type}:`, payload);
    // Echo back for demo
    if (type === 'chat') {
      setTimeout(() => this.emit('chat', { ...payload, fromSelf: true }), 100);
    }
    if (type === 'reaction') {
      setTimeout(() => this.emit('reaction', payload), 100);
    }
  }

  disconnect() {
    this.connected = false;
    console.log(`[MockSocket] Disconnected from room: ${this.roomCode}`);
  }
}

// --- Phase 2: Real WebSocket (uncomment when backend is ready) ---
// export class RealSocket {
//   constructor(roomCode) {
//     this.ws = new WebSocket(`${WS_BASE}/ws/room/${roomCode}`);
//     this.roomCode = roomCode;
//   }
//   on(event, callback) { /* map ws.onmessage to events */ }
//   send(type, payload) { this.ws.send(JSON.stringify({ type, ...payload })); }
//   disconnect() { this.ws.close(); }
// }

export const createRoom = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
