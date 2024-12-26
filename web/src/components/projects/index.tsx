import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router';
import { buttonVariants } from '../ui/button';
import ProjectCard from './project-card';

function Projects() {
  return (
    <main className="min-h-screen max-w-screen-xl mx-auto px-3 lg:px-12 py-20 space-y-8">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Projects</h3>
        <Link to={'/projects/new'} className={cn(buttonVariants())}>
          <PlusIcon />
          New Project
        </Link>
      </div>
      <div className="w-full grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
      </div>
    </main>
  );
}

export default Projects;
