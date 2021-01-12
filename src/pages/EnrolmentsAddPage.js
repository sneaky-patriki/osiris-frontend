import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function EnrolmentsAddPage(props) {

  const token = React.useContext(AuthContext)
  const [students, setStudents] = React.useState([])

  var class_id;
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  const fetchStudentData = () => {
    const getTeachers = axios.get('/users/students/other', {params: { token, class_id }} )
      .then((studentResponse) => {
        const studentData = studentResponse.data.students
        console.log(studentData)
        setStudents(studentData)
      })
      .catch((err) => {})
  }

  function handleSubmit(event) {
    event.preventDefault()

    const username = event.target[0].value

    axios.post('/classes/enrolments/add', { token, class_id, username })
    .then((response) => {
      const data = response.data
      console.log(data)
      props.history.push('/classes/manage')
    })
    .catch((err) => {})
  }

  const step = useStep(fetchStudentData, [], 2)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h4 id="className"></h4>
            <h1>Classes</h1>
        </div>
        <hr/>

        <form name='addEnrolmentForm' onSubmit={handleSubmit}>
            <select id='students'>
            {students.map(({username, name}, index) => (
              <option value={username}>{name}</option>
            ))}
            </select><br/>
            <input type='submit' value='Add Enrolment' />
            <Link to='/classes/manage'>Cancel</Link>
        </form>
      </>
    }/>

  )

}

export default EnrolmentsAddPage
