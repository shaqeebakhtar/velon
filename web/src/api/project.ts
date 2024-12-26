import { Project } from '@/types/project';
import axios from 'axios';

export async function getProjects(): Promise<Project[]> {
  const { projects } = await axios
    .get('http://localhost:9000/project')
    .then((res) => res.data)
    .catch((err) => console.log(err));

  return projects;
}
