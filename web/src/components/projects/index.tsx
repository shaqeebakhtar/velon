import { getProjects } from '@/api/project';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router';
import { buttonVariants } from '../ui/button';
import ProjectCard, { ProjectCardSkeleton } from './project-card';

function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

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
        {isLoading ? (
          [...Array(4)].map((_, index) => <ProjectCardSkeleton key={index} />)
        ) : projects && projects?.length > 0 ? (
          projects?.map((project) => <ProjectCard key={project.id} />)
        ) : (
          <div className="col-span-3 h-96 flex items-center justify-center border rounded-lg">
            <p className="text-lg font-medium">No projects found</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Projects;
