import { Link, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { projects, showreel, archvizProjects } from '@/hooks/usePortfolioData';
import { Box, Play, Film, MapPin, Maximize, ArrowRight, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState, useRef } from 'react';
import { 
  Building2,
  Eye,
  Clock,
  Layers,
  Palette,
  Triangle,
  Grid3X3,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const hashLink = (path: string) => `#${path}`;


const defaultShowreel = [
  {
    id: '1',
    title: 'Character Animation Reel 2024',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60',
    duration: '2:45',
    description: 'A compilation of character animations and rigging work',
  },
  {
    id: '2',
    title: 'Environment Showcase',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    duration: '3:12',
    description: 'Cinematic environment breakdowns and lighting studies',
  },
  {
    id: '3',
    title: 'Prop Modeling Breakdown',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    duration: '4:30',
    description: 'Step-by-step breakdown of prop creation workflow',
  },
];

const showreelVideos = (showreel && showreel.length > 0)
  ? (showreel as any[]).map((s) => ({
      id: s.id || s.title || Math.random().toString(36).slice(2, 9),
      title: s.title || 'Showreel',
      thumbnail: s.poster || '',
      duration: s.duration || '',
      description: s.description || '',
      videoUrl: s.videoUrl || '',
    }))
  : defaultShowreel;

export default function Gallery() {
  const location = useLocation();
  const [tab, setTab] = useState(() => {
    // prefer query param `tab`, fall back to hash
    try {
      const params = new URLSearchParams(location.search);
      return params.get('tab') || (location.hash ? location.hash.replace('#', '') : 'projects');
    } catch (e) {
      return location.hash ? location.hash.replace('#', '') : 'projects';
    }
  });

  useEffect(() => {
    // update tab when location changes (search or hash)
    try {
      const params = new URLSearchParams(location.search);
      const t = params.get('tab') || (location.hash ? location.hash.replace('#', '') : 'projects');
      if (t && t !== tab) setTab(t);
    } catch (e) {
      const h = location.hash ? location.hash.replace('#', '') : '';
      if (h && h !== tab) setTab(h);
    }
  }, [location.search, location.hash]);

  // keep URL in sync when tab changes (use hash-router friendly query param)
  useEffect(() => {
    if (!tab) return;
    try {
      const base = window.location.pathname || '/';
      const newHash = `#/gallery?tab=${encodeURIComponent(tab)}`;
      window.history.replaceState(null, '', newHash);
    } catch (e) {
      window.location.hash = `gallery?tab=${tab}`;
    }
  }, [tab]);
  // `projects` is imported directly from demo data (read-only)
  const [viewer, setViewer] = useState<{ url: string; title?: string } | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setViewer(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Viewer transform state
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPan = useRef<{ x: number; y: number } | null>(null);
  const lastTouchDist = useRef<number | null>(null);

  useEffect(() => {
    // reset transforms when opening a new viewer
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    lastPan.current = null;
    lastTouchDist.current = null;
  }, [viewer]);

  function clamp(v: number, a = 0.5, b = 4) {
    return Math.max(a, Math.min(b, v));
  }

  const onWheel = (e: any) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 1 / 1.1;
    setScale((s) => clamp(s * factor));
  };

  const onDoubleClick = () => {
    setScale((s) => (s > 1 ? 1 : 2));
    setTranslate({ x: 0, y: 0 });
  };

  const onMouseDown = (e: any) => {
    e.preventDefault();
    setIsPanning(true);
    lastPan.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: any) => {
    if (!isPanning || !lastPan.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    lastPan.current = { x: e.clientX, y: e.clientY };
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  };

  const onMouseUp = () => {
    setIsPanning(false);
    lastPan.current = null;
  };

  const onTouchStart = (e: any) => {
    if (e.touches.length === 2) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      lastPan.current = { x: t.clientX, y: t.clientY };
    }
  };

  const onTouchMove = (e: any) => {
    if (e.touches.length === 2 && lastTouchDist.current) {
      const [a, b] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const factor = dist / lastTouchDist.current;
      setScale((s) => clamp(s * factor));
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && lastPan.current) {
      const t = e.touches[0];
      const dx = t.clientX - lastPan.current.x;
      const dy = t.clientY - lastPan.current.y;
      lastPan.current = { x: t.clientX, y: t.clientY };
      setTranslate((t0) => ({ x: t0.x + dx, y: t0.y + dy }));
    }
  };

  const onTouchEnd = (e: any) => {
    if (e.touches.length < 2) lastTouchDist.current = null;
    if (e.touches.length === 0) lastPan.current = null;
  };

  const zoomIn = () => setScale((s) => clamp(s * 1.25));
  const zoomOut = () => setScale((s) => clamp(s / 1.25));
  const fit = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <Layout>
      <div className="relative overflow-hidden py-20 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        </div>
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 md:left-20 w-20 h-20 border border-primary/20 rounded-2xl rotate-12 animate-float opacity-30" />
        <div className="absolute bottom-32 right-10 md:right-32 w-16 h-16 border border-accent/20 rounded-xl -rotate-12 animate-float opacity-30" style={{ animationDelay: '-2s' }} />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-xl border border-border/50 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Portfolio</span>
          </div>
          </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 text-primary font-mono text-sm mb-4 bg-primary/10 px-4 py-2 rounded-full">
              <Box size={16} /> All Projects
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <TypewriterGallery />
              <span className="block text-primary">Gallery</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of 3D props, Archviz projects, and showreels
            </p>
            {/* Scroll hint */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
              <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
          <Tabs value={tab} onValueChange={(v) => setTab(v)} className="w-full">
          <TabsList className="mb-8 bg-card border border-border">
            <TabsTrigger value="projects" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Box size={16} /> Projects
            </TabsTrigger>
            <TabsTrigger value="archviz" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Box size={16} /> Archviz
            </TabsTrigger>
            <TabsTrigger value="showreel" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Film size={16} /> Showreel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/gallery/${project.id}`}
                  className="group relative rounded-lg overflow-hidden bg-card border border-border/50 hover:border-primary/50 transition-all duration-500"
                >
                  {/* Top HUD bar */}
                  <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-gradient-to-b from-background/95 to-transparent">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="font-mono text-[10px] text-primary uppercase tracking-wider">{project.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-card/50 backdrop-blur-sm rounded px-2 py-0.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="font-mono text-[10px] text-green-400">GAME READY</span>
                    </div>
                  </div>
                  
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    
                    {/* Scan line effect */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
                    </div>
                    
                    {/* Corner brackets */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Bottom info panel - Game UI style */}
                  <div className="p-4 bg-card border-t border-border/50">
                    <h3 className="font-display text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="font-body text-xs text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    
                    {/* Stats grid */}
                    <div className="grid grid-cols-4 gap-2 font-mono text-[10px]">
                      <div className="bg-secondary/50 border border-border/30 rounded px-2 py-2 text-center">
                        <span className="text-muted-foreground block mb-0.5">POLYS</span>
                        <span className="text-primary font-bold text-sm">{(project.specs.polyCount / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="bg-secondary/50 border border-border/30 rounded px-2 py-2 text-center">
                        <span className="text-muted-foreground block mb-0.5">VERTS</span>
                        <span className="text-primary font-bold text-sm">{(project.specs.vertexCount / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="bg-secondary/50 border border-border/30 rounded px-2 py-2 text-center">
                        <span className="text-muted-foreground block mb-0.5">TEX</span>
                        <span className="text-primary font-bold text-sm">{project.specs.textureResolution}</span>
                      </div>
                      <div className="bg-secondary/50 border border-border/30 rounded px-2 py-2 text-center">
                        <span className="text-muted-foreground block mb-0.5">MATS</span>
                        <span className="text-primary font-bold text-sm">{project.specs.materialSlots}</span>
                      </div>
                    </div>
                    
                    {/* Software tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/30">
                      {project.software.slice(0, 3).map((sw) => (
                        <span key={sw} className="text-[9px] font-mono text-muted-foreground bg-background/50 px-2 py-0.5 rounded">
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="archviz" className="animate-fade-in">
            {/* Elegant masonry-style grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archvizProjects.map((project, index) => (
                <Link 
                  key={project.id} 
                  to={`/archviz/${project.id}`} 
                  className={`group relative overflow-hidden rounded-2xl bg-card transition-all duration-700 hover:shadow-2xl hover:shadow-accent/10 animate-fade-in ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`overflow-hidden relative ${index === 0 ? 'aspect-[16/12]' : 'aspect-[4/3]'}`}>
                    <img 
                      src={project.thumbnail} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                    />
                    
                    {/* Elegant gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Subtle border glow on hover */}
                    <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 rounded-2xl transition-all duration-500" />
                  </div>
                  
                  {/* Status Badge - Refined */}
                  <div className="absolute top-5 left-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md transition-all duration-300 ${
                      (project.specs as any).status === 'Completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : (project.specs as any).status === 'In Development'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-accent/10 text-accent border border-accent/20'
                    }`}>
                      {(project.specs as any).status}
                    </span>
                  </div>
                  
                  {/* Year Badge */}
                  <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <span className="px-3 py-1.5 rounded-full text-xs font-mono text-foreground/70 backdrop-blur-md bg-background/30 border border-border/20">
                      {(project.specs as any).year}
                    </span>
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {/* Location with icon */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 mb-3">
                      <MapPin size={12} className="text-accent" />
                      <span className="font-light tracking-wide">{(project.specs as any).location}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className={`font-display font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-500 ${
                      index === 0 ? 'text-3xl' : 'text-xl'
                    }`}>
                      {project.title}
                    </h3>
                    
                    {/* Description - only on larger cards */}
                    {index === 0 && (
                      <p className="font-body text-sm text-muted-foreground line-clamp-2 mb-4 opacity-80">
                        {project.description}
                      </p>
                    )}
                    
                    {/* Specs row */}
                    <div className="flex items-center gap-4 text-xs font-light">
                      <span className="text-foreground/60 flex items-center gap-1.5">
                        <Maximize size={11} className="text-accent/70" />
                        {(project.specs as any).area}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-foreground/60">{(project.specs as any).type}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="text-foreground/60">{(project.specs as any).style}</span>
                    </div>
                    
                    {/* View button - appears on hover */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-2 text-sm text-accent font-medium">
                        View Project
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="showreel" className="animate-fade-in">
            <div className="animate-fade-in">
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 md:p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Film className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-foreground">Showreels & Breakdowns</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">{showreelVideos.length} videos</p>
                  </div>
                </div>
              </div>

              {/* Featured Video */}
              <div className="mb-6 md:mb-10">
                <div className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer">
                  <div className="aspect-video md:aspect-[21/9]">
                    <img 
                      src={showreelVideos[0].thumbnail}
                      alt={showreelVideos[0].title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors duration-500" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
                      <div className="absolute -inset-4 md:-inset-6 rounded-full border border-primary/20 animate-pulse" style={{ animationDuration: '3s' }} />
                      <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                        <Play className="w-7 h-7 md:w-10 md:h-10 text-primary-foreground ml-1 fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <span className="px-3 md:px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                        Featured
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-background/60 backdrop-blur-xl border border-border/30">
                        <Clock className="w-3 h-3" />
                        {showreelVideos[0].duration}
                      </span>
                    </div>
                    <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      {showreelVideos[0].title}
                    </h2>
                    <p className="font-body text-sm md:text-base text-muted-foreground max-w-2xl">
                      {showreelVideos[0].description}
                    </p>
                  </div>
                  
                  {/* Corner decorations */}
                  <div className="absolute top-4 md:top-6 left-4 md:left-6 w-6 md:w-10 h-6 md:h-10 border-t-2 border-l-2 border-primary/40 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-4 md:top-6 right-4 md:right-6 w-6 md:w-10 h-6 md:h-10 border-t-2 border-r-2 border-primary/40 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {showreelVideos.slice(1).map((video, index) => (
                  <div
                    key={video.id}
                    className="group relative rounded-2xl overflow-hidden bg-card/50 backdrop-blur-xl border border-border/30 hover:border-primary/30 transition-all duration-500 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute inset-0 bg-background/30 group-hover:bg-background/10 transition-colors duration-300" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/90 backdrop-blur-xl flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                          <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground ml-0.5 fill-current" />
                        </div>
                      </div>
                      
                      {/* Duration & Category */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium bg-card/80 backdrop-blur-xl border border-border/50">
                          {video.category}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-mono bg-background/80 backdrop-blur-xl">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 md:p-5">
                      <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      <p className="font-body text-xs md:text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Watch Now</span>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10 md:mt-12 text-center">
                <div className="inline-flex flex-col items-center p-6 md:p-8 rounded-2xl md:rounded-3xl bg-card/30 backdrop-blur-xl border border-border/30">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Film className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">More content on my video platforms</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild variant="outline" className="rounded-full gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4" /> YouTube
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="rounded-full gap-2 border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground">
                      <a href="https://vimeo.com" target="_blank" rel="noopener noreferrer">
                        <Play className="w-4 h-4" /> Vimeo
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {viewer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/70"
              onClick={() => setViewer(null)}
            />
            <div
              className="relative max-w-[calc(100vw-40px)] max-h-[calc(100vh-40px)] w-full mx-4 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-2 right-2 z-30 flex gap-2">
                <button
                  aria-label="Zoom out"
                  onClick={zoomOut}
                  className="bg-background/90 text-foreground rounded-full p-2 shadow"
                >
                  −
                </button>
                <button
                  aria-label="Fit"
                  onClick={fit}
                  className="bg-background/90 text-foreground rounded-full p-2 shadow"
                >
                  ⤢
                </button>
                <button
                  aria-label="Zoom in"
                  onClick={zoomIn}
                  className="bg-background/90 text-foreground rounded-full p-2 shadow"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setViewer(null)}
                  aria-label="Close viewer"
                  className="bg-background/90 text-foreground rounded-full p-2 shadow"
                >
                  ×
                </button>
              </div>

              <div
                ref={containerRef}
                onWheel={onWheel}
                onDoubleClick={onDoubleClick}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  ref={imgRef}
                  src={viewer.url}
                  alt={viewer.title}
                  className="max-w-full max-h-[80vh] object-contain rounded shadow-lg touch-none"
                  style={{
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                    transition: isPanning ? 'none' : 'transform 120ms ease-out',
                    cursor: isPanning ? 'grabbing' : 'grab',
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function TypewriterGallery() {
  const words = ['Props', 'Archviz', 'Showreels'];
  return <Typewriter words={words} loop={true} pause={1400} />;
}

function Typewriter({ words, loop = true, pause = 1200, typeSpeed = 80, deleteSpeed = 40 }: { words: string[]; loop?: boolean; pause?: number; typeSpeed?: number; deleteSpeed?: number }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timer: number | undefined;
    const word = words[index % words.length];

    if (typing) {
      if (display.length < word.length) {
        timer = window.setTimeout(() => setDisplay(word.slice(0, display.length + 1)), typeSpeed);
      } else {
        timer = window.setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (display.length > 0) {
        timer = window.setTimeout(() => setDisplay(display.slice(0, display.length - 1)), deleteSpeed);
      } else {
        setTyping(true);
        setIndex((i) => i + 1);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [display, typing, index, words, pause, typeSpeed, deleteSpeed]);

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '');
  return (
    <span className="block text-center mb-2">
      <span className="relative inline-block mx-auto">
        {/* invisible widest word reserves the width and centers itself */}
        <span className="invisible block font-display font-bold leading-tight">{longest}</span>

        {/* overlay the visible typed text centered over the reserved width */}
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display font-bold leading-tight">{display}</span>
          <span className="inline-block w-1 h-7 bg-primary ml-3 animate-blink" />
        </span>
      </span>
      <style>{`.animate-blink{animation:blink 1s steps(2,end) infinite}@keyframes blink{50%{opacity:0}}`}</style>
    </span>
  );
}
