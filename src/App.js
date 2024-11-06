import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DataStoryPage from './pages/DataStoryPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <Navbar />
        <main className="pt-2">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/story/:id" element={<DataStoryPage />} />
            <Route path="/documentation" element={<div>Documentation Page</div>} />
            <Route path="/credits" element={<div>Credits Page</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;