import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import StreamList from './components/stream_list/StreamList';
import Movies from './components/movies/Movies';
import Cart from './components/cart/Cart';
import About from './components/about/About';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
