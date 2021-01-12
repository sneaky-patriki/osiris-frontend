import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function TaskgroupProgressPage(props) {

  var class_id
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  var taskgroup_id
  if (props.location.taskgroup_id != undefined) {
    taskgroup_id = props.location.taskgroup_id
    localStorage.setItem('currentTaskgroup', taskgroup_id)
  } else {
    taskgroup_id = localStorage.getItem('currentTaskgroup')
  }

  const [cls, setClass] = React.useState({
    class_id: 0,
    name: "",
    course: {
      topics: []
    },
    teachers: [],
    students: [],
    progress: [],
  })

  const [taskgroup, setTaskgroup] = React.useState({
    name: '',
    taskgroup_id: 0,
    tasks: [],
    topic: {
      name: '',
      topic_id: 0
    }
  })

  const token = React.useContext(AuthContext)

  const fetchClassData = (topic_id) => {
    const getCourse = axios.get('/classes/taskgroup/details', {params: { token, class_id, taskgroup_id }})
      .then((classResponse) => {
        const classData = classResponse.data.class
        console.log(classData)
        setClass(classData)
      })
      .catch((err) => {})
  }

  const fetchTaskgroupData = () => {
    const getTaskgroup = axios.get('/taskgroups/details', {params: { token, taskgroup_id }})
    .then((taskgroupResponse) => {
      const taskgroupData = taskgroupResponse.data.taskgroup
      console.log(taskgroupData)
      setTaskgroup(taskgroupData)
    })
  }

  function getAnswerType(task_id) {
      for (var tk = 0; tk < taskgroup.tasks.length; tk++) {
          if (taskgroup.tasks[tk].task_id == task_id) {
              return taskgroup.tasks[tk].answer_type
          }
      }
  }

  const step1 = useStep(fetchClassData, [], 1)
  const step2 = useStep(fetchTaskgroupData, [], 1)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Progress Report</h1>
        </div>

        <hr/>

        <h4>Class</h4>
        <Link to={{
          pathname: '/classes/manage',
          class_id: cls.class_id
        }}>{cls.name}</Link>
        <h4>Course</h4>
        <Link to={{
          pathname: '/courses/manage',
          course_id: cls.course.course_id
        }}>{cls.course.name}</Link>
        <h4>Topic</h4>
        <Link to={{
          pathname: '/classes/progress',
          topic_id: taskgroup.topic.topic_id,
          class_id: cls.class_id
        }}>{taskgroup.topic.name}</Link>
        <h4>Task Group</h4>
        {taskgroup.name}

        <table id="taskProgress">
          <thead>
            <td><h4>Student</h4></td>
            {taskgroup.tasks.map(({ taskgroup_id, name, answer_type }, index) => (
              <>{(answer_type != 'content') ? <td className='taskName'><h4>{name}</h4></td> : <></> }</>
            ))}
            <td><h4>Submitted</h4></td>
            <td><h4>Correct</h4></td>
          </thead>
          {cls.students.map(({ username, name, progress, submitted, correct, total }, index) => (
            <tr>
              <td><Link to={{
                  pathname: '/students/progress',
                  student_id: username,
                  course_id: cls.course.course_id,
                  class_id: cls.class_id
              }}>{name}</Link>
              </td>
              {progress.tasks.map(({ task, submissions }, index) => (
                <>
                    { (getAnswerType(task) != 'content') ? (
                    <td>
                      <div className='progressDash'>
                        { (submissions.length != 0) ? (
                          <Link to={{
                            pathname: '/submissions/mark',
                            submission_id: submissions[0].submission_id
                        }}><div className={submissions[0].status + 'Dash'} style={{width: '100%', color: 'white'}}>View Submission</div></Link>
                        ) : (<></>) }
                      </div>
                    </td>) : (<></>) }
                </>
              ))}
              <td>{progress.submitted} / {progress.total} ({Math.round(100 * progress.submitted / progress.total, 2)} %)</td>
              <td>{progress.correct} / {progress.total} ({Math.round(100 * progress.correct / progress.total, 2)} %)</td>
            </tr>
          ))}
        </table>
      </>
    }/>
  )

}

export default TaskgroupProgressPage
