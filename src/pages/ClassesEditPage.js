import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function ClassesEditPage(props) {

  const [cls, setClass] = React.useState({
    class_id: 0,
    name: '',
    year: '',
    teachers: []
  })
  const [newTeacher, setNewTeacher] = React.useState(false)
  const [teachers, setTeachers] = React.useState([])
  const token = React.useContext(AuthContext)
  var [teachersRemoved, setTeachersRemoved] = React.useState([])

  var class_id;
  console.log(props.location.class_id)
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  const fetchClassData = () => {
    const getCourse = axios.get('/classes/details', {params: { token, class_id }})
      .then((classResponse) => {
        const classData = classResponse.data.class
        console.log(classData)
        setClass(classData)
      })
      .catch((err) => {})
  }

  const fetchTeacherData = () => {
    console.log(cls.teachers)
    var class_id = cls.class_id
    const getTeachers = axios.get('/users/teachers/other', {params: { token, class_id }} )
      .then((teacherResponse) => {
        const teacherData = teacherResponse.data.teachers
        console.log(teacherData)
        setTeachers(teacherData)
      })
      .catch((err) => {})
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value
    const year = event.target[1].value

    var teachers = []

    console.log(cls.teachers)

    for (var i = 0; i < cls.teachers.length; i++) {
      console.log(teachersRemoved.includes(cls.teachers[i]))
      if (teachersRemoved.includes(cls.teachers[i].username) != true) {
        teachers.push(cls.teachers[i].username)
      }
    }

    if (newTeacher) {
      teachers.push(event.target[event.target.length - 2].value)
    }

    console.log(teachers, teachersRemoved)
    axios.put('/classes/edit', { token, class_id, name, year, teachers })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/classes')
      })
      .catch((err) => {})
  }

  function addNewTeacher() {
    setNewTeacher(true)
  }

  function removeNewTeacher() {
    setNewTeacher(false)
  }

  function removeTeacher(username) {
    teachersRemoved.push(username)
    document.getElementById(username).style.display = 'none'
  }

  const step1 = useStep(fetchClassData, [], 1)
  const step2 = useStep(fetchTeacherData, [], 3)

  var newTeacherSection;
  if (newTeacher) {
    console.log(teachers)
    newTeacherSection = (
      <div className='attachment'>
        <select name='teacher'>
        {teachers.map(({ username, name }, index) => (
          <option value={username}>{name}</option>
        ))}
        </select>
        <Link onClick={removeNewTeacher}>Remove Teacher</Link>
      </div>
    )
  } else {
    newTeacherSection = <></>
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Classes</h1>
        </div>
        <hr/>

        <div onClick={addNewTeacher} class='teacherButton'>Add Teacher</div>


        <form name='editClassForm' onSubmit={handleSubmit}>
            <input type='text' defaultValue={cls.name} name='name' /><br/>
            <input type='text' defaultValue={cls.year} name='year' /><br/>
            <div id='teachers'>
            {cls.teachers.map(({username, name}, index) => (
              <div className='attachment' id={username}>
                {name}<br/>
                <Link onClick={() => removeTeacher(username)}>Remove Teacher</Link>
              </div>
            ))}
            {newTeacherSection}
            </div>
            <input type='submit' value='Update Class' />
            <Link to='/classes'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default ClassesEditPage
