import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './routes/HomePage';
import AppLayout from './routes/AppLayout';
import { useStore } from './useStore';
import Modal from './components/Modal';
import Alert from './components/Alert';
import CheckAuthAndNavigate from './components/CheckAuthAndNavigate';

function App() {
  const { modal, alert } = useStore();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/:viewType" element={<HomePage />} />
          <Route path=":viewType/:userName" element={<AppLayout />} />
          <Route path=":viewType/:userName/:id" element={<AppLayout />} />
          <Route path="*" element={<CheckAuthAndNavigate />} />
        </Routes>
      </BrowserRouter>
      {!!modal && <Modal {...modal} />}
      {!!alert && <Alert {...alert} />}
    </div>
  );
}

export default App;
