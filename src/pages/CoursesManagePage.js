import React from 'react'
import Layout from '../components/Layout'
import ManageCourse from '../components/ManageCourse'
import '../App.css'
import { Link } from 'react-router-dom'

function CoursesManagePage(props) {

  var course_id
  if (props.location.course_id != undefined) {
    course_id = props.location.course_id
    localStorage.setItem('currentCourse', course_id)
  } else {
    course_id = localStorage.getItem('currentCourse')
  }

  return (
    <Layout
      navtype='teacher'
      body={
        <ManageCourse course_id={course_id} />
      }/>
  )

}

export default CoursesManagePage
