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
import { LoaderIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const newProjectSchema = z.object({
  name: z.string().min(2).max(50),
  gitRepoUrl: z.string().url(),
});

function NewProject() {
  const form = useForm<z.infer<typeof newProjectSchema>>({
    resolver: zodResolver(newProjectSchema),
  });

  function onSubmit(values: z.infer<typeof newProjectSchema>) {
    console.log(values);
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
            <Button type="submit" className="w-full" disabled>
              Deploy
            </Button>
          </form>
        </Form>
      </section>
      <section className="rounded-lg border p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Build Logs</h3>
          <div className="flex items-center gap-2">
            <LoaderIcon className="size-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Deployment started...
            </span>
          </div>
        </div>
        <pre className="bg-muted text-green-400 p-4 rounded-sm overflow-x-auto text-sm">
          <div className="py-0.5">
            <span className="text-gray-400">
              [{new Date().toLocaleTimeString()}]
            </span>{' '}
            <span className="text-green-400 font-mono">Build started...</span>
          </div>
          <div className="py-0.5">
            <span className="text-gray-400">
              [{new Date().toLocaleTimeString()}]
            </span>{' '}
            <span className="text-green-400 font-mono">Build started...</span>
          </div>
        </pre>
      </section>
    </main>
  );
}

export default NewProject;
