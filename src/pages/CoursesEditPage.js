import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function CoursesEditPage(props) {

  const token = React.useContext(AuthContext)

  var course_id
  if (props.location.course_id != undefined) {
    course_id = props.location.course_id
    localStorage.setItem('currentCourse', course_id)
  } else {
    course_id = localStorage.getItem('currentCourse')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value

    axios.put('/courses/edit', { token, course_id, name})
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/courses')
      })
      .catch((err) => {})
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Courses</h1>
        </div>
        <hr/>

        <form name='editCourseForm' onSubmit={handleSubmit}>
            <input type='text' defaultValue={props.location.course_name} name='name' /><br/>
            <input type='submit' value='Update Course' />
            <Link to='/courses'>Cancel</Link>
        </form>
      </>
    }/>
  )

}

export default CoursesEditPage
