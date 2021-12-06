import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Route, Routes, BrowserRouter, Link } from 'react-router-dom';
import HomePage from './routes/HomePage';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Quizzes from './routes/Quizzes';
import AddEditQuiz from './routes/AddEditQuiz';
import { Button, Header } from 'semantic-ui-react';
import { getSignedInUserName } from './helpers/user';
import Cookies from 'js-cookie';
import PlayQuiz from './routes/PlayQuiz';

function App() {
  const userName = getSignedInUserName();

  return (
    <div className="App">
      <BrowserRouter>
        <Header className="App-header">
          {!!userName && (
            <div className="flex alignCenter">
              <Link to="/">
                <img src={logo} className="App-logo" alt="logo" />
              </Link>
              <div className="mx-lg">{userName}</div>
              <Button
                color="brown"
                onClick={() => {
                  Cookies.set('sessionId', '');
                  Cookies.set('userName', '');
                  window.location.href = '/login';
                }}>
                Logout
              </Button>
            </div>
          )}
        </Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/quizzes/:userName" element={<Quizzes />} />
          <Route path="/create-quiz/:userName" element={<AddEditQuiz />} />
          <Route path="/edit-quiz/:userName/:id" element={<AddEditQuiz />} />
          <Route path="/play-quiz/:userName/:id" element={<PlayQuiz />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
