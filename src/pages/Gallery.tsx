import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { projects as projectsData, archvizProjects as archvizProjectsData, showreel as demoShowreel } from '@/hooks/usePortfolioData';
import { 
  Box, 
  Play, 
  Film, 
  MapPin, 
  Maximize, 
  ArrowRight, 
  Building2,
  Sparkles,
  Eye,
  Clock,
  Layers,
  Palette,
  Triangle,
  Grid3X3,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const showreelVideos = demoShowreel;

type TabType = 'props' | 'archviz' | 'showreel';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<TabType>('props');
  const projects = projectsData;
  const archvizProjects = archvizProjectsData;

  // If a `tab` query param is present (e.g. ?tab=archviz), open that tab.
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab') as TabType | null;
    if (tab === 'props' || tab === 'archviz' || tab === 'showreel') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const tabs = [
    { id: 'props' as TabType, label: 'Props', icon: Box, count: projects.length },
    { id: 'archviz' as TabType, label: 'Archviz', icon: Building2, count: archvizProjects.length },
    { id: 'showreel' as TabType, label: 'Showreel', icon: Film, count: showreelVideos.length }
  ];

  // removed typing animation to avoid stray text rendering

  // Featured showreel helpers
  const featured = showreelVideos[0] ?? null;
  const featuredPoster = featured?.poster ?? featured?.thumbnail ?? '';

  return (
    <Layout>
      {/* Hero Section - Futuristic */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
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
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Project</span>
            <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent"> Gallery</span>
            {/* typing title removed */}
          </h1>
          
          <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Explore my collection of 3D props, architectural visualizations, and showreels
          </p>

          {/* Futuristic Tab Switcher */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 animate-fade-in px-2" style={{ animationDelay: '0.3s' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  navigate(`?tab=${tab.id}`, { replace: false });
                }}
                className={`group relative flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 rounded-2xl font-medium text-sm md:text-base transition-all duration-500 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                    : 'bg-card/50 backdrop-blur-xl border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-display">{tab.label}</span>
                <span className={`hidden md:flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-mono ${
                  activeTab === tab.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
                
                {/* Active indicator */}
                {activeTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-foreground/50 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 relative">
        <div className="container mx-auto px-4">
          
          {/* Props Tab */}
          {activeTab === 'props' && (
            <div className="animate-fade-in">
              {/* Section Stats */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 md:p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Box className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-foreground">Game-Ready Props</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">{projects.length} assets available</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Props Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {projects.map((project, index) => (
                  <Link
                    key={project.id}
                    to={`/gallery/${project.id}`}
                    state={{ from: `/gallery?tab=${activeTab}` }}
                    className="group relative rounded-2xl md:rounded-3xl overflow-hidden bg-card/50 backdrop-blur-xl border border-border/30 hover:border-primary/50 transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Image Container */}
                    <div className="aspect-square overflow-hidden relative">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                      />
                      
                      {/* Gradient overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Top HUD */}
                      <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex items-center justify-between">
                        <span className="px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-mono bg-card/80 backdrop-blur-xl border border-border/50 text-primary uppercase tracking-wider">
                          {project.category}
                        </span>
                        <div className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-[10px] md:text-xs font-mono text-emerald-400">READY</span>
                        </div>
                      </div>

                      {/* View Button - Mobile touch friendly */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/90 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-primary/30 scale-75 group-hover:scale-100 transition-transform duration-300">
                          <Eye className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                        </div>
                      </div>
                      
                      {/* Corner accents */}
                      <div className="absolute top-3 left-3 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-3 right-3 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 md:p-5">
                      <h3 className="font-display text-base md:text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="font-body text-xs md:text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      
                      {/* Stats - Responsive Grid */}
                      <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-2.5 text-center border border-border/20">
                          <Triangle className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary mx-auto mb-1" />
                          <span className="text-[10px] md:text-xs font-mono text-primary font-bold block">
                            {(project.specs.polyCount / 1000).toFixed(0)}K
                          </span>
                        </div>
                        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-2.5 text-center border border-border/20">
                          <Layers className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary mx-auto mb-1" />
                          <span className="text-[10px] md:text-xs font-mono text-primary font-bold block">
                            {project.specs.materialSlots}
                          </span>
                        </div>
                        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-2.5 text-center border border-border/20">
                          <Palette className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary mx-auto mb-1" />
                          <span className="text-[10px] md:text-xs font-mono text-primary font-bold block">
                            {project.specs.textureResolution}
                          </span>
                        </div>
                        <div className="bg-secondary/30 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-2.5 text-center border border-border/20">
                          <Grid3X3 className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary mx-auto mb-1" />
                          <span className="text-[10px] md:text-xs font-mono text-primary font-bold block">
                            {(project.specs.vertexCount / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                      
                      {/* Software Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/20">
                        {project.software.slice(0, 3).map((sw) => (
                          <span 
                            key={sw} 
                            className="text-[9px] md:text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md"
                          >
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Archviz Tab */}
          {activeTab === 'archviz' && (
            <div className="animate-fade-in">
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 md:p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg md:text-xl font-bold text-foreground">Architectural Visualization</h2>
                    <p className="text-xs md:text-sm text-muted-foreground">{archvizProjects.length} projects</p>
                  </div>
                </div>
              </div>

              {/* Featured Project */}
              {archvizProjects[0] && (
                <Link 
                  to={`/archviz/${archvizProjects[0].id}`}
                  state={{ from: `/gallery?tab=${activeTab}` }}
                  className="group block mb-6 md:mb-8"
                >
                  <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
                    <div className="aspect-[16/10] md:aspect-[21/9]">
                      <img 
                        src={archvizProjects[0].thumbnail}
                        alt={archvizProjects[0].title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
                    
                    {/* Accent glow */}
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 md:w-80 md:h-80 bg-accent/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-10">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl ${
                          archvizProjects[0].specs.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {archvizProjects[0].specs.status}
                        </span>
                        <span className="px-3 py-1.5 rounded-full text-xs font-mono bg-background/50 backdrop-blur-xl border border-border/30 text-muted-foreground">
                          {archvizProjects[0].specs.year}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-3 group-hover:text-accent transition-colors duration-500">
                        {archvizProjects[0].title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-accent" />
                          {archvizProjects[0].specs.location}
                        </span>
                        <span className="hidden md:inline w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="hidden md:flex items-center gap-1.5">
                          <Maximize className="w-4 h-4 text-accent" />
                          {archvizProjects[0].specs.area}
                        </span>
                      </div>
                      
                      <div className="mt-4 md:mt-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                        <span className="inline-flex items-center gap-2 text-accent font-medium">
                          View Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                    
                    {/* Corner decorations */}
                    <div className="absolute top-4 md:top-6 left-4 md:left-6 w-8 md:w-12 h-8 md:h-12 border-t-2 border-l-2 border-accent/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 w-8 md:w-12 h-8 md:h-12 border-t-2 border-r-2 border-accent/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {archvizProjects.slice(1).map((project, index) => (
                  <Link
                    key={project.id}
                    to={`/archviz/${project.id}`}
                    state={{ from: `/gallery?tab=${activeTab}` }}
                    className="group relative rounded-2xl overflow-hidden bg-card/50 backdrop-blur-xl border border-border/30 hover:border-accent/30 transition-all duration-500 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img 
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Status */}
                      <div className="absolute top-3 md:top-4 left-3 md:left-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium backdrop-blur-xl ${
                          project.specs.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {project.specs.status}
                        </span>
                      </div>
                      
                      {/* View button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/90 backdrop-blur-xl flex items-center justify-center shadow-xl">
                          <Eye className="w-5 h-5 md:w-6 md:h-6 text-accent-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 md:p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3 text-accent" />
                        <span>{project.specs.location}</span>
                      </div>
                      <h3 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{project.specs.area}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{project.specs.type}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Showreel Tab */}
          {activeTab === 'showreel' && (
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
                      src={featuredPoster}
                      alt={featured?.title}
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
                      {featured?.duration && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-background/60 backdrop-blur-xl border border-border/30">
                          <Clock className="w-3 h-3" />
                          {featured.duration}
                        </span>
                      )}
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
                        src={video.poster ?? video.thumbnail ?? ''}
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
                          {video.category ?? 'Showreel'}
                        </span>
                        {video.duration && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-mono bg-background/80 backdrop-blur-xl">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </span>
                        )}
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
          )}
        </div>
      </section>
    </Layout>
  );
}