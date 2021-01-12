import React from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../AuthContext'
import axios from 'axios'

function Layout({navtype, body}, ...props) {
  const token = React.useContext(AuthContext)

  function logout() {
    axios.post('/auth/logout', {token})
      .then((response) => {
        console.log(response)
        window.location.href = '/login'
      })
  }

  console.log(navtype)

  if (navtype == 'teacher') {
    return (
      <>
        <div id='navbar'>
          <h3>Osiris</h3>
          <h4><Link to={{
            pathname: '/user/settings',
            userType: 'teacher'
        }}>Profile</Link></h4>
          <h4><Link to='/teacher'>Dashboard</Link></h4>
          <h4><Link to='/courses'>Courses</Link></h4>
          <h4><Link to='/classes'>Classes</Link></h4>
          <h4><Link to='/topics'>Topics</Link></h4>
          <h4><Link to='/users'>Users</Link></h4>
          <div name='logout'><h4><Link onClick={logout}>LOGOUT</Link></h4></div>
        </div>

        <div id='error'></div>
        {body}
        <div className='footer'>
          Osiris 1.0.0<br />
          Developed By <a href='mailto:nick.p@iinet.net.au'>Nick Patrikeos</a>.
        </div>
      </>
    );
  } else if (navtype == 'student') {
    return (
      <>
        <div id='navbar'>
          <h3>Osiris</h3>
          <h4><Link to={{
            pathname: '/user/settings',
            userType: 'teacher'
        }}>Profile</Link></h4>
          <h4><Link to='/student'>Dashboard</Link></h4>
          <div name='logout'><h4><Link onClick={logout}>LOGOUT</Link></h4></div>
        </div>
        <div id='error'></div>
        {body}
        <div className='footer'>
          Osiris 4.0.0<br />
          Developed By <a href='mailto:nick.p@iinet.net.au'>Nick Patrikeos</a>.
        </div>
      </>
    );
  } else {
    return (
      <>
        <div id='navbar'>
          <h3>Osiris</h3>
        </div>
        <div id='error'></div>
        {body}
        <div className='footer'>
          Osiris 1.0.0<br />
          Developed By <a href='mailto:nick.p@iinet.net.au'>Nick Patrikeos</a>.
        </div>
      </>
    )
  }
}

export default Layout
