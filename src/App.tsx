import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './routes/HomePage';
import AppLayout from './routes/AppLayout';
import { useStore } from './useStore';
import Modal from './components/Modal';
import Alert from './components/Alert';
import CheckAuthAndNavigate from './components/CheckAuthAndNavigate';
import Prompt from './components/Prompt';
import mixpanel from 'mixpanel-browser';
import { getDeviceId } from './helpers/device';
import { track } from './helpers/track';
import { TrackingEvent } from './constants';

function App() {
  const modal = useStore.use.modal();
  const alert = useStore.use.alert();
  const prompt = useStore.use.prompt();

  useEffect(() => {
    // track(TrackingEvent.APP_LAUNCHED);
  }, []);

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
      {!!modal && <Modal />}
      {!!alert && <Alert />}
      {!!prompt && <Prompt />}
    </div>
  );
}

export default App;
