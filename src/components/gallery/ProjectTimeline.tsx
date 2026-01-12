import { useMemo, useState } from 'react';
import { Project } from '@/types/portfolio';
import { Calendar, Clock, CheckCircle, Play, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, differenceInDays, parseISO, min, max, differenceInCalendarDays, addDays } from 'date-fns';

interface ProjectTimelineProps {
  projects: Project[];
}

export function ProjectTimeline({ projects }: ProjectTimelineProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const timelineData = useMemo(() => {
    // Filter projects that have valid startDate and completedAt
    const validProjects = projects.filter(p => p.startDate && p.completedAt);
    
    const parsed = validProjects.map(project => {
      const start = parseISO(project.startDate);
      const end = parseISO(project.completedAt);
      const duration = differenceInDays(end, start) + 1;
      
      return {
        ...project,
        startParsed: start,
        endParsed: end,
        duration,
      };
    }).sort((a, b) => a.startParsed.getTime() - b.startParsed.getTime());

    if (parsed.length === 0) return { projects: [], minDate: new Date(), maxDate: new Date(), totalDays: 0 };

    const allDates = parsed.flatMap(p => [p.startParsed, p.endParsed]);
    const minDate = min(allDates);
    const maxDate = max(allDates);
    const totalDays = differenceInCalendarDays(maxDate, minDate) + 1;

    return { projects: parsed, minDate, maxDate, totalDays };
  }, [projects]);

  const projectColors = [
    { bg: 'bg-primary', glow: 'shadow-primary/30' },
    { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
    { bg: 'bg-amber-500', glow: 'shadow-amber-500/30' },
    { bg: 'bg-violet-500', glow: 'shadow-violet-500/30' },
    { bg: 'bg-rose-500', glow: 'shadow-rose-500/30' },
    { bg: 'bg-cyan-500', glow: 'shadow-cyan-500/30' },
  ];

  const getPositionPercentage = (date: Date) => {
    const dayOffset = differenceInCalendarDays(date, timelineData.minDate);
    return (dayOffset / timelineData.totalDays) * 100;
  };

  // Generate date markers for the timeline
  const dateMarkers = useMemo(() => {
    if (timelineData.totalDays === 0) return [];
    
    const markers: { date: Date; position: number }[] = [];
    const interval = Math.max(1, Math.floor(timelineData.totalDays / 6)); // Show ~6 markers
    
    for (let i = 0; i <= timelineData.totalDays; i += interval) {
      const date = addDays(timelineData.minDate, i);
      markers.push({
        date,
        position: (i / timelineData.totalDays) * 100
      });
    }
    
    return markers;
  }, [timelineData]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Timeline Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 md:p-5 rounded-xl bg-card/30 backdrop-blur-xl border border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base md:text-lg font-bold text-foreground">Project Timeline</h3>
            <p className="text-xs text-muted-foreground">Start → Completion dates</p>
          </div>
        </div>
        <div className="text-xs md:text-sm font-mono text-muted-foreground">
          {format(timelineData.minDate, 'MMM yyyy')} — {format(timelineData.maxDate, 'MMM yyyy')}
        </div>
      </div>

      {/* Graph Timeline View */}
      <div className="rounded-xl bg-card/30 backdrop-blur-xl border border-border/30 p-4 md:p-6 overflow-hidden">
        {/* Date markers on top */}
        <div className="relative h-6 mb-4 border-b border-border/30">
          {dateMarkers.map((marker, index) => (
            <div
              key={index}
              className="absolute -translate-x-1/2 text-[10px] md:text-xs font-mono text-muted-foreground"
              style={{ left: `${marker.position}%` }}
            >
              {format(marker.date, 'MMM d')}
            </div>
          ))}
        </div>

        {/* Timeline Graph */}
        <div className="relative min-h-[200px] md:min-h-[280px]">
          {/* Vertical grid lines */}
          {dateMarkers.map((marker, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 w-px bg-border/20"
              style={{ left: `${marker.position}%` }}
            />
          ))}

          {/* Project rows */}
          <div className="relative space-y-3 md:space-y-4">
            {timelineData.projects.map((project, index) => {
              const colorIndex = index % projectColors.length;
              const color = projectColors[colorIndex];
              const startPos = getPositionPercentage(project.startParsed);
              const endPos = getPositionPercentage(project.endParsed);
              const width = endPos - startPos;
              const isSelected = selectedProject?.id === project.id;
              const isHovered = hoveredProject === project.id;

              return (
                <div
                  key={project.id}
                  className="relative h-12 md:h-14 group"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Project label - Mobile: below, Desktop: left */}
                  <div className="absolute left-0 top-0 md:top-1/2 md:-translate-y-1/2 text-[10px] md:text-xs font-medium text-foreground truncate w-full md:w-auto md:max-w-[100px] lg:max-w-[140px] pr-2 z-10">
                    <span className="hidden md:inline truncate">{project.title}</span>
                  </div>

                  {/* Timeline bar */}
                  <div 
                    className="absolute h-8 md:h-10 top-4 md:top-1/2 md:-translate-y-1/2 md:left-[160px] lg:left-[180px] right-0"
                    style={{ left: window.innerWidth < 768 ? '0' : undefined }}
                  >
                    <div className="relative w-full h-full">
                      {/* Connection line */}
                      <div className="absolute top-1/2 left-0 right-0 h-px bg-border/30 -translate-y-1/2" />
                      
                      {/* Duration bar */}
                      <button
                        onClick={() => setSelectedProject(isSelected ? null : project)}
                        className={`absolute top-1/2 -translate-y-1/2 h-6 md:h-8 rounded-full flex items-center justify-between px-2 md:px-3 cursor-pointer transition-all duration-300 ${color.bg} ${
                          isSelected || isHovered ? `shadow-lg ${color.glow} scale-105` : ''
                        }`}
                        style={{
                          left: `${startPos}%`,
                          width: `${Math.max(width, 3)}%`,
                          minWidth: '60px'
                        }}
                      >
                        {/* Start pin */}
                        <div className="flex items-center gap-1">
                          <Play size={10} className="text-white fill-white" />
                          <span className="text-[8px] md:text-[10px] font-mono text-white/90 hidden sm:inline">
                            {format(project.startParsed, 'M/d')}
                          </span>
                        </div>

                        {/* Project name on bar - mobile */}
                        <span className="text-[8px] md:text-[10px] font-medium text-white truncate px-1 md:hidden max-w-[80px]">
                          {project.title}
                        </span>

                        {/* End pin */}
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] md:text-[10px] font-mono text-white/90 hidden sm:inline">
                            {format(project.endParsed, 'M/d')}
                          </span>
                          <Flag size={10} className="text-white fill-white" />
                        </div>
                      </button>

                      {/* Start marker dot */}
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-background ${color.bg} ${
                          isHovered ? 'scale-125' : ''
                        } transition-transform z-10`}
                        style={{ left: `${startPos}%`, transform: 'translate(-50%, -50%)' }}
                      />

                      {/* End marker dot */}
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-background ${color.bg} ${
                          isHovered ? 'scale-125' : ''
                        } transition-transform z-10`}
                        style={{ left: `${endPos}%`, transform: 'translate(-50%, -50%)' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground">
            <Play size={12} className="text-primary fill-primary" />
            <span>Start Date</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground">
            <Flag size={12} className="text-primary fill-primary" />
            <span>Completion</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground ml-auto">
            <Clock size={12} />
            <span>Click bar for details</span>
          </div>
        </div>
      </div>

      {/* Selected Project Detail Panel */}
      {selectedProject && (
        <div className="animate-fade-in p-4 md:p-5 rounded-xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl border border-primary/30">
          <div className="flex items-start gap-3 md:gap-4">
            <img 
              src={selectedProject.thumbnail} 
              alt={selectedProject.title}
              className="w-14 h-14 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-base md:text-lg font-bold text-foreground mb-2 truncate">
                {selectedProject.title}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Started</span>
                  <span className="font-mono text-xs text-emerald-400">{format(parseISO(selectedProject.startDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Completed</span>
                  <span className="font-mono text-xs text-primary">{format(parseISO(selectedProject.completedAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Duration</span>
                  <span className="font-mono text-xs text-foreground">{differenceInDays(parseISO(selectedProject.completedAt), parseISO(selectedProject.startDate)) + 1} days</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Category</span>
                  <span className="font-mono text-xs text-foreground">{selectedProject.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project List Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3">
        {timelineData.projects.map((project, index) => {
          const colorIndex = index % projectColors.length;
          const color = projectColors[colorIndex];
          const isSelected = selectedProject?.id === project.id;
          
          return (
            <button
              key={project.id}
              onClick={() => setSelectedProject(isSelected ? null : project)}
              className={`group p-2.5 md:p-3 rounded-lg border transition-all duration-200 text-left ${
                isSelected 
                  ? `bg-card border-primary/50 shadow-lg ${color.glow}` 
                  : 'bg-card/30 border-border/30 hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${color.bg} flex-shrink-0`} />
                <span className="text-[10px] md:text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {project.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] md:text-[10px] text-muted-foreground font-mono">
                <span>{format(project.startParsed, 'M/d')}</span>
                <span>→</span>
                <span>{format(project.endParsed, 'M/d')}</span>
              </div>
              <div className="text-[9px] text-muted-foreground mt-1">
                {project.duration} days
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}