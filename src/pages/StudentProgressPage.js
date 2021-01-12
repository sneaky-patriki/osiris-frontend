import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'
import { Converter } from 'showdown'

function StudentProgressPage(props) {

    var course_id
    var student_id
    var class_id

    if (props.location.course_id != undefined) {
      course_id = props.location.course_id
      localStorage.setItem('currentCourse', props.location.course_id)
    } else {
      course_id = localStorage.getItem('currentCourse')
    }

    if (props.location.student_id != undefined) {
        student_id = props.location.student_id
        localStorage.setItem('currentStudent', props.location.student_id)
    } else {
        student_id = localStorage.getItem('currentStudent')
    }

    if (props.location.class_id != undefined) {
        class_id = props.location.class_id
        localStorage.setItem('currentClass', props.location.class_id)
    } else {
        class_id = localStorage.getItem('currentClass')
    }

    const [studentName, setStudentName] = React.useState("")
    const [course, setCourse] = React.useState({
      course_id: 0,
      name: "",
      modules: [],
      classname: ""
    })
    const [currentTopic, setCurrentTopic] = React.useState({
      topic_id: 0,
      module_id: 0,
      module_name: '',
      taskgroups: [],
    })
    const [currentTask, setCurrentTask] = React.useState({
      task_id: 0,
      taskgroup: "",
      name: "",
      difficulty: "",
      description: "",
      hint: "",
      solution: "",
      attachments: []
    })

    const [submissions, setSubmissions] = React.useState([])
    const [progress, setProgress] = React.useState([])

    const token = React.useContext(AuthContext)

    const fetchCourseData = () => {
      const getCourse = axios.get('/courses/details/class', {params: { token, course_id, class_id }})
        .then((courseResponse) => {
          const courseData = courseResponse.data.course
          console.log(courseData)
          setCourse(courseData)
        })
        .catch((err) => {})
    }

    const fetchSubmissionData = () => {
      const task_id = currentTask.task_id
      const getSubmissions = axios.get('/courses/submissions/student', {params: { token, course_id, student_id }})
        .then((submissionsResponse) => {
          const submissionData = submissionsResponse.data.submissions
          const progressData = submissionsResponse.data.progress
          const name = submissionsResponse.data.name
          console.log(submissionData)
          console.log(progressData)
          setSubmissions(submissionData)
          setProgress(progressData)
          setStudentName(name)
        })
        .catch((err) => {})
    }

    function getTopic(module_id) {
      for (var t = 0; t < course.modules.length; t++) {
        if (course.modules[t].module_id == module_id) {
          return course.modules[t]
        }
      }
    }

    function getTask(module_id, taskgroup_id, task_id) {
      for (var t = 0; t < course.modules.length; t++) {
        if (course.modules[t].module_id == module_id) {
          for (var tg = 0; tg < course.modules[t].taskgroups.length; tg++) {
            if (course.modules[t].taskgroups[tg].taskgroup_id == taskgroup_id) {
              for (var tk = 0; tk < course.modules[t].taskgroups[tg].tasks.length; tk++) {
                if (course.modules[t].taskgroups[tg].tasks[tk].task_id == task_id) {
                  return course.modules[t].taskgroups[tg].tasks[tk]
                }
              }
            }
          }
        }
      }
    }

    function showTopic(module_id) {
      var elements = document.getElementById('topicTabs').childNodes
      for (var e = 0; e < elements.length; e++) {
        if (elements[e].id == 'md' + module_id) {
          elements[e].style.borderTop = '1px solid lightgray'
          elements[e].style.borderLeft = '1px solid lightgray'
          elements[e].style.borderRight = '1px solid lightgray'
        } else {
          elements[e].style.border = '0px'
        }
      }

      var topic = getTopic(module_id)

      setCurrentTopic(topic)
    }

    function displayTaskgroup(taskgroup_id) {
      var element = document.getElementById('tg' + taskgroup_id)
      var elements = element.childNodes

      console.log(element.name)

      if (element.name == 'undisplayed' || element.name == undefined) {
        for (var e = 1; e < elements.length; e++) {
          elements[e].style.display = 'block'
          console.log(elements[e].style.display)
        }
        element.name = 'displayed'

      } else if (element.name == 'displayed') {
        for (var e = 1; e < elements.length; e++) {
          elements[e].style.display = 'none'
        }
        element.name = 'undisplayed'
      }
    }

    function displayTask(module_id, taskgroup_id, task_id) {
      var task = getTask(module_id, taskgroup_id, task_id)
      console.log(task)
      setCurrentTask(task)
    }

    function taskSubmissions() {
      var subs = []
      for (var sb = 0; sb < submissions.length; sb++) {
        if (submissions[sb].tasks.includes(currentTask.task_id)) {
          subs.push(submissions[sb])
        }
      }
      return subs
    }

    function taskSubmissionState(task_id) {
      var subs = []
      for (var sb = 0; sb < submissions.length; sb++) {
        if (submissions[sb].task == task_id) {
          subs.push(submissions[sb])
        }
      }
      console.log('subs', subs)
      if (subs.length > 0) {
        return subs[subs.length - 1].status
      } else {
        return ''
      }

    }

    const step1 = useStep(fetchCourseData, [], 2)
    const step2 = useStep(fetchSubmissionData, [], 2)

    var converter = new Converter()
    const taskSubs = taskSubmissions()
    var submissionBlock

    if (currentTask.task_id != 0) {
        if (currentTask.answer_type == 'multiple-choice-single') {

          if (taskSubs.length > 0) {
              var choice = taskSubs[taskSubs.length - 1].selected_answer
              var status = taskSubs[taskSubs.length - 1].status

              submissionBlock = (
                  <>
                  <div className='submissionBox'>
                      <div className='submissionDisplay' name={status}>
                        {currentTask.choices.map((element, index) => (
                            <>
                                <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} checked={index == choice} />
                                <label for={'answer' + (index + 1)}>{element}</label><br/>
                            </>
                        ))}
                      </div>
                  </div>
                  </>
              )
          }
      } else {
        if (taskSubs.length > 0) {
          submissionBlock = (
            <>
              <h4>Submissions</h4>
              {taskSubs.map(({ time, status, url, comment }, index) => (
                <div className='submissionDisplay' name={status}>{comment}
                  <strong> {status}</strong> <a href={url}>Download</a>
                </div>
              ))}
            </>
          )
        }
      }
    }

    return (
        <Layout navtype='teacher' body={
          <>
            <div>
                <h1 id='courseName'>Student</h1>
            </div>

            <hr/>
            <h4>Name</h4>
            {studentName}

            <h4>Class</h4>
            <Link to={{
                pathname: '/classes/topics/progress',
                class_id: class_id
            }}>{course.classname}</Link>


            <table id='topicProgress'>
              <tr>
              {course.modules.map(({ module_name }, index) => (
                <td>{module_name}</td>
              ))}
              </tr>
              <tr id='progressDashRow'>
              {progress.map(({ unmarked, correct, incorrect, progress }, index) => (
                <td>
                  <div className='progressDash'>
                    <div className='unmarkedDash' style={{width: progress.unmarked + '%'}}></div>
                    <div className='correctDash' style={{width: progress.correct + '%'}}></div>
                    <div className='incorrectDash' style={{width: progress.incorrect + '%'}}></div>
                  </div>
                </td>
              ))}
              </tr>

            </table>

            <div id='topicTabs'>
            {course.modules.map(({ module_id, module_name, topic_id }, index) => (
              <div class='topicTab' id={"md" + module_id} onClick={() => showTopic(module_id)}>
                {module_name}
              </div>
            ))}
            </div>

            <div id="taskGroupBox">
                <div id='taskgroupList'>
                {currentTopic.taskgroups.map(({ taskgroup_id, name, tasks }, index) => (
                  <span className='taskGroupList' name='undisplayed' id={"tg" + taskgroup_id}>
                    <span className='taskGroupName' onClick={() => displayTaskgroup(taskgroup_id)}>
                    {name}
                    </span>
                    {tasks.map(({ task_id, name, difficulty }, index) => (
                      <>
                        <span style={{display: 'none'}} id={"tk" + task_id} onClick={() => displayTask(currentTopic.module_id, taskgroup_id, task_id)}
                        className={difficulty} name={taskSubmissionState(task_id)}>{name}</span>
                      </>
                    ))}
                  </span>
                ))}
                </div>

                <div id='taskBox'>
                {
                  <>
                    <h1>{currentTask.name}</h1>
                  </>
                }
                <br/>
                <br/>
                {submissionBlock}
                </div>
            </div>
          </>
      }/>
    )
}

export default StudentProgressPage
