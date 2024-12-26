import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Projects from './components/projects';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="projects">
          <Route index element={<Projects />} />
          <Route path=":name" element={<>name</>} />
          <Route path="new" element={<>new</>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
