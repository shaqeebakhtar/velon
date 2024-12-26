import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronRight } from 'lucide-react';

function Deployment() {
  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="flex items-center justify-between p-5 hover:no-underline">
            <div className="flex items-center gap-3">
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
              <p className="text-sm font-semibold">3feae8fwe68w</p>
              <div className="bg-red-500/20 text-red-500 px-2.5 py-1 rounded-full text-xs font-medium">
                Failed
              </div>
            </div>
            <div className="text-xs text-muted-foreground pl-3">
              35 days ago
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-5 pt-0">
            <pre className="bg-muted text-green-400 p-4 rounded-sm overflow-x-auto text-sm">
              <div className="py-0.5">
                <span className="text-gray-400">
                  [{new Date().toLocaleTimeString()}]
                </span>{' '}
                <span className="text-green-400 font-mono">
                  Build started...
                </span>
              </div>
              <div className="py-0.5">
                <span className="text-gray-400">
                  [{new Date().toLocaleTimeString()}]
                </span>{' '}
                <span className="text-green-400 font-mono">
                  Build started...
                </span>
              </div>
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default Deployment;
