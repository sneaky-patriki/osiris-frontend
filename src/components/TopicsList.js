import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function TopicsList() {
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

  function deleteTopic(topic_id) {

    axios.delete('/topics/delete', { data: { token, topic_id }})
      .then((response) => {
        const data = response.data
        window.location.reload()
      })
      .catch((err) => {})
  }

  const step = useStep(fetchTopicsData, [], 2)

  return (
    <>
      <table id='topicsList'>
        <thead>
          <tr>
            <td>Topic</td><td>Courses</td><td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {topics.map(({ topic_id, name, courses}, index) => (
            <tr>
              <td>{name}</td><td>{courses.map(({ course_id, name }, index ) => (
                <>
                  <Link to={{
                    pathname: '/courses/manage',
                    course_id: course_id
                  }}>{name}</Link>{(index != courses.length - 1) ? ', ' : ''}
                </>
              ))}</td>
              <td>
                <Link to={{
                  pathname: '/topics/manage',
                  topic_id: topic_id
                }}>Manage </Link>
                <Link to={{
                  pathname: '/topics/edit',
                  topic_id: topic_id,
                  topic_name: name
                }}>Edit </Link>
                <Link to='/topic/duplicate'>Duplicate </Link>
                <Link onClick={() => deleteTopic(topic_id)}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </>
  );
}

export default TopicsList;
