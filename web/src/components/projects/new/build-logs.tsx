import useSocket from '@/hooks/use-socket';
import { LoaderIcon } from 'lucide-react';

function BuildLogs({
  deploymentStatus,
  deploymentId,
  projectSlug,
}: {
  deploymentStatus: string;
  deploymentId: string;
  projectSlug: string;
}) {
  const { logs } = useSocket({ deploymentId, projectSlug });

  return (
    <section className="rounded-lg border p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Build Logs</h3>
        {deploymentStatus === 'BUILDING' && (
          <div className="flex items-center gap-2">
            <LoaderIcon className="size-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Deployment started...
            </span>
          </div>
        )}
      </div>
      {deploymentStatus === 'PENDING' && (
        <p className="text-muted-foreground">
          Start deploying to see the progress here…
        </p>
      )}
      {deploymentStatus === 'BUILDING' && (
        <pre className="bg-muted text-green-400 p-4 rounded-sm overflow-x-auto text-sm">
          {logs.map((log) => (
            <div key={log} className="flex items-start gap-2 py-0.5">
              <span className="text-gray-400">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span className="text-green-400 font-mono">{log.trim()}</span>
            </div>
          ))}
        </pre>
      )}
    </section>
  );
}

export default BuildLogs;
