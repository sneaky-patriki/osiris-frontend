import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function TopicProgressPage(props) {

  var class_id
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  var topic_id
  if (props.location.topic_id != undefined) {
    topic_id = props.location.topic_id
    localStorage.setItem('currentTopic', topic_id)
  } else {
    topic_id = localStorage.getItem('currentTopic')
  }

  const [cls, setClass] = React.useState({
    class_id: 0,
    name: "",
    course: {
      topics: []
    },
    teachers: [],
    students: [],
    progress: [],
  })
  const [topic, setTopic] = React.useState({
    name: '',
    topic_id: 0,
    taskgroups: []
  })

  const token = React.useContext(AuthContext)

  const fetchClassData = () => {
    const getCourse = axios.get('/classes/topic/details', {params: { token, class_id, topic_id }})
      .then((classResponse) => {
        const classData = classResponse.data.class
        console.log(classData)
        setClass(classData)
      })
      .catch((err) => {})
  }

  const fetchTopicData = () => {
    const getTopic = axios.get('/topics/details', {params: { token, topic_id }})
    .then((topicResponse) => {
      const topicData = topicResponse.data.topic
      console.log(topicData)
      setTopic(topicData)
      fetchClassData()
    })
  }

  const step1 = useStep(fetchClassData, [], 1)
  const step2 = useStep(fetchTopicData, [], 1)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Progress Report</h1>
        </div>

        <hr/>

        <h4>Class</h4>
        <Link to={{
          pathname: '/classes/manage',
          class_id: cls.class_id
        }}>{cls.name}</Link>
        <h4>Course</h4>
        <Link to={{
          pathname: '/courses/manage',
          course_id: cls.course.course_id
        }}>{cls.course.name}</Link>
        <h4>Topic</h4>
        <Link to={{
          pathname: '/classes/progress',
          topic_id: topic.topic_id,
          class_id: cls.class_id
        }}>{topic.name}</Link>

        <table id="taskgroupProgress">
          <thead>
            <td><h4>Student</h4></td>
            {topic.taskgroups.map(({ taskgroup_id, name }, index) => (
              <td class='topicName'><Link to={{
                pathname: '/classes/topics/taskgroups/progress',
                class_id: cls.class_id,
                taskgroup_id: taskgroup_id
              }}>{name}</Link></td>
            ))}
          </thead>
          {cls.students.map(({ username, name, progress }, index) => (
            <tr>
              <td><Link to={{
                  pathname: '/students/progress',
                  student_id: username,
                  course_id: cls.course.course_id,
                  class_id: cls.class_id
              }}>{name}</Link></td>
                {progress.map(({ taskgroup, progress }, index) => (
                <td>
                  <div className='progressDash'>
                    <div className='unmarkedDash' style={{width: progress.unmarked + '%'}}></div>
                    <div className='correctDash' style={{width: progress.correct + '%'}}></div>
                    <div className='incorrectDash' style={{width: progress.incorrect + '%'}}></div>
                  </div>
                </td>
                ))}
            </tr>
          ))}
        </table>
      </>
    }/>
  )
}

export default TopicProgressPage
