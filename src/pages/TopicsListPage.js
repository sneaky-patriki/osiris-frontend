import React from 'react'
import Layout from '../components/Layout'
import TopicsList from '../components/TopicsList'
import '../App.css'
import { Link } from 'react-router-dom'

function TopicsListPage(props) {
  return (
    <Layout
      navtype='teacher'
      body={
        <>
          <div class='headerSection'>
              <h1>Topics</h1>

              <Link to='/topics/add'><div className='teacherButton'>Add Topic
              </div></Link>
          </div>

          <hr />

          <TopicsList/>
        </>
      }
    />
  );
}

export default TopicsListPage
