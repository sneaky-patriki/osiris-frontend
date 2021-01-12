import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function TaskgroupsAddPage(props) {

  const token = React.useContext(AuthContext)

  var topic_id;
  if (props.location.topic_id != undefined) {
    localStorage.setItem('currentTopic', props.location.topic_id)
    topic_id = props.location.topic_id
  } else {
    topic_id = localStorage.getItem('currentTopic')
  }

  function handleSubmit(event) {
    event.preventDefault()
    console.log(token)

    const name = event.target[0].value
    const submit_multiple = event.target[1].checked

    console.log(submit_multiple)

    axios.post('/taskgroups/add', { token, topic_id, name, submit_multiple })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/topics/manage')
      })
      .catch((err) => {})
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Task Groups</h1>
            <h2>Topic: {props.location.topic_name}</h2>
        </div>
        <hr/>

        <form name='addTaskGroupForm' onSubmit={handleSubmit}>
            <input type='text' placeholder='*Title' name='name' /><br/>
            <h4>Allow submissions for multiple tasks</h4>
            <input type='checkbox' name='can_submit' /><br/>
            <input type='submit' value='Create Task Group' />
        </form>

        <br/>
        <Link to='/topics/manage'>Cancel</Link>
      </>
    }/>
  )
}

export default TaskgroupsAddPage;
