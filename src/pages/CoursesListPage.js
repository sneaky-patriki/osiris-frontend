import React from 'react'
import Layout from '../components/Layout'
import CoursesList from '../components/CoursesList'
import '../App.css'
import { Link } from 'react-router-dom'

function CoursesListPage(props) {
  return (
    <Layout
      navtype='teacher'
      body={
        <>
          <div class='headerSection'>
              <h1>Courses</h1>

              <Link to='/courses/add'><div className='teacherButton'>Add Course
              </div></Link>
          </div>

          <hr />

          <CoursesList/>
        </>
      }
    />
  );
}

export default CoursesListPage
