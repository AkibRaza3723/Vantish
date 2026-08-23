import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Network from './pages/Network';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes without Layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated Routes with Layout */}
        <Route path="/feed" element={<Layout><Home /></Layout>} />
        <Route path="/network" element={<Layout><Network /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
