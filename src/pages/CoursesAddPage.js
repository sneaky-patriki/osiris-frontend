import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function CoursesAddPage(props) {
  const token = React.useContext(AuthContext)

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value

    axios.post('/courses/add', { token, name })
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

        <form name='addCoursesForm' onSubmit={handleSubmit}>
            <input type='text' placeholder='*Title' name='name' /><br/>
            <input type='submit' value='Create Course' />
            <Link to='/courses'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default CoursesAddPage
