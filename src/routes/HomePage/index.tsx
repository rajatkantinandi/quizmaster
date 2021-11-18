import React from 'react'
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';


export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate('/login')}>Login</Button>
      <Button>Import Quiz</Button>
    </div>
  )
}
