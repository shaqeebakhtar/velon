import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ExternalLink,
  GithubIcon,
  GlobeIcon,
  RotateCwIcon,
} from 'lucide-react';
import { Link, useParams } from 'react-router';
import Deployment from './deployment';
import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug } from '@/api/project';

function Project() {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug({ slug: slug as string }),
  });

  if (isLoading) return null;

  return (
    <main className="min-h-screen max-w-screen-xl mx-auto px-3 lg:px-12 py-20 space-y-20">
      <section className="w-full flex items-center justify-between">
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-semibold leading-none">
              {project?.name}
            </h3>
            <div className="bg-green-500/20 text-green-500 px-2.5 py-1 rounded-full text-xs font-medium">
              Ready
            </div>
          </div>
          <div className="flex items-center gap-3 divide-x divide-input">
            <Link
              to={`http://${project?.slug}.localhost:8000`}
              target="_blank"
              className="flex items-center gap-2 text-muted-foreground text-sm hover:underline w-max relative z-20"
            >
              <GlobeIcon className="size-4" />
              {project?.slug}.velon.app
              <ExternalLink className="size-4" />
            </Link>
            <div className="text-xs text-muted-foreground pl-3">
              35 days ago
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="h-10">
            <RotateCwIcon className="size-4" />
            Redeploy
          </Button>
          <Link
            to={project?.repoUrl as string}
            target="_blank"
            className={cn(buttonVariants({ variant: 'outline' }), 'h-10')}
          >
            <GithubIcon className="size-4" />
            Repository
          </Link>
          <Link
            to={`http://${project?.slug}.localhost:8000`}
            target="_blank"
            className={cn(buttonVariants())}
          >
            <ExternalLink className="size-4" />
            Visit
          </Link>
        </div>
      </section>
      <section className="w-full space-y-6">
        <h3 className="text-2xl font-semibold">Deployments</h3>
        <div className="divide-y divide-input border rounded-lg">
          {project?.deployments?.map((deployment) => (
            <Deployment key={deployment.id} deployment={deployment} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Project;
