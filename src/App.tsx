import React from 'react';
import './styles/app.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './routes/HomePage';
import Login from './routes/Login';
import Signup from './routes/Signup';
import Quizzes from './routes/Quizzes';
import AddEditQuiz from './routes/AddEditQuiz';
import ConfigureQuiz from './routes/ConfigureQuiz';
import ConfigureGame from './routes/ConfigureGame';
import PlayQuiz from './routes/PlayQuiz';
import { useAppStore } from './useAppStore';
import ConfirmationModal from './components/ConfirmationModal';
import Header from './components/Header';
import NavigateToQuizzesIfLoggedIn from './components/NavigateToQuizzesIfLoggedIn';

function App() {
  const { confirmationModal } = useAppStore();

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <NavigateToQuizzesIfLoggedIn>
                <HomePage />
              </NavigateToQuizzesIfLoggedIn>
            }
          />
          <Route
            path="/login"
            element={
              <NavigateToQuizzesIfLoggedIn>
                <Login />
              </NavigateToQuizzesIfLoggedIn>
            }
          />
          <Route
            path="/signup"
            element={
              <NavigateToQuizzesIfLoggedIn>
                <Signup />
              </NavigateToQuizzesIfLoggedIn>
            }
          />
          <Route path="/quizzes/:userName" element={<Quizzes />} />
          <Route path="/configure-quiz/:userName" element={<ConfigureQuiz />} />
          <Route path="/configure-quiz/:userName/:quizId" element={<ConfigureQuiz />} />
          <Route path="/edit-quiz/:userName/:quizId" element={<AddEditQuiz />} />
          <Route path="/configure-game/:userName/:quizId" element={<ConfigureGame />} />
          <Route path="/play-game/:userName/:gameId" element={<PlayQuiz />} />
        </Routes>
      </BrowserRouter>
      {!!confirmationModal && <ConfirmationModal {...confirmationModal} />}
    </div>
  );
}

export default App;
