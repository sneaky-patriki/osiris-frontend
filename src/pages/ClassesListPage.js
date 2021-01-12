import React from 'react'
import Layout from '../components/Layout'
import ClassesList from '../components/ClassesList'
import '../App.css'
import { Link } from 'react-router-dom'

function ClassesListPage(props) {
  return (
    <Layout
      navtype='teacher'
      body={
        <>
          <div class='headerSection'>
              <h1>Classes</h1>

              <Link to='/classes/add'><div className='teacherButton'>Add Class
              </div></Link>
          </div>

          <hr />

          <ClassesList/>
        </>
      }
    />
  );
}

export default ClassesListPage;
