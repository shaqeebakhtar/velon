import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Projects from '@/components/projects';
import NewProject from '@/components/projects/new';
import Project from '@/components/projects/project';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="projects">
          <Route index element={<Projects />} />
          <Route path="new" element={<NewProject />} />
          <Route path=":slug" element={<Project />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
