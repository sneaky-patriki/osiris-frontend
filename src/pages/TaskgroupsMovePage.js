import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import { useStep } from '../utils/update'
import axios from 'axios'

function TaskgroupsMovePage(props) {

  const token = React.useContext(AuthContext)
  const [topics, setTopics] = React.useState([])

  var topic_id;
  if (props.location.topic_id != undefined) {
    localStorage.setItem('currentTopic', props.location.topic_id)
    topic_id = props.location.topic_id
  } else {
    topic_id = localStorage.getItem('currentTopic')
  }

  var taskgroup_id;
  if (props.location.taskgroup_id != undefined) {
    localStorage.setItem('currentTaskgroup', props.location.taskgroup_id)
    taskgroup_id = props.location.taskgroup_id
  } else {
    taskgroup_id = localStorage.getItem('currentTaskgroup')
  }

  const fetchTopicsData = () => {
    const getTopics = axios.get('/topics/list', {params: { token }})
    .then((topicsResponse) => {
      const topicsData = topicsResponse.data.topics
      console.log(topicsData)
      setTopics(topicsData)
    })
  }

  const step = useStep(fetchTopicsData, [], 2)

  function handleSubmit(event) {
    event.preventDefault()
    console.log(event.target)
    const newTopic = event.target[0].value

    axios.put('/taskgroups/move', { token, taskgroup_id, newTopic })
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
        </div>
        <hr/>

        <form onSubmit={handleSubmit} >
          <h4>Task Group</h4>
          <select id='taskgroup_id'>
          {topics.map(({ topic_id, name }, index) => (
            <option value={topic_id}>{name}</option>
          ))}
          </select><br/>
          <input type='submit' value='Move Task Group'/>
        </form>

        <Link to='/topics/manage'>Cancel</Link>
      </>
    }/>
  )
}

export default TaskgroupsMovePage
