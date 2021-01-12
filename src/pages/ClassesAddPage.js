import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function ClassesAddPage(props) {

  const token = React.useContext(AuthContext)

  const [courses, setCourses] = React.useState([])

  const fetchCoursesData = () => {
    const getCourses = axios.get('/courses/list', {params: { token }})
      .then((courseResponse) => {
        const courseData = courseResponse.data.courses
        console.log(courseData)
        setCourses(courseData)
      })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value
    const year = event.target[1].value
    const course = event.target[2].value

    axios.post('/classes/add', { token, name, year, course })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/classes')
      })
      .catch((err) => {})
  }

  const step = useStep(fetchCoursesData, [], 2)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Classes</h1>
        </div>
        <hr/>

        <form name='addClassForm' onSubmit={handleSubmit}>
            <input type='text' placeholder='*Title' name='name' /><br/>
            <input type='text' placeholder='Year' defaultValue='2020' name='year' /><br/>
            <select name='courses'>
            {courses.map(({course_id, name}, index) => (
              <option value={course_id}>{name}</option>
            ))}
            </select><br/>
            <input type='submit' value='Create Class' />
            <Link to='/classes'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default ClassesAddPage
