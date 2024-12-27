import { Project } from '@/types/project';
import axios from 'axios';

export async function getProjects(): Promise<Project[]> {
  const { projects } = await axios
    .get('http://localhost:9000/project')
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return projects;
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
