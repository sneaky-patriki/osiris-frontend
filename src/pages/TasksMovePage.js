import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function TasksMovePage(props) {

  const [topic, setTopic] = React.useState({ name: "", topic_id: 0, taskgroups: []})
  const token = React.useContext(AuthContext)

  var topic_id;
  if (props.location.topic_id != undefined) {
    localStorage.setItem('currentTopic', props.location.topic_id)
    topic_id = props.location.topic_id
  } else {
    topic_id = localStorage.getItem('currentTopic')
  }

  var task_id;
  if (props.location.task_id != undefined) {
    localStorage.setItem('currentTask', props.location.task_id)
    task_id = props.location.task_id
  } else {
    task_id = localStorage.getItem('currentTask')
  }

  const fetchTopicData = () => {
    const getTopic = axios.get('/topics/details', {params: { token, topic_id }})
    .then((topicResponse) => {
      const topicData = topicResponse.data.topic
      console.log(topicData)
      setTopic(topicData)
      console.log(topic)
    })
  }

  const step = useStep(fetchTopicData, [], 2)

  function handleSubmit(event) {
    event.preventDefault()
    console.log(event.target)
    const newTaskgroup = event.target[0].value

    axios.put('/tasks/move', { token, task_id, newTaskgroup })
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
            <h4>{props.location.topic_name}</h4>
            <h1>Tasks</h1>
        </div>
        <hr/>

        <form onSubmit={handleSubmit} >
          <h4>Task Group</h4>
          <select id='task_id'>
          {topic.taskgroups.map(({ taskgroup_id, name }, index) => (
            <option value={taskgroup_id}>{name}</option>
          ))}
          </select><br/>
          <input type='submit' value='Move Task'/>
        </form>

        <Link to='/topics/manage'>Cancel</Link>
      </>
    }/>
  )
}

export default TasksMovePage;
