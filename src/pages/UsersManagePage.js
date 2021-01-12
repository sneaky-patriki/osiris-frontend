import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function UsersManagePage(props) {

  const [students, setStudents] = React.useState([])
  const [teachers, setTeachers] = React.useState([])
  const token = React.useContext(AuthContext)

  const fetchUsersData = () => {
      const getUsers = axios.get('/users/listall', {params: { token }})
      .then((userResponse) => {
          const studentData = userResponse.data.students
          const teacherData = userResponse.data.teachers
          setStudents(studentData)
          setTeachers(teacherData)
      })
  }

  function handleSubmit(event) {
    event.preventDefault()

  }

  function deleteUser(username) {
      axios.delete('/users/delete', {data: {token, username}})
        .then((response) => {
            const data = response.data
        })
        .catch((err) => {})
  }

  const step = useStep(fetchUsersData, [], 1)

  return (
    <Layout navtype='teacher' body={
      <>
          <div class='headerSection'>
              <h1>Users</h1>
          </div>

          <h2>Teachers</h2>
          <Link to={{
              pathname: '/users/import',
              importType: 'teacher'
          }}>
            <div className='teacherButton'>Import Teachers</div>
          </Link>

          <hr/>

          <table id='teacherList'>
            <thead><td>Username</td><td>Name</td><td>Classes</td><td>Actions</td></thead>
            {teachers.map(({ username, name, classes }, index) => (
                <tr>
                  <td>{username}</td>
                  <td>{name}</td>
                  <td>{classes.map((name, index) => (
                      <>{name}{ (index != classes.length - 1) ? ", " : ""}</>
                  ))}</td>
                  <td><Link onClick={() => deleteUser(username)}>Delete</Link></td>
                </tr>
            ))}
          </table>

          <h2>Students</h2>
          <Link to={{
              pathname: '/users/import',
              importType: 'student'
          }}>
            <div className='teacherButton'>Import Students</div>
          </Link>

          <hr/>

          <table id='studentList'>
            <thead><td>Username</td><td>Name</td><td>Classes</td><td>Actions</td></thead>
            {students.map(({ username, name, classes }, index) => (
                <tr>
                  <td>{username}</td>
                  <td>{name}</td>
                  <td>{classes.map((name, index) => (
                      <>{name}{ (index != classes.length - 1) ? ", " : ""}</>
                  ))}</td>
                  <td><Link onClick={() => deleteUser(username)}>Delete</Link></td>
                </tr>
            ))}
          </table>

      </>
    }/>
  )

}

export default UsersManagePage
