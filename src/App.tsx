import React from 'react';
import logo from './img/logo.svg';
import './styles/app.css';
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
import { useAppStore } from './useAppStore';
import ConfirmationModal from './components/ConfirmationModal';

function App() {
  const userName = getSignedInUserName();
  const { confirmationModal } = useAppStore();

  return (
    <div className="App">
      <BrowserRouter>
        <Header className="App-header">
          <div className="flex alignCenter">
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo" />
            </Link>
            {userName ? (
              <>
                <div className="mx-lg">{userName}</div>
                <Button
                  color="brown"
                  onClick={() => {
                    Cookies.set('sessionId', '', {
                      domain: window.location.hostname,
                      sameSite: 'Strict',
                    });
                    Cookies.set('userName', '', {
                      domain: window.location.hostname,
                      sameSite: 'Strict',
                    });
                    window.location.href = '/login';
                  }}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="mx-lg">Quizmaster</div>
            )}
          </div>
        </Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/quizzes/:userName" element={<Quizzes />} />
          <Route path="/edit-quiz/:userName" element={<AddEditQuiz />} />
          <Route path="/edit-quiz/:userName/:id" element={<AddEditQuiz />} />
          <Route path="/play-quiz/:userName/:id" element={<PlayQuiz />} />
        </Routes>
      </BrowserRouter>
      {!!confirmationModal && <ConfirmationModal {...confirmationModal} />}
    </div>
  );
}

export default App;
