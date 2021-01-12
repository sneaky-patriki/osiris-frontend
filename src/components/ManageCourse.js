import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { startReorder, finishReorder } from '../utils/helperFunctions'

function ManageCourse({ course_id }, ...props) {

  const [course, setCourse] = React.useState({
    course_id: 0,
    name: "",
    modules: [],
    classes: []
  })

  const token = React.useContext(AuthContext)

  const fetchCourseData = () => {
    const getCourse = axios.get('/courses/details', {params: { token, course_id }})
      .then((courseResponse) => {
        const courseData = courseResponse.data.course
        console.log(courseData)
        setCourse(courseData)
      })
      .catch((err) => {})
  }

  function removeTopic(module_id) {
      axios.delete('/courses/topics/remove', {data: { token, module_id }})
        .then((response) => {
          const data = response.data
          console.log(data)
          window.location.reload()
        })
        .catch((err) => {})
  }

  function reorderTopics() {
    var element = document.getElementById('reorderTopicsButton')

    if (element.name == 'notReordering' || element.name == undefined) {
      element.name = 'reordering'
      element.style.backgroundColor = '#dd514c'
      element.style.color = 'white'
      element.innerHTML = 'Finish Reordering'

      startReorder('#topicList tr')
    } else {
      element.name = 'notReordering'
      element.innerHTML = 'Reorder Topics'
      element.style.backgroundColor = 'white'
      element.style.color = 'black'

      finishReorder('#topicList tr')

      var tableRows = document.querySelectorAll('#topicList tr')
      var newTopicList = []

      for (var row = 0; row < tableRows.length; row++) {
        newTopicList.push(tableRows[row].id)
      }

      console.log(newTopicList)

      var course_id = course.course_id
      axios.put('/courses/topics/reorder', { token, course_id, newTopicList })
        .then((response) => {
          window.location.reload()
        })
        .catch((err) => {})
    }
  }

  const step = useStep(fetchCourseData, [], 2)

  return (
    <>
      <div className='headerSection'>
        <h1>Courses</h1>
      </div>

      <h4>Title</h4>
      <p id='courseTitle'>{course.name}</p>
      <h4>Classes</h4>
      <p id='courseClasses'>{course.classes.map(({ class_id, name}, index) => (
        <>
          <Link to={{
            pathname: '/classes/manage',
            class_id: class_id
          }}>{name}</Link>{ (index != course.classes.length - 1) ? ', ':''}
        </>
      ))}</p>

      <h2>Topics</h2>
      <Link to={{
        pathname: '/courses/topics/add',
        course_id: course_id,
        course_name: course.name
      }}>
        <div class='teacherButton'>Add Topic</div>
      </Link>
      <div class='teacherButton' id='reorderTopicsButton' onClick={reorderTopics} name='notReordering'>Reorder Topics</div>

      <hr />

      <table id='topicList'>
          <thead><td>Name</td><td>Topic</td><td>Actions</td></thead>
          {course.modules.map(({ topic_id, topic_name, module_id, module_name }, index) => (
            <tr id={module_id}>
              <td>{module_name}</td>
              <td>{topic_name}</td>
              <td>
                <Link to={{
                  pathname: '/courses/topics/rename',
                  module_id: module_id,
                  module_name: module_name
                }}>Rename </Link>
                <Link to={{
                  pathname: '/topics/manage',
                  topic_id: topic_id,
                }}>Manage </Link>
                <Link onClick={() => removeTopic(module_id)}>Remove</Link>
              </td>
            </tr>
          ))}
      </table>

    </>
  )

}

export default ManageCourse;
