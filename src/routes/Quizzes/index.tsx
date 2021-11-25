import React from 'react';
import { useParams } from 'react-router';

export default function Login() {
  const { userName } = useParams();

  return (
    <section>
      <h1>Welcome: {userName}</h1>
    </section>
  );
}
