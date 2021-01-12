import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { Converter } from 'showdown'
import ReactHTMLParser from 'react-html-parser'
import { getTimeDifference } from '../utils/helperFunctions'

function ViewCourse({ course_id, user_type }, ...props) {

  const [course, setCourse] = React.useState({
    course_id: 0,
    name: "",
    modules: []
  })
  const [currentTopic, setCurrentTopic] = React.useState({
    topic_id: 0,
    module_id: 0,
    module_name: '',
    taskgroups: [],
  })
  const [currentTask, setCurrentTask] = React.useState({
    task_id: 0,
    taskgroup_name: "",
    taskgroup_id: 0,
    name: "",
    difficulty: "",
    description: "",
    hint: "",
    solution: "",
    attachments: [],
    submit_multiple: false,
    answer_type: "",
    choices: [],
  })
  const [submissions, setSubmissions] = React.useState([])
  const [progress, setProgress] = React.useState([])
  // var [submissionsFetched, setSubmissionsFetched] = React.useState(false)
  const [numFiles, setNumFiles] = React.useState();
  const showdownHighlight = require('showdown-highlight')

  const token = React.useContext(AuthContext)
  var files = [];

  const fetchCourseData = () => {
    const getCourse = axios.get('/courses/details', {params: { token, course_id }})
      .then((courseResponse) => {
        const courseData = courseResponse.data.course
        console.log(courseData)
        setCourse(courseData)
      })
      .catch((err) => {})
  }

  const fetchSubmissionData = () => {
    const task_id = currentTask.task_id
    const getSubmissions = axios.get('/courses/submissions', {params: { token, course_id }})
      .then((submissionsResponse) => {
        const submissionData = submissionsResponse.data.submissions
        const progressData = submissionsResponse.data.progress
        console.log(submissionData)
        console.log(progressData)
        setSubmissions(submissionData)
        setProgress(progressData)
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
    setNumFiles(1)
    files = []
    taskgroup_list = []

    var element = document.getElementById('hint')
    element.innerHTML = 'Show Hint'
    element.name = 'hintHide'
    element.style.width = '80px'

    var label = document.getElementById('0')
    if (label != null) {
        label.innerHTML = 'Choose File'
    }
  }

  function showHint() {
    var element = document.getElementById('hint')
    element.innerHTML = '<h4>Hint</h4>' + converter.makeHtml(currentTask.hint).replace(/(?:\r\n|\r|\n)/g, '<br>')
    element.name = 'hintShow'
    element.style.width = '100%'
    element.className = 'hintShow'
  }

  function setFile(event) {
    files.push(event.target.files[0])
    document.getElementById(event.target.id.replace('submission', '')).innerHTML = event.target.files[0].name
  }

  function handleSubmit(event) {
    event.preventDefault()

    var form = new FormData()
    form.append('token', token)

    if (currentTask.answer_type == 'standard') {

        if (files.length == 0) {
          console.log('No files chosen')
          return
        }

        var taskgroup_submit_list = []
        for (var i = 0; i < taskgroup_list.length; i++) {
            console.log(event.target[i].name)
            if (event.target[i].checked) {
                taskgroup_submit_list.push(taskgroup_list[i][0])
            }
        }

        console.log(taskgroup_submit_list, files)
        form.append('tasks', taskgroup_submit_list)


        for (var i = 0; i < numFiles; i++) {
            form.append('file' + i, files[i])
        }
    } else if (currentTask.answer_type == 'multiple-choice-single') {
        for (var c = 0; c < currentTask.choices.length; c++) {
            if (document.getElementById('answer' + (c + 1)).checked) {
                form.append('selected_answer', c)
                break
            }
        }
        form.append('tasks', [currentTask.task_id])
    } else if (currentTask.answer_type == 'multiple-choice-multiple') {
        var selected = []
        for (var c = 0; c < currentTask.choices.length; c++) {
            if (document.getElementById('answer' + (c + 1)).checked) {
                selected.push(c)
            }
        }
        form.append('selected_answer', selected)
        form.append('tasks', [currentTask.task_id])
    } else if (currentTask.answer_type == 'short-answer') {
        const answer = event.target[0].value
        console.log(answer)
        form.append('selected_answer', answer)
        form.append('tasks', [currentTask.task_id])
    }

    console.log(files)


    axios.post('/tasks/submit', form, { headers: { 'content-type': 'multipart/form-data' }})
      .then((response) => {
        const data = response.data
        console.log(data)
        window.location.reload()
      })
      .catch((err) => {})
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
      if (submissions[sb].tasks.includes(task_id)) {
        subs.push(submissions[sb])
      }
    }

    if (subs.length > 0) {
      return subs[subs.length - 1].status
    } else {
      return ''
    }

  }

  function addFile() {
      setNumFiles(numFiles + 1)
      document.getElementById('0').innerHTML = 'Choose File'
  }

  function removeFile(index) {
      if (numFiles == 1) return;
      setNumFiles(numFiles - 1)
      document.getElementById('0').innerHTML = 'Choose File'
  }

  const step1 = useStep(fetchCourseData, [], 2)
  const step2 = useStep(fetchSubmissionData, [], 2)

  var converter = new Converter({extensions: [showdownHighlight]})

  var hint;
  if (currentTask.hint) {
    hint = (
      <><div className='teacherButton' id='hint' name='hintHide' onClick={() => showHint()}>Show Hint</div><br/></>
    )
  } else {
    hint = <div className='teacherButton' id='hint' style={{display: 'none'}}></div>
  }

  var submissionBlock;
  const taskSubs = taskSubmissions()
  console.log(taskSubs)

  if (user_type == 'student' && currentTask.task_id != 0) {
    if (currentTask.answer_type == 'multiple-choice-single') {

      if (taskSubs.length > 0) {
          var choice = taskSubs[taskSubs.length - 1].selected_answer
          var status = taskSubs[taskSubs.length - 1].status

          submissionBlock = (
              <>
              <div className='submissionBox'>
                <form name='submit_task_form' onSubmit={handleSubmit}>
                  <div className='submissionDisplay' name={status}>
                    {currentTask.choices.map((element, index) => (
                        <>
                            <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} defaultChecked={index == choice} />
                            <label for={'answer' + (index + 1)}>{element}</label><br/>
                        </>
                    ))}
                    {taskSubs[taskSubs.length - 1].comment}
                  </div>
                  <input type='submit' value='Submit'/>
                </form>
              </div>
              </>
          )
      } else {
          submissionBlock = (
              <div className='submissionBox'>
                <hr/>
                <form name='submit_task_form' onSubmit={handleSubmit}>
                    {currentTask.choices.map((element, index) => (
                        <>
                            <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} />
                            <label for={'answer' + (index + 1)}>{element}</label><br/>
                        </>
                    ))}
                  <input type='submit' value='Submit'/>
                </form>
              </div>

          )
      }

  } else if (currentTask.answer_type == 'multiple-choice-multiple') {

    if (taskSubs.length > 0) {
        var choices = taskSubs[taskSubs.length - 1].selected_answer
        var status = taskSubs[taskSubs.length - 1].status

        submissionBlock = (
            <>
            <div className='submissionBox'>
              <form name='submit_task_form' onSubmit={handleSubmit}>
                <div className='submissionDisplay' name={status}>
                  {currentTask.choices.map((element, index) => (
                      <>
                          <input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} defaultChecked={choices.includes(index)} />
                          <label for={'answer' + (index + 1)}>{element}</label><br/>
                      </>
                  ))}
                  {taskSubs[taskSubs.length - 1].comment}
                </div>
                <input type='submit' value='Submit'/>
              </form>
            </div>
            </>
        )
    } else {
        submissionBlock = (
            <div className='submissionBox'>
              <hr/>
              <form name='submit_task_form' onSubmit={handleSubmit}>
                  {currentTask.choices.map((element, index) => (
                      <>
                          <input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} />
                          <label for={'answer' + (index + 1)}>{element}</label><br/>
                      </>
                  ))}
                <input type='submit' value='Submit'/>
              </form>
            </div>

        )
    }

  } else if (currentTask.answer_type == 'standard') {

        console.log(taskSubs)
        var existingSubmissions;

        if (taskSubs.length > 0) {

            existingSubmissions = (
            <>
              <h4>Submissions</h4>
              {taskSubs.map(({ time, currentTime, status, comment, files }, index) => (
                <div className='submissionDisplay' name={status}>{comment}<br/>
                  <strong> {status}</strong><br/>
                  {files.map(({ cover_name, url }, index) => (
                      <><a href={url}>{cover_name}</a><br/></>
                  ))}
                  <span>{getTimeDifference(time, currentTime)}</span>
                </div>
              ))}
            </>
            )
        } else {
          existingSubmissions = <></>
        }

        var fileboxes = []
        for (var i = 0; i < numFiles; i++) {
            if (i != 0) {
                fileboxes.push(<div className='filebox'>
                                <input type='file' name={'submission' + i} id={'submission' + i} onChange={setFile} /><br/>
                                <label for={'submission' + i} id={i}>Choose File</label>
                                <div className='redTeacherButton' id='removeFileButton' onClick={() => removeFile(i)}>Remove File</div>
                               </div>)
            } else {
                fileboxes.push(<div className='filebox'>
                                <input type='file' name={'submission' + i} id={'submission' + i} onChange={setFile} /><br/>
                                <label for={'submission' + i} id={i}>Choose File</label>
                               </div>)
            }
        }

        var multipleSubmit;
        var taskgroup_list = []

        if (currentTask.submit_multiple) {
            for (var tg = 0; tg < currentTopic.taskgroups.length; tg++) {
                console.log(tg)
                if (currentTopic.taskgroups[tg].taskgroup_id == currentTask.taskgroup_id) {
                    for (var tk = 0; tk < currentTopic.taskgroups[tg].tasks.length; tk++) {
                        taskgroup_list.push([currentTopic.taskgroups[tg].tasks[tk].task_id, currentTopic.taskgroups[tg].tasks[tk].name])
                    }
                    break;
                }
            }

            multipleSubmit = (
                <>
                    <h4>Submit for Multiple Tasks</h4><br/>
                    {taskgroup_list.map((element, index) => (<>
                        <input type="checkbox" name={'task' + element[0]} />   {element[1]} <br/>
                    </>))}
                </>
            )
        } else {
            taskgroup_list.push([currentTask.task_id, currentTask.name])
            multipleSubmit = (<input id='singleSubmit' type='checkbox' name={'task' + currentTask.task_id} checked/>)
        }

        console.log(taskgroup_list)

        submissionBlock = (
          <div className='submissionBox'>
            <h4>Submit Your Solution</h4>
            <hr/>
            <form name='submit_task_form' onSubmit={handleSubmit}>
              {multipleSubmit}
              <p>Files</p>
              {fileboxes.map((element, index) => (
                  <>{element}<br/></>
              ))}
              <br/><br/>
              <div className='greenTeacherButton' id='addFileButton' onClick={addFile}>Add File</div><br/><br/>
              <input type='submit' value='Submit'/>
            </form>
          </div>

        )
    } else if (currentTask.answer_type == 'short-answer') {
        if (taskSubs.length > 0) {
            var answer = taskSubs[taskSubs.length - 1].selected_answer
            var status = taskSubs[taskSubs.length - 1].status
            console.log(answer)

            submissionBlock = (
                <>
                <div className='submissionBox'>
                  <form name='submit_task_form' onSubmit={handleSubmit}>
                    <div className='submissionDisplay' name={status}>
                      <textarea name='selected_answer' value={answer}></textarea><br/>
                      {taskSubs[taskSubs.length - 1].comment}
                    </div>
                    <input type='submit' value='Submit'/>
                  </form>
                </div>
                </>
            )
        } else {
            submissionBlock = (
                <div className='submissionBox'>
                  <form name='submit_task_form' onSubmit={handleSubmit}>
                      <textarea name='selected_answer'></textarea><br/>
                    <input type='submit' value='Submit'/>
                  </form>
                </div>

            )
        }
    } else {
        submissionBlock = <></>
    }
  } else {
    if (currentTask.answer_type == 'multiple-choice-single') {
        submissionBlock = (
            <div className='submissionBox'>
              <form name='submit_task_form' onSubmit={handleSubmit}>
                  {currentTask.choices.map((element, index) => (
                      <>
                          <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} />
                          <label for={'answer' + (index + 1)}>{element}</label><br/>
                      </>
                  ))}
              </form>
            </div>
        )
    } else if (currentTask.answer_type == 'multiple-choice-multiple') {
        submissionBlock = (
            <div className='submissionBox'>
              <form name='submit_task_form' onSubmit={handleSubmit}>
                  {currentTask.choices.map((element, index) => (
                      <>
                          <input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} />
                          <label for={'answer' + (index + 1)}>{element}</label><br/>
                      </>
                  ))}
              </form>
            </div>
        )
    } else if (currentTask.answer_type == 'short-answer') {
        submissionBlock = (
            <div className='submissionBox'>
              <form name='submit_task_form' onSubmit={handleSubmit}>
                  <textarea name='selected_answer'></textarea>
              </form>
            </div>
        )
    }
  }

  return (
    <>
      <div>
          <h1 id='courseName'>{course.name}</h1>
      </div>

      <hr/>

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
              <h1 id='taskName'>{currentTask.name}</h1>
              <span id='description'>{ReactHTMLParser(converter.makeHtml(currentTask.description).replace(/(?:\r\n|\r|\n)/g, '<br>'))}</span>
            </>
          }
          {hint}
          <br/>
          <br/>
          {submissionBlock}
          {existingSubmissions}
          </div>
      </div>
    </>
  )

}

export default ViewCourse
