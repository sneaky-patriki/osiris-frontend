import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function TopicsEditPage(props) {

  const token = React.useContext(AuthContext)

  var topic_id;
  console.log(props.location.topic_id)
  if (props.location.topic_id != undefined) {
    topic_id = props.location.topic_id
    localStorage.setItem('currentTopic', topic_id)
  } else {
    topic_id = localStorage.getItem('currentTopic')
  }
  console.log(topic_id)

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value

    axios.put('/topics/edit', { token, topic_id, name })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/topics')
      })
      .catch((err) => {})
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Topics</h1>
        </div>
        <hr/>

        <form name='editTopicForm' onSubmit={handleSubmit}>
            <input type='text' defaultValue={props.location.topic_name} name='name' /><br/>
            <input type='submit' value='Update Topic' />
            <Link to='/topics'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default TopicsEditPage
