import React, { useEffect } from 'react';
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

function App() {
  const { confirmationModal, getUserData } = useAppStore();

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/quizzes/:userName" element={<Quizzes />} />
          <Route path="/configure-quiz/:userName" element={<ConfigureQuiz />} />
          <Route path="/configure-quiz/:userName/:quizId" element={<ConfigureQuiz />} />
          <Route path="/edit-quiz/:userName/:id" element={<AddEditQuiz />} />
          <Route path="/configure-game/:userName/:id" element={<ConfigureGame />} />
          <Route path="/play-game/:userName/:gameId" element={<PlayQuiz />} />
        </Routes>
      </BrowserRouter>
      {!!confirmationModal && <ConfirmationModal {...confirmationModal} />}
    </div>
  );
}

export default App;
