import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Question from './components/Question';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <section>
        <Question
          text="Who are you?"
          options={[
            { id: 1, optionText: 'No one', isCorrect: false },
            { id: 2, optionText: 'Legend', isCorrect: false },
            { id: 3, optionText: 'Me', isCorrect: false },
          ]}
        />
      </section>
    </div>
  );
}

export default App;
