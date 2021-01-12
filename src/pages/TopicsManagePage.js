import React from 'react'
import Layout from '../components/Layout'
import ManageTopic from '../components/ManageTopic'
import '../App.css'
import { Link } from 'react-router-dom'

function TopicsManagePage(props) {
  console.log(props.location.topic_id)

  var topic_id;
  if (props.location.topic_id != undefined) {
    localStorage.setItem('currentTopic', props.location.topic_id)
    topic_id = props.location.topic_id
  } else {
    topic_id = localStorage.getItem('currentTopic')
  }

  return (
    <Layout
      navtype='teacher'
      body={
        <ManageTopic
        topic_id={topic_id}/>
      }
    />
  )
}

export default TopicsManagePage
