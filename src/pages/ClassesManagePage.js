import React from 'react'
import Layout from '../components/Layout'
import ManageClass from '../components/ManageClass'
import '../App.css'
import { Link } from 'react-router-dom'

function ClassesManagePage(props) {

  var class_id
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  return (
    <Layout
      navtype='teacher'
      body={
        <ManageClass class_id={class_id} />
      }/>
  )

}

export default ClassesManagePage
