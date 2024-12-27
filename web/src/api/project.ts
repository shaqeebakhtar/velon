import { Log, Project } from '@/types/project';
import axios from 'axios';

export async function getProjects(): Promise<Project[]> {
  const { projects } = await axios
    .get('http://localhost:9000/project')
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return projects;
}

export async function getProjectBySlug({
  slug,
}: {
  slug: string;
}): Promise<Project> {
  const { project } = await axios
    .get(`http://localhost:9000/project/${slug}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return project;
}

export async function getDeploymentLogsById({
  deploymentId,
}: {
  deploymentId: string;
}): Promise<Log[]> {
  const { logs } = await axios
    .get(`http://localhost:9000/logs/${deploymentId}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return logs;
}

export async function deployProject({
  name,
  gitRepoUrl,
}: {
  name: string;
  gitRepoUrl: string;
}) {
  const { project } = await axios
    .post('http://localhost:9000/project', {
      name,
      gitRepoUrl,
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));

  const deployment = await axios
    .post('http://localhost:9000/deploy', {
      projectId: project.id,
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return deployment;
}
