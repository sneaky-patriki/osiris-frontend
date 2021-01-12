import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'
import ViewCourse from '../components/ViewCourse'

function CoursesViewPageTeacher(props) {

  var course_id
  if (props.location.course_id != undefined) {
    course_id = props.location.course_id
    localStorage.setItem('currentCourse', props.location.course_id)
  } else {
    course_id = localStorage.getItem('currentCourse')
  }

  return (
    <Layout navtype='teacher' body={
      <ViewCourse course_id={course_id} user_type='teacher' />
  }/>
  )

}

export default CoursesViewPageTeacher
