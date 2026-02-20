import Navbar from './components/Navbar';
import FeedView from './views/FeedView';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <FeedView />
      </main>
    </div>
  );
}

export default App;
