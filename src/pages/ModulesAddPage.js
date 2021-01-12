import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function ModulesAddPage(props) {

  var course_id
  if (props.location.course_id != undefined) {
    course_id = props.location.course_id
    localStorage.setItem('currentCourse', course_id)
  } else {
    course_id = localStorage.getItem('currentCourse')
  }

  const [topics, setTopics] = React.useState([])
  const token = React.useContext(AuthContext)

  const fetchTopicsData = () => {
    const getTopics = axios.get('/topics/list', {params: { token }})
      .then((topicResponse) => {
        const topicData = topicResponse.data.topics
        console.log(topicData)
        setTopics(topicData)
      }
    );
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value
    const topic_id = event.target[1].value

    axios.post('/courses/topics/add', { token, course_id, topic_id, name })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/courses/manage')
      })
      .catch((err) => {})
  }

  const step = useStep(fetchTopicsData, [], 2)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Topics</h1>
        </div>
        <hr/>

        <form name='addModuleForm' onSubmit={handleSubmit}>
            <input type='text' placeholder='*Title' name='name' /><br/>
            <select name='topic'>
            {topics.map(({ topic_id, name}, index) => (
              <option value={topic_id}>{name}</option>
            ))}
            </select><br/>
            <input type='submit' value='Add Topic' /><br/><br/>
            <Link to='/courses/manage'>Cancel</Link>
        </form>
      </>
    }/>)
}

export default ModulesAddPage
