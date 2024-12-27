import { getDeploymentLogsById } from '@/api/project';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Deployment as IDeployment } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import { ChevronRight } from 'lucide-react';

function Deployment({ deployment }: { deployment: IDeployment }) {
  const { data: logs, isLoading } = useQuery({
    queryKey: ['deployment', deployment.id],
    queryFn: () => getDeploymentLogsById({ deploymentId: deployment.id }),
  });

  if (isLoading) return null;

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="flex items-center justify-between p-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
              <p className="text-sm font-semibold">{deployment.id}</p>
              <div className="bg-green-500/20 text-green-500 px-2.5 py-1 rounded-full text-xs font-medium">
                {deployment.status}
              </div>
            </div>
            <div className="text-xs text-muted-foreground pl-3">
              {formatDistance(new Date(deployment.createdAt), new Date(), {
                addSuffix: true,
              })}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 pt-0">
            <pre className="bg-muted text-green-400 p-4 rounded-sm overflow-x-auto text-sm">
              {logs?.map((log) => (
                <div key={log.log_id} className="flex items-start gap-2 py-0.5">
                  <span className="text-gray-400">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className="text-green-400 font-mono">
                    {log.log.trim()}
                  </span>
                </div>
              ))}
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Deployment;
