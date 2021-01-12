import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { startReorder, finishReorder } from '../utils/helperFunctions'

function ManageClass({ class_id }, ...props) {

  const [cls, setClass] = React.useState({
    class_id: 0,
    name: "",
    course: 0,
    teachers: [],
    students: []
  })

  const token = React.useContext(AuthContext)

  const fetchClassData = () => {
    const getCourse = axios.get('/classes/details', {params: { token, class_id }})
      .then((classResponse) => {
        const classData = classResponse.data.class
        console.log(classData)
        setClass(classData)
      })
      .catch((err) => {})
  }

  function removeStudent(username) {
    axios.delete('/classes/enrolments/remove', {data: { token, class_id, username }})
      .then((response) => {
        const data = response.data
        window.location.reload()
      })
      .catch((err) => {})
  }

  const step = useStep(fetchClassData, [], 1)

  return (
    <>
      <div class='headerSection'>
          <h1>Classes</h1>
      </div>

      <hr/>

      <h4>Title</h4>
      <p id='classTitle'>{cls.name}</p>
      <h4>Course</h4>
      <Link id='classCourse' to={{
        pathname: '/courses/manage',
        course_id: cls.course.course_id
      }}>{cls.course.name}</Link>
      <h4>Teachers</h4>
      <p id='classTeachers'>
      {cls.teachers.map(({name}, index) => (
        <>
          {name}{(index != cls.teachers.length - 1) ? ', ' : ''}
        </>
      ))}</p>

      <h2>Students</h2>

      <div class='teacherButton' id='progressReportButton'><Link to={{
        pathname: '/classes/progress',
        course_id: cls.course.course_id
      }}>Progress Report</Link></div>

      <div class='teacherButton'>
          <Link to='/classes/enrolments/add'>Add Enrolment</Link>
      </div>
      <div class='teacherButton' id='importEnrolmentsButton'>
          <Link to='/classes/enrolments/import'>Import Enrolments</Link>
      </div>

      <h/>

      <table id='studentList'>
          <tr><td>Name</td><td>Student ID</td><td>Actions</td></tr>
          {cls.students.map(({ username, name }, index) => (
            <tr>
              <td>{name}</td>
              <td>{username}</td>
              <td><Link onClick={() => removeStudent(username)}>Remove</Link></td>
            </tr>
          ))}
      </table>
    </>
  )

}

export default ManageClass
