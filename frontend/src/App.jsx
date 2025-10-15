// App.jsx
import React from 'react';
import './App.css';


import FoodOrderManager from './components/FoodOrderManager'; // make sure this path is correct

function App() {
  return (
    <div className="App">
      {/* Main Food Manager Section */}
      <FoodOrderManager />
    </div>
  );
}

export default App;


