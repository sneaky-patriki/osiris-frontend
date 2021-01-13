import React from 'react'
import axios from 'axios'
import '../App.css'
import Layout from '../components/Layout'

function LoginPage({ setAuth, ...props }) {

  function handleSubmit(event) {
    event.preventDefault()

    const username = event.target[0].value;
    const password = event.target[1].value

    if (!username || !password) return;

    axios.post('/auth/login', { username, password })
      .then((response) => {
        // response.set('Access-Control-Allow-Origin', '*')
        const data = response.data
        setAuth(data.token, data.u_id)

        if (data.user_type == 'teacher') {
          props.history.push('/teacher')
        } else if (data.user_type == 'student') {
          props.history.push('/student')
        }
      })
      .catch((err) => {});
  }

  return (
    <Layout navtype='' body={
      <div id='logindiv'>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
              <input type='text' name='username' placeholder="*Username" />
              <br />
              <input type='password' name='password' placeholder="*Password" />
              <br />
              <input type='submit' value='Login' />
          </form>
      </div>
    }/>
  )

}

export default LoginPage
