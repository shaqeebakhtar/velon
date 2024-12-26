import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Projects from './components/projects';
import NewProject from './components/projects/new';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="projects">
          <Route index element={<Projects />} />
          <Route path="new" element={<NewProject />} />
          <Route path=":name" element={<>name</>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
