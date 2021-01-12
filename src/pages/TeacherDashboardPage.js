import React from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function TeacherDashboardPage(props) {

  const [classes, setClasses] = React.useState([])
  const [name, setName] = React.useState([])
  const token = React.useContext(AuthContext)

  const fetchClassesData = () => {
    const getClasses = axios.get('/classes/teacher', {params: { token }})
      .then((classResponse) => {
        const classData = classResponse.data.classes
        const nameData = classResponse.data.name
        console.log(classData)
        setClasses(classData)
        setName(nameData)
      })
      .catch((err) => {})
  }

  const step = useStep(fetchClassesData, [], 2)

  return (
    <Layout
      navtype="teacher"
      body={
        <>
          <div className='teacherDashboardSection'>
              <h1>Dashboard</h1>
              <p>Welcome to Osiris, {name}.</p>
              <h3>My Classes</h3>
              <hr />
              <table id='myClasses'>
                  <tr><td>Name</td><td>Actions</td></tr>
                  {classes.map(({ class_id, name }, index) => (
                    <tr>
                      <td>{name}</td>
                      <td><Link to={{
                        pathname: '/classes/manage',
                        class_id: class_id
                      }}>Manage</Link></td>
                    </tr>
                  ))}
              </table>
          </div>

          <div className='teacherDashboardSection'>
              <h3>Recent Submissions</h3>
              <hr />
              <table id='recentSubmissions'>
                  <tr><td>Student</td><td>Task</td><td>Actions</td></tr>
                  {classes.map(({ submissions }, index) => (
                    <>
                      {submissions.map(({ submission_id, student, task}, index) => (
                        <tr>
                          <td>{student.name}</td>
                          <td>{task.name}</td>
                          <td><Link to={{
                            pathname: '/submissions/mark',
                            submission_id: submission_id
                          }}>View Submission</Link></td>
                        </tr>
                      ))}
                    </>
                  ))}
              </table>
          </div>
        </>

      }
    />
  );
}

export default TeacherDashboardPage
