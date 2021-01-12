import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { startReorder, finishReorder, getTimeDifference, taskType } from '../utils/helperFunctions'

function ManageTopic({ topic_id }, ...props) {

  const [topic, setTopic] = React.useState({
    name: "", topic_id: 0,
    taskgroups: [], courses: []})
  const [currentTime, setCurrentTime] = React.useState()

  const token = React.useContext(AuthContext)

  const fetchTopicData = () => {

    const getTopic = axios.get('/topics/details', {params: { token, topic_id }})
    .then((topicResponse) => {
      const topicData = topicResponse.data.topic
      const timeData = topicResponse.data.currentTime
      console.log(topicData)
      setTopic(topicData)
      setCurrentTime(timeData)
      console.log(topic)
    })
  }

  function deleteTaskGroup(taskgroup_id) {
    axios.delete('/taskgroups/delete', {data: { token, taskgroup_id }})
      .then((response) => {
        const data = response.data
        window.location.reload()
      })
      .catch((err) => {})
  }

  function deleteTask(task_id) {
    axios.delete('/tasks/delete', {data: { token, task_id }})
      .then((response) => {
        const data = response.data
        window.location.reload()
      })
      .catch((err) => {})
  }

  function reorderTaskGroups() {
    var element = document.getElementById('reorderTaskGroupsButton')

    console.log(element.name)

    if (element.name == 'notReordering' || element.name == undefined) {
      element.name = 'reordering'
      element.style.backgroundColor = '#dd514c'
      element.style.color = 'white'
      element.innerHTML = 'Finish Reordering'

      startReorder('#taskGroupList tr')

    } else {

      element.name = 'notReordering'
      element.innerHTML = 'Reorder Task Groups'
      element.style.backgroundColor = 'white'
      element.style.color = 'black'

      finishReorder('#taskGroupList tr')

      var tableRows = document.querySelectorAll('#taskGroupList tr')
      console.log(tableRows)
      var newTaskGroupList = []

      for (var row = 0; row < tableRows.length; row++) {
        console.log(tableRows[row].id)
        newTaskGroupList.push(tableRows[row].id)
      }

      var topic_id = topic.topic_id
      axios.put('/taskgroups/reorder', { token, topic_id, newTaskGroupList })
        .then((response) => {
          console.log(response)
          window.location.reload()
        })
        .catch((err) => {})

    }

  }

  function reorderTasks(taskgroup_id) {
    var element = document.getElementById('reorderTasksButton' + taskgroup_id)

    if (element.name == 'notReordering' || element.name == undefined) {
      element.name = 'reordering'
      element.style.backgroundColor = '#dd514c'
      element.style.color = 'white'
      element.innerHTML = 'Finish Reordering'

      startReorder('#tasksList' + taskgroup_id + ' tr')

  } else {
      element.name = 'notReordering'
      element.innerHTML = 'Reorder Tasks'
      element.style.backgroundColor = 'white'
      element.style.color = 'black'

      finishReorder('#tasksList' + taskgroup_id + ' tr')

      var tableRows = document.querySelectorAll('#tasksList' + taskgroup_id + ' tr')
      var newTaskList = []

      for (var row = 0; row < tableRows.length; row++) {
        newTaskList.push(tableRows[row].id)
      }

      axios.put('/tasks/reorder', { token, taskgroup_id, newTaskList })
        .then((response) => {
          console.log(response)
          window.location.reload()
        })
        .catch((err) => {})

    }
  }

  const step = useStep(fetchTopicData, [], 2)

  return (
    <>
      <div className='headerSection'>
        <h1>Topics</h1>
      </div>

      <h4>Title</h4>
      <p id='topicTitle'>{topic.name}</p>
      <h4>Courses</h4>
      <p id='topicCourses'>
      {topic.courses.map(({ course_id, name}, index) => (
        <>
          <Link to={{
            pathname: '/courses/manage',
            course_id: course_id
          }}>{name}</Link>{ (index != topic.courses.length - 1) ? ", " : "" }
        </>
      ))}
      </p>

      <h2>Task Groups</h2>
      <Link to={{
        pathname: '/taskgroups/add',
        topic_id: topic_id,
        topic_name: topic.name
      }}>
        <div className='teacherButton'>New Task Group</div>
      </Link>
      <div className='teacherButton' id='reorderTaskGroupsButton' onClick={reorderTaskGroups} name='notReordering'>Reorder Task Groups</div>

      <hr />

      <table id='taskGroupList'>
          <thead><td>Title</td><td>Tasks</td><td>Submission Type</td><td>Last Modified</td><td>Actions</td></thead>
          {topic.taskgroups.map(({ taskgroup_id, name, tasks, modified, submit_multiple}, index) => (
            <tr id={taskgroup_id}>
              <td>{name}</td>
              <td>{tasks.length}</td>
              <td>{ submit_multiple ? 'Multiple Tasks' : 'Single Tasks'}</td>
              <td>{getTimeDifference(modified, currentTime)}</td>
              <td>
                <Link to={{
                  pathname: '/taskgroups/edit',
                  topic_name: topic.name,
                  taskgroup_id: taskgroup_id,
                  taskgroup_name: name
                }}>Edit </Link>
                <Link to={{
                  pathname: '/taskgroups/move',
                  taskgroup_id: taskgroup_id,
                }}>Move </Link>
                <Link onClick={() => deleteTaskGroup(taskgroup_id)}>Delete</Link>
              </td>
            </tr>
          ))}
      </table>

      <div id='tasksList'>
      {topic.taskgroups.map(({taskgroup_id, name, tasks}, index) => (
        <>
          <h3>{name}</h3>
          <div className='teacherButton'>
            <Link to={{
              pathname: '/tasks/add',
              taskgroup_id: taskgroup_id,
              topic_name: topic.name,
              taskgroup_name: name
            }}>New Task</Link>
          </div>
          <div className='reorderTasksButton' id={'reorderTasksButton' + taskgroup_id} onClick={() => reorderTasks(taskgroup_id)}>Reorder Tasks</div>

          <table id={'tasksList' + taskgroup_id}>
            <thead><td>Name</td><td>Difficulty</td><td>Task Type</td><td>Last Modified</td><td>Actions</td></thead>
            {tasks.map(({task_id, name, difficulty, modified, answer_type}, index) => (
              <tr id={task_id}>
                <td><Link to={{
                  pathname: '/tasks/view',
                  task_id: task_id,
                  topic_name: topic.name,
                }}>{name}</Link></td>
                <td>{difficulty}</td>
                <td>{taskType(answer_type)}</td>
                <td>{getTimeDifference(modified, currentTime)}</td>
                <td>
                  <Link to={{
                    pathname: '/tasks/edit',
                    task_id: task_id,
                    topic_name: topic.name
                  }}>Edit </Link>
                  <Link to={{
                    pathname: '/tasks/move',
                    task_id: task_id,
                    topic_name: topic.name
                  }}>Move </Link>
                  <Link to={{
                    pathname: '/tasks/attachments',
                    task_id: task_id,
                    task_name: name,
                    topic_name: topic.name
                  }}>Attachments </Link>
                  <Link onClick={() => deleteTask(task_id)}>Delete</Link>
                </td>
              </tr>
            ))}
          </table>
        </>
      ))}
      </div>

    </>
  )
}


// <div className='teacherButton' id='reorderTasksButton'>Reorder Tasks</div>
export default ManageTopic
