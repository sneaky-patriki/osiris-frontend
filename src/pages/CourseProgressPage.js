import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function CourseProgressPage(props) {

  var class_id
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  const token = React.useContext(AuthContext)

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
  const [topics, setTopics] = React.useState([])

  const fetchClassData = () => {
    const getCourse = axios.get('/classes/details', {params: { token, class_id }})
      .then((classResponse) => {
        const classData = classResponse.data.class
        console.log(classData)
        setClass(classData)
      })
      .catch((err) => {})
  }

  const step = useStep(fetchClassData, [], 1)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Progress Report</h1>
        </div>

        <div className='teacherButton'>
          <Link to={{
            pathname: '/classes/progress/difficulty',
            class_id: class_id
          }}>Difficulty Report</Link>
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

        <table id="topicProgress">
          <thead>
            <td><h4>Student</h4></td>
            {cls.course.topics.map(({ topic_id, name }, index) => (
              <td class='topicName'><Link to={{
                pathname: '/classes/topics/progress',
                class_id: cls.class_id,
                topic_id: topic_id
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
              {progress.map(({ module, progress }, index) => (
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

export default CourseProgressPage
