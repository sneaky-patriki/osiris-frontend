import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function ClassesList() {

  const [classes, setClasses] = React.useState([])
  const token = React.useContext(AuthContext)

  const fetchClassesData = () => {
    const getClasses = axios.get('/classes/list', {params: { token }})
      .then((classResponse) => {
        const classData = classResponse.data.classes
        console.log(classData)
        setClasses(classData)
      })
      .catch((err) => {})
  }

  function deleteClass(class_id) {
    axios.delete('/classes/delete', {data: { token, class_id }})
      .then((response) => {
        const data = response.data
        window.location.reload()
      })
      .catch((err) => {})
  }

  const step = useStep(fetchClassesData, [], 2)

  return (
    <div>
        <table id='classList'>
            <tr><td>Title</td><td>Year</td><td>Course</td><td>Teachers</td><td>Actions</td></tr>
            {classes.map(({ class_id, name, year, course, teachers }, index) => (
              <tr>
                <td>{name}</td>
                <td>{year}</td>
                <td><Link to={{
                  pathname: '/courses/manage',
                  course_id: course.course_id
                }}>{course.name}</Link></td>
                <td>{teachers.map((name, index) => (<>{name}{ (index != teachers.length - 1) ? ', ':  ''}</>))}</td>
                <td>
                  <Link to={{
                    pathname: '/classes/manage',
                    class_id: class_id
                  }}>Manage </Link>
                  <Link to={{
                    pathname: '/classes/edit',
                    class_id: class_id,
                  }}>Edit </Link>
                  <Link onClick={() => deleteClass(class_id)}>Delete</Link>
                </td>
              </tr>
            ))}
        </table>
    </div>
  );
}

export default ClassesList;
