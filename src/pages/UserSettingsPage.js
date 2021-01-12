import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function UserSettingsPage(props) {

  const token = React.useContext(AuthContext)
  var file = false

  var userType;
  if (props.location.userType != undefined) {
    userType = props.location.userType
  } else {
    userType = 'student'
  }

  function handleSubmit(event) {
    event.preventDefault()

    const old_password = event.target[0].value
    const new_password = event.target[1].value
    const confirm_password = event.target[2].value

    axios.put('/user/password', { token, old_password, new_password, confirm_password })
      .then((response) => {
        const dashboard = response.data.type
        console.log(dashboard)
        props.history.push('/' + dashboard)
      })
      .catch((err) => {})
  }


  return (
    <Layout navtype={userType} body={
      <>
        <div class='headerSection'>
            <h4 id="className"></h4>
            <h1>Settings</h1>
        </div>
        <hr/>

        <form name='passwordChangeForm' onSubmit={handleSubmit}>
            <h4>Change Password</h4><br/>
            <input type='text' type='password' name='oldPassword' placeholder='Old Password' /><br/>
            <input type='text' type='password' name='newPassword' placeholder='New Password' /><br/>
            <input type='text' type='password' name='newPasswordConfirm' placeholder='Confirm New Password' /><br/>
            <input type='submit' value='Update Password' />
            <br/>
        </form>
      </>
    }/>

  )

}

export default UserSettingsPage
