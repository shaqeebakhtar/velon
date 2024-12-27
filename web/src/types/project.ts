export interface Deployment {
  id: string;
  projectId: string;
  status: 'PENDING' | 'BUILDING' | 'DEPLOYED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  slug: string;
  deployments?: Deployment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Log {
  log_id: string;
  deployment_id: string;
  log: string;
  timestamp: Date;
}
