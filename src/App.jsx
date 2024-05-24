import './App.css';
import Section from './components/Section';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { useEffect } from 'react';


function App() {
  return (
    <div className="flex h-screen" >
      <Sidebar />
      <Section />
    </div>
  );
}

export default App;
