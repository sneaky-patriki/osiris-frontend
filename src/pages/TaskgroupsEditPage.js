import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function TaskgroupsEditPage(props) {

  const token = React.useContext(AuthContext)

  var taskgroup_id;
  if (props.location.taskgroup_id != undefined) {
    localStorage.setItem('currentTaskgroup', props.location.taskgroup_id)
    taskgroup_id = props.location.taskgroup_id
  } else {
    taskgroup_id = localStorage.getItem('currentTaskgroup')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value

    axios.put('/taskgroups/edit', { token, taskgroup_id, name })
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

        <form name='editTaskGroupForm' onSubmit={handleSubmit}>
            <input type='text' name='name' defaultValue={props.location.taskgroup_name}/><br/>
            <input type='submit' value='Update Task Group' />
            <Link to='/topics/manage'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default TaskgroupsEditPage
