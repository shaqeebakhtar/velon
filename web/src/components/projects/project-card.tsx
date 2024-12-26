import { ExternalLink, GithubIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Skeleton } from '../ui/skeleton';

function ProjectCard() {
  return (
    <div className="relative border rounded-lg p-5">
      <Link
        aria-label="Open project"
        to={'/'}
        className="absolute inset-0 z-10"
      ></Link>
      <div className="space-y-1">
        <h4 className="font-medium">Project Name</h4>
        <Link
          to={`/projects/project-name`}
          target="_blank"
          className="flex items-center gap-2 text-muted-foreground text-sm hover:underline w-max relative z-20"
        >
          slug.velon.app
          <ExternalLink className="size-4" />
        </Link>
      </div>
      <div className="w-full flex items-center justify-between gap-4 mt-6">
        <Link
          to={`/projects/project-name`}
          target="_blank"
          className="max-w-52 bg-muted px-3 py-1.5 rounded-full flex items-center gap-1.5 text-muted-foreground font-medium hover:bg-muted/80 hover:text-foreground transition-all relative z-20"
        >
          <GithubIcon className="size-4 text-foreground" />
          <span className="text-sm truncate">username/repo</span>
        </Link>
        <div className="text-xs text-muted-foreground">35 days ago</div>
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
