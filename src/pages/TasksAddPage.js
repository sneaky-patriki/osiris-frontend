import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function TasksAddPage(props) {

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
    console.log(event.target)
    const name = event.target[0].value
    const type = event.target[1].value
    const difficulty = event.target[2].value
    const description = event.target[3].value
    const hint = event.target[4].value
    const solution = event.target[5].value

    axios.post('/tasks/add', { token, taskgroup_id, name, difficulty, type, description, hint, solution })
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
            <h1>Tasks</h1>
            <h2>Topic: {props.location.topic_name}</h2>
            <h2>Task Group: {props.location.taskgroup_name}</h2>
        </div>
        <hr/>

        <form name='addTask' onSubmit={handleSubmit}>
          <input type='text' placeholder='*Title' name='name' /><br/><br/>

          <h4>Task Type</h4>
          <select id='type'>
            <option value='standard'>Standard</option>
            <option value='content'>Content only (no answer)</option>
            <option value='multiple-choice-single'>Multiple Choice (Single Answer)</option>
            <option value='multiple-choice-multiple'>Multiple Choice (Multiple Answers)</option>
            <option value='short-answer'>Short Answer</option>
          </select>
          <br/>

          <h4>*Difficulty</h4><br/>

          <select id="difficulty">
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value='Platinum'>Platinum</option>
              <option value='Kryptonite'>Kryptonite</option>
              <option value='Unspecified'>Unspecified</option>
          </select><br/><br/>

          <textarea name='description' placeholder="Description"></textarea><br/><br/>

          <textarea name='hint' placeholder="Hint"></textarea><br/><br/>

          <textarea name='solution' placeholder="Solution"></textarea><br/><br/>

          <input type='submit' value='Create Task' />
          <Link to='/topics/manage'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default TasksAddPage;
