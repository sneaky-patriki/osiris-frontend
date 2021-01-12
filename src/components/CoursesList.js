import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { getTimeDifference } from '../utils/helperFunctions'

function CoursesList() {
  const [courses, setCourses] = React.useState([])
  const [currentTime, setCurrentTime] = React.useState([])
  const token = React.useContext(AuthContext)

  const fetchCoursesData = () => {
    const getCourses = axios.get('/courses/list', {params: { token }})
      .then((courseResponse) => {
        const courseData = courseResponse.data.courses
        const timeData = courseResponse.data.currentTime
        console.log(courseData, timeData)
        setCourses(courseData)
        setCurrentTime(timeData)
      })
  }

  function deleteCourse(course_id) {

    axios.delete('/courses/delete', { data: { token, course_id }})
      .then((response) => [
        window.location.reload()
      ])
      .catch((err) => {})
  }

  const step = useStep(fetchCoursesData, [], 2)

  return (
    <>
      <table id='coursesList'>
        <thead>
          <tr>
            <td>Course</td><td>Last Modified</td><td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {courses.map(({ course_id, name, modified}, index) => (
            <tr>
              <td><Link to={{
                pathname: '/courses/view/teacher',
                course_id: course_id
              }}>{name}</Link></td>
              <td>{getTimeDifference(modified, currentTime)}</td>
              <td>
                <Link to={{
                  pathname: '/courses/manage',
                  course_id: course_id
                }}>Manage </Link>
                <Link to={{
                  pathname: '/courses/edit',
                  course_id: course_id,
                  course_name: name
                }}>Edit </Link>
                <Link onClick={() => deleteCourse(course_id)}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  </>
  )
}

export default CoursesList;
