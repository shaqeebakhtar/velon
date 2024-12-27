import { Project } from '@/types/project';
import { formatDistance, subDays } from 'date-fns';
import { ExternalLink, GithubIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Skeleton } from '../ui/skeleton';

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="relative border rounded-lg p-5">
      <Link
        aria-label="Open project"
        to={`/projects/${project.slug}`}
        className="absolute inset-0 z-10"
      ></Link>
      <div className="space-y-1">
        <h4 className="font-medium">{project.name}</h4>
        <Link
          to={`http://${project.slug}.localhost:8000`}
          target="_blank"
          className="flex items-center gap-2 text-muted-foreground text-sm hover:underline w-max relative z-20"
        >
          {project.slug}.velon.app
          <ExternalLink className="size-4" />
        </Link>
      </div>
      <div className="w-full flex items-center justify-between gap-4 mt-6">
        <Link
          to={`${project.repoUrl}`}
          target="_blank"
          className="max-w-52 bg-muted px-3 py-1.5 rounded-full flex items-center gap-1.5 text-muted-foreground font-medium hover:bg-muted/80 hover:text-foreground transition-all relative z-20"
        >
          <GithubIcon className="size-4 text-foreground" />
          <span className="text-sm truncate">
            {project.repoUrl.split('https://github.com/')[1]}
          </span>
        </Link>
        <div className="text-xs text-muted-foreground">
          {formatDistance(subDays(new Date(), 3), project.createdAt, {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;

export function ProjectCardSkeleton() {
  return (
    <div className="relative border rounded-lg p-5">
      <div className="space-y-1">
        <Skeleton className="w-36 h-6" />
        <Skeleton className="w-28 h-5" />
      </div>
      <div className="w-full flex items-center justify-between gap-4 mt-6">
        <Skeleton className="w-40 h-8" />
        <Skeleton className="w-14 h-4" />
      </div>
    </div>
  );
}
