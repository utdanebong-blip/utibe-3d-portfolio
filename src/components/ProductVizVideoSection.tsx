import { ArrowRight, Building2, ExternalLink, MapPin, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Product Viz Section reusing Archviz UI
export default function ProductVizVideoSection({ featuredProductViz }: { featuredProductViz: any[] }) {
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
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted((m) => !m);
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

  const videoSrc = featuredProductViz[0]?.video || featuredProductViz[0]?.videoUrl;
  const vimeoId = getVimeoId(videoSrc);
  const youTubeId = getYouTubeId(videoSrc);
  const isVimeo = Boolean(vimeoId);
  const isYouTube = Boolean(youTubeId);
  const isDirectVideo = typeof videoSrc === 'string' && /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoSrc);
  const baseIframeSrc = isVimeo
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=${isMuted ? 1 : 0}&playsinline=1&background=1&title=0&byline=0&portrait=0`
    : isYouTube
    ? `https://www.youtube.com/embed/${youTubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${youTubeId}&modestbranding=1&playsinline=1`
    : null;

  const [activeIframeSrc, setActiveIframeSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!baseIframeSrc) {
      setActiveIframeSrc(null);
      return;
    }
    setActiveIframeSrc(baseIframeSrc);
  }, [baseIframeSrc]);

  useEffect(() => {
    const cacheKey = videoSrc;
    if (!cacheKey) return;
    const tryCache = async () => {
      try {
        if (!('caches' in window)) return;
        const cache = await caches.open('portfolio-video-cache-v1');
        const matched = await cache.match(cacheKey as RequestInfo);
        if (matched) return;
        const resp = await fetch(cacheKey.toString(), { mode: 'cors' });
        if (resp && resp.ok) {
          await cache.put(cacheKey as RequestInfo, resp.clone()).catch(() => {});
        }
      } catch (e) {
        // ignore
      }
    };
    if (typeof videoSrc === 'string' && /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoSrc)) {
      void tryCache();
    }
  }, [videoSrc]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-amber-500/[0.02] to-background" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-4 md:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm mb-3 md:mb-4">
              <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400" />
              <span className="font-mono text-[10px] md:text-xs text-amber-400 tracking-widest uppercase">Product Viz</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">
              Product <span className="text-amber-400">Visualization</span>
            </h2>
            <p className="font-body text-muted-foreground max-w-xl">Photorealistic product renders and interactive previews.</p>
          </div>
        </div>

        <div className="relative rounded-[1.5rem] overflow-hidden mb-6 group">
          <div className="aspect-[21/9] relative">
            {/* Poster always visible until mediaReady */}
            <img
              src={featuredProductViz[0]?.thumbnail}
              alt={featuredProductViz[0]?.title || 'Product poster'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${mediaReady ? 'opacity-0' : 'opacity-100'}`}
            />

            {isVimeo && activeIframeSrc ? (
              <iframe
                title={featuredProductViz[0]?.title || 'Product Viz'}
                src={activeIframeSrc}
                className="absolute left-[-15%] top-[-15%] w-[130%] h-[130%]"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                onLoad={(e) => {
                  try {(e.currentTarget as HTMLIFrameElement).dataset.loaded = '1';} catch (err) {}
                  setMediaReady(true);
                }}
              />
            ) : isDirectVideo && videoSrc ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted={isMuted}
                autoPlay
                loop
                playsInline
                preload="auto"
                poster={featuredProductViz[0]?.thumbnail}
                onCanPlayThrough={() => setMediaReady(true)}
                onPlaying={() => setMediaReady(true)}
              >
                <source src={videoSrc} />
              </video>
            ) : isYouTube && activeIframeSrc ? (
              <iframe
                title={featuredProductViz[0]?.title || 'Product Viz'}
                src={activeIframeSrc}
                className="absolute left-[-15%] top-[-15%] w-[130%] h-[130%]"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                onLoad={(e) => {
                  try {(e.currentTarget as HTMLIFrameElement).dataset.loaded = '1';} catch (err) {}
                  setMediaReady(true);
                }}
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className={`absolute top-3 left-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-xs text-amber-400">LIVE PREVIEW</span>
            </div>

            <button
              onClick={toggleMute}
              className="absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 flex items-center justify-center hover:bg-card hover:border-amber-400/50 transition-all duration-300"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} className="text-muted-foreground" /> : <Volume2 size={18} className="text-amber-400" />}
            </button>

            {featuredProductViz[0] && (
              <div className="absolute bottom-0 left-0 p-4 md:p-10 max-w-full md:max-w-2xl">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">Nordic Hiking stick</h3>
                <p className="font-body text-sm md:text-lg text-muted-foreground hidden md:block">Conquer any terrain with confidence using this Nordic hiking stick, crafted for stability, endurance, and comfort. Lightweight yet durable, it features an ergonomic handle for a natural grip, adjustable height for personalized support, and a shock-absorbing tip for smooth movement across rugged paths.</p>
              </div>
            )}

            <Link to="/gallery?tab=productviz" className="hidden md:block absolute bottom-6 right-6">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 flex items-center justify-center hover:scale-105 transition-all duration-200">
                <ExternalLink size={20} className="text-amber-400" />
              </div>
            </Link>
          </div>
        </div>

        <div className="md:hidden text-center mt-3">
          <Link to="/gallery?tab=productviz">
            <Button size="sm" className="px-4 py-2 rounded-xl">View Product</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
