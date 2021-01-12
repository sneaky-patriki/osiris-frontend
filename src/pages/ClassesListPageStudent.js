import React from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import ClassesList from '../components/ClassesList'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { Link } from 'react-router-dom'

function ClassesListPageStudent(props) {
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

    const step = useStep(fetchClassesData, [], 2)

    return (
        <Layout navtype='student' body={
          <>
              <div class='headerSection'>
                  <h1>All Classes</h1>
              </div>
              <hr/>
              {classes.map(({ class_id, course, name, teachers, progress }, index) => (
                <div className='enrolmentBox'>
                  <h3>{name}</h3> with {
                    teachers.map((name, index) => (<>{name}{ (index != teachers.length - 1) ? ', ' : ''} </>))
                  }

                  <div className='studentButton'>
                    <Link to={{
                      pathname: '/courses/view/student',
                      course_id: course.course_id,
                    }}>View Class</Link></div>
                </div>
              ))}
        </>
      }/>
    );
}

export default ClassesListPageStudent
