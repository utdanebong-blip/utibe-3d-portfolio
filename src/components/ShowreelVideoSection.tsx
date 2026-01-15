import { ArrowRight, Building2, ExternalLink, MapPin, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Showreel Section reusing Archviz UI
export default function ShowreelVideoSection({ featuredShowreel }: { featuredShowreel: any[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaReady, setMediaReady] = useState(false);
  // Start playback on mount (do not pause on scroll)
  useEffect(() => {
    if (videoRef.current) {
      void videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const toggleMute = () => {
    setIsMuted((m) => !m);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      try { void videoRef.current.play(); } catch (e) {}
    }
  };

  const getVimeoId = (url?: string) => {
    if (!url) return null;
    const m = url.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/i);
    return m ? m[1] : null;
  };

  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
    return m ? m[1] : null;
  };

  const videoSrc = featuredShowreel[0]?.video || featuredShowreel[0]?.videoUrl;
  const vimeoId = getVimeoId(videoSrc);
  const youTubeId = getYouTubeId(videoSrc);
  const isVimeo = Boolean(vimeoId);
  const isYouTube = Boolean(youTubeId);
  const baseIframeSrc = isVimeo
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=${isMuted ? 1 : 0}&playsinline=1&background=1&title=0&byline=0&portrait=0`
    : isYouTube
    ? `https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youTubeId}&modestbranding=1&playsinline=1`
    : null;

  const [activeIframeSrc, setActiveIframeSrc] = useState<string | null>(null);

  // Always attach iframe src when available so embeds play regardless of scroll
  useEffect(() => {
    if (!baseIframeSrc) {
      setActiveIframeSrc(null);
      return;
    }
    setActiveIframeSrc(baseIframeSrc);
  }, [baseIframeSrc]);

  // When a direct video URL becomes visible, start background fetch to cache the full video
  useEffect(() => {
    const cacheKey = videoSrc;
    if (!cacheKey) return;
    const tryCache = async () => {
      try {
        if (!('caches' in window)) return;
        const cache = await caches.open('portfolio-video-cache-v1');
        const matched = await cache.match(cacheKey as RequestInfo);
        if (matched) return;
        // fetch and cache the full response
        const resp = await fetch(cacheKey.toString(), { mode: 'cors' });
        if (resp && resp.ok) {
          await cache.put(cacheKey as RequestInfo, resp.clone()).catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    };
    // only for direct video files (not vimeo/youtube)
    if (typeof videoSrc === 'string' && /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoSrc)) {
      void tryCache();
    }
  }, [videoSrc]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

        <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-accent/20 bg-accent/5 backdrop-blur-sm mb-6">
            <Play className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs text-accent tracking-widest uppercase">Showreels</span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
            Showreels & <span className="text-accent text-glow-purple">Highlight</span>
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Transforming architectural concepts into breathtaking photorealistic experiences
          </p>
        </div>

        <div className="relative rounded-[1.5rem] overflow-hidden mb-6 group">
          <div className="aspect-[4/3] md:aspect-[21/9] relative">
            {/* Poster always visible until mediaReady */}
            <img
              src={featuredShowreel[0]?.thumbnail || featuredShowreel[0]?.poster}
              alt={featuredShowreel[0]?.title || 'Showreel poster'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${mediaReady ? 'opacity-0' : 'opacity-100'}`}
            />

            {isVimeo && activeIframeSrc ? (
              <iframe
                title={featuredShowreel[0]?.title || 'Showreel'}
                src={activeIframeSrc}
                className="absolute left-[-15%] top-[-15%] w-[130%] h-[130%]"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                onLoad={(e) => {
                  try {
                    (e.currentTarget as HTMLIFrameElement).dataset.loaded = '1';
                  } catch (err) {}
                  setMediaReady(true);
                }}
              />
            ) : videoSrc ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted={isMuted}
                autoPlay
                loop
                playsInline
                preload="auto"
                poster={featuredShowreel[0]?.thumbnail || featuredShowreel[0]?.poster}
                onCanPlayThrough={() => setMediaReady(true)}
                onPlaying={() => setMediaReady(true)}
              >
                <source src={videoSrc} />
              </video>
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className={`absolute top-3 left-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-xs text-primary">LIVE</span>
            </div>

            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 flex items-center justify-center hover:bg-card hover:border-primary/50 transition-all duration-300"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} className="text-muted-foreground" /> : <Volume2 size={18} className="text-primary" />}
            </button>

            {featuredShowreel[0] && (
              <div className="absolute bottom-0 left-0 p-4 md:p-10 max-w-full md:max-w-2xl">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">The Creek</h3>
                <p className="font-body text-sm md:text-lg text-muted-foreground hidden md:block">{featuredShowreel[0].description}</p>
              </div>
            )}

            <Link to="/gallery?tab=showreel" className="hidden md:block absolute bottom-6 right-6">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center hover:scale-105 transition-all duration-200">
                <ExternalLink size={20} className="text-primary" />
              </div>
            </Link>
          </div>
        </div>

        <div className="md:hidden text-center mt-3">
          <Link to="/gallery?tab=showreel">
            <Button size="sm" className="px-4 py-2 rounded-xl">View Showreels</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
