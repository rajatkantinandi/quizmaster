import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './routes/HomePage';
import AppLayout from './routes/AppLayout';
import { useStore } from './useStore';
import Modal from './components/Modal';
import Alert from './components/Alert';
import NavigateToQuizzesIfLoggedIn from './components/NavigateToQuizzesIfLoggedIn';
import { appPaths } from './constants';

function App() {
  const { modal, alert } = useStore();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <NavigateToQuizzesIfLoggedIn>
                <HomePage />
              </NavigateToQuizzesIfLoggedIn>
            }
          />
          <Route path=":viewType/:userName" element={<AppLayout />} />
          <Route path=":viewType/:userName/:id" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
      {!!modal && <Modal {...modal} />}
      {!!alert && <Alert {...alert} />}
    </div>
  );
}

export default App;
