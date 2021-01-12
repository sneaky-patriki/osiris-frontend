import React from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function StudentDashboardPage(props) {

  const [classes, setClasses] = React.useState([])
  const token = React.useContext(AuthContext)

  const fetchClassesData = () => {
    const getClasses = axios.get('/classes/student', {params: { token }})
      .then((classResponse) => {
        const classData = classResponse.data.classes
        console.log(classData)
        setClasses(classData)
      })
      .catch((err) => {})
  }

  const step = useStep(fetchClassesData, [], 2)

  return (
    <Layout navtype='student'
    body={
      <>
        <div class='headerSection'>
            <h1>Dashboard</h1>
        </div>

        <hr/>

        <div id='enrolments'>
            <h3>My Enrolments</h3>
            {classes.map(({ class_id, course, name, teachers, progress }, index) => (
              <div className='enrolmentBox'>
                <h3>{name}</h3> with {
                  teachers.map(({name}, index) => (<>{name}{ (index != teachers.length - 1) ? ', ' : ''} </>))
                }
                <div className='progressDash'>
                  <div className='unmarkedDash' style={{width: progress.course.unmarked + '%'}}></div>
                  <div className='correctDash' style={{width: progress.course.correct + '%'}}></div>
                  <div className='incorrectDash' style={{width: progress.course.incorrect + '%'}}></div>
                </div>
                <div className='studentButton'>
                  <Link to={{
                    pathname: '/courses/view/student',
                    course_id: course.course_id,
                  }}>View Class</Link></div>
              </div>
            ))}
        </div>

        <div class='viewAllClasses'>
            You can view other classes and submit for activities, but they will not be marked.
            <br/><br/>
            <div className='studentButton'>
              <Link to={{
                  pathname: '/classes/view/student'
              }}>View all Classes</Link>
            </div>
        </div>
      </>
    }/>
  )
}

export default StudentDashboardPage
