import React from 'react'
import { Button, Container, Form, Input } from 'semantic-ui-react'

export default function Login() {
  return (
    <Container>
      <Form className="flexCol flex">
        <Input type="text" label="Username" labelPosition="left" name="username" />
        <Input type="password" label="Password" labelPosition="left" name="password" />
        <Button color="blue" className="alignCenter">Login</Button>
      </Form>
    </Container>
  )
}
