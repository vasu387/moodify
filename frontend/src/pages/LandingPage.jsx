import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Sparkles, Map, Smile, Shuffle, Music, Users, ArrowRight, Play } from 'lucide-react';
import { mockSongs } from '../data/mockSongs';
import { usePlayer } from '../context/PlayerContext';
import { Button } from '../components/ui/Button';

const features = [
  { icon: Map, title: 'Music Map', desc: 'Explore songs as a visual constellation — click any node to discover connections.', to: '/music-map', badge: 'AI' },
  { icon: Smile, title: 'Mood Match', desc: 'Tell us how you feel. We\'ll find exactly the right song for this exact moment.', to: '/mood-match', badge: 'AI' },
  { icon: Shuffle, title: 'Pick For Me', desc: 'Answer a few questions and let the algorithm curate your perfect sound.', to: '/pick-for-me', badge: 'AI' },
  { icon: Music, title: 'Music Blend', desc: 'Pick two songs and discover the sonic bridge that lives between them.', to: '/blend', badge: 'AI' },
  { icon: Users, title: 'Music Together', desc: 'Share a room code, listen in sync, and react together in real time.', to: '/together', badge: 'Beta' },
];

export function LandingPage() {
  const { playSong } = usePlayer();
  const featured = mockSongs.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-glow-purple pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Your emotions. Your music. Your universe.</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            Music that feels<br />
            <span className="text-amber-400 italic">exactly right</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Moodify matches your emotional state to the perfect song. No algorithms. No playlists. 
            Just music that actually gets how you feel right now.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/mood-match">
              <Button size="xl" className="glow-amber">
                <Smile className="w-5 h-5" />
                Match My Mood
              </Button>
            </Link>
            <Link to="/discover">
              <Button size="xl" variant="secondary">
                Explore All Music
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured songs preview */}
        <div className="relative z-10 mt-20 flex gap-4 flex-wrap justify-center">
          {featured.map(song => (
            <button key={song.id}
              className="group flex items-center gap-3 p-3 rounded-xl bg-charcoal/80 border border-white/10 hover:border-amber-500/30 backdrop-blur-sm transition-all"
              onClick={() => playSong(song, mockSongs)}>
              <img src={song.coverUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">{song.title}</p>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
              <Play className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Discover music differently
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Five unique ways to find the music that speaks to this exact version of you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <Link key={f.to} to={f.to} className="group card p-6 hover:border-amber-500/20 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <f.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${f.badge === 'Beta' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: '30+', label: 'Curated songs' },
            { num: '33', label: 'Mood states' },
            { num: '4', label: 'Languages' },
          ].map(s => (
            <div key={s.label}>
              <p className="font-serif text-4xl font-bold text-amber-400">{s.num}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
