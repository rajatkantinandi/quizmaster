import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './routes/HomePage';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Quizzes from './routes/Quizzes';
import CreateQuiz from './routes/CreateQuiz';
import { Button, Container, Header } from 'semantic-ui-react';
import { getSignedInUserName } from './helpers/user';
import Cookies from 'js-cookie';

function App() {
  const userName = getSignedInUserName();

  return (
    <Container className="App">
      <BrowserRouter>
        <Header className="App-header">
          {!!userName && (
            <div className="flex">
              <img src={logo} className="App-logo" alt="logo" />
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
          <Route path="/create-quiz/:userName" element={<CreateQuiz />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
