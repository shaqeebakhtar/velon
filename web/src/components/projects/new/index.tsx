import { deployProject } from '@/api/project';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import BuildLogs from './build-logs';

const newProjectSchema = z.object({
  name: z.string().min(2).max(50),
  gitRepoUrl: z.string().url(),
});

function NewProject() {
  const [deploymentStatus, setDeploymentStatus] = useState('PENDING');
  const [deploymentId, setDeploymentId] = useState(null);
  const [projectSlug, setProjectSlug] = useState('');
  const form = useForm<z.infer<typeof newProjectSchema>>({
    resolver: zodResolver(newProjectSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: deployProject,
    onSuccess: ({ slug, deployment }) => {
      setDeploymentStatus(deployment.status);
      setDeploymentId(deployment.id);
      setProjectSlug(slug);
    },
  });

  function onSubmit(values: z.infer<typeof newProjectSchema>) {
    mutate({
      ...values,
    });
  }

  return (
    <main className="min-h-screen max-w-screen-md mx-auto px-3 lg:px-12 py-20 space-y-8">
      <section className="rounded-lg border p-8 space-y-8">
        <h3 className="text-2xl font-semibold">New Project</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gitRepoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://github.com/username/repo-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || deploymentStatus === 'BUILDING'}
            >
              {isPending && <LoaderIcon className="size-4 animate-spin" />}
              Deploy
            </Button>
          </form>
        </Form>
      </section>
      {deploymentId && !isPending ? (
        <BuildLogs
          deploymentStatus={deploymentStatus}
          deploymentId={deploymentId}
          projectSlug={projectSlug}
        />
      ) : (
        <section className="rounded-lg border p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Build Logs</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Start deploying to see the progress here…
          </p>
        </section>
      )}
    </main>
  );
}

export default NewProject;
