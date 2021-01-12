import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { Converter } from 'showdown'
import ReactHTMLParser from 'react-html-parser'

function SubmissionsMarkPage(props) {

  var submission_id
  if (props.location.submission_id != undefined) {
    submission_id = props.location.submission_id
    localStorage.setItem('currentSubmission', submission_id)
  } else {
    submission_id = localStorage.getItem('currentSubmission')
  }

  const token = React.useContext(AuthContext)
  const [submission, setSubmission] = React.useState({
    submission_id: 0,
    comment: '',
    files: [],
    status: '',
    task: {
      description: '',
      solution: '',
      answer_type: '',
      choices: []
    },
    url: '',
    selected_answer: -1,
  })
  const [textBox, setTextBox] = React.useState(submission.task.description)

  const fetchSubmissionData = () => {
    const getSubmissions = axios.get('/submissions/details', {params: { token, submission_id }})
      .then((submissionsResponse) => {
        const submissionData = submissionsResponse.data.submission
        console.log(submissionData)
        setSubmission(submissionData)
      })
      .catch((err) => {})
  }

  function equivalent(a, b) {
      if (a.length != b.length) return false

      for (var i = 0; i < a.length; i++) {
          if (a[i] != b[i]) {
              return false
          }
      }
      return true
  }

  function showTask() {
    setTextBox(submission.task.description)
    var taskElement = document.getElementById('showTask')
    var solnElement = document.getElementById('showSolution')

    taskElement.style.borderTop = '1px solid lightgray'
    taskElement.style.borderLeft = '1px solid lightgray'
    taskElement.style.borderRight = '1px solid lightgray'
    solnElement.style.border = '0px'
  }

  function showSolution() {
    setTextBox(submission.task.solution)
    var taskElement = document.getElementById('showTask')
    var solnElement = document.getElementById('showSolution')

    solnElement.style.borderTop = '1px solid lightgray'
    solnElement.style.borderLeft = '1px solid lightgray'
    solnElement.style.borderRight = '1px solid lightgray'
    taskElement.style.border = '0px'
  }

  function markSubmission(status) {
    axios.put('/submissions/mark', { token, submission_id, status })
      .then((response) => {
        const data = response.data
        console.log(data)
        window.location.reload()
      })
  }

  function handleSubmit(event) {
    event.preventDefault()

    var comment = event.target[0].value

    axios.post('/submissions/comment', { token, submission_id, comment })
      .then((response) => {
        const data = response.data
        console.log(data)
        window.location.reload()
      })
  }

  const step = useStep(fetchSubmissionData, [], 1)
  var converter = new Converter()

  var markingContent
  if (submission.task.answer_type == 'multiple-choice-single') {
      markingContent = (
          <>
          <h4>Answer</h4>
          {submission.task.choices.map((element, index) => (
              <>
                  <input type='radio' name='givenAnswer' id={'answer' + (index + 1)} checked={index == submission.selected_answer} />
                  <label for={'answer' + (index + 1)}>{element}</label><br/>
              </>
          ))}<br/>

          <h4>Correct Answer</h4>
          {submission.task.choices.map((element, index) => (
              <>
                  <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} checked={index == submission.task.correct_answer} />
                  <label for={'answer' + (index + 1)}>{element}</label><br/>
              </>
          ))}<br/>

          <strong>Status</strong>: {submission.status}

          <div id='topicTabs'>
            <div className='topicTab' id='showTask' onClick={showTask}>Task</div>
            <div className='topicTab' id='showSolution' onClick={showSolution}>Solution</div>
          </div>

          <div className='studentButton' onClick={() => markSubmission((submission.selected_answer == submission.task.correct_answer) ? "correct" : "incorrect")}>Mark</div>

          </>
      )
  } else if (submission.task.answer_type == 'multiple-choice-multiple') {
      markingContent = (
          <>
          <h4>Answer</h4>
          {submission.task.choices.map((element, index) => (
              <>
                  <input type='checkbox' name='givenAnswer' id={'answer' + (index + 1)} checked={submission.selected_answer.includes(index)} />
                  <label for={'answer' + (index + 1)}>{element}</label><br/>
              </>
          ))}<br/>

          <h4>Correct Answer</h4>
          {submission.task.choices.map((element, index) => (
              <>
                  <input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} checked={submission.task.correct_answer.includes(index)} />
                  <label for={'answer' + (index + 1)}>{element}</label><br/>
              </>
          ))}<br/>

          <strong>Status</strong>: {submission.status}

          <div id='topicTabs'>
            <div className='topicTab' id='showTask' onClick={showTask}>Task</div>
            <div className='topicTab' id='showSolution' onClick={showSolution}>Solution</div>
          </div>

          <div className='studentButton' onClick={() => markSubmission((equivalent(submission.selected_answer.sort(), submission.task.correct_answer.sort())) ? "correct" : "incorrect")}>Mark</div>

          </>
      )
  } else if (submission.task.answer_type == 'standard') {
      markingContent = (
          <>
          <h4>Submission</h4>
          {submission.files.map(({url, cover_name}, index) => (
              <><a href={url}>{cover_name}</a><br/></>
          ))}
          <br/><br/>

          <strong>Status</strong>: {submission.status}


          <div id='topicTabs'>
            <div className='topicTab' id='showTask' onClick={showTask}>Task</div>
            <div className='topicTab' id='showSolution' onClick={showSolution}>Solution</div>
          </div>

          <div className='greenTeacherButton' onClick={() => markSubmission('correct')}>Correct</div>
          <div className='redTeacherButton' onClick={() => markSubmission('incorrect')}>Incorrect</div>

          </>
      )
  } else if (submission.task.answer_type == 'short-answer') {
      markingContent = (
          <>
          <h4>Submission</h4>
          <p>{submission.selected_answer}</p>
          <br/><br/>

          <strong>Status</strong>: {submission.status}


          <div id='topicTabs'>
            <div className='topicTab' id='showTask' onClick={showTask}>Task</div>
            <div className='topicTab' id='showSolution' onClick={showSolution}>Solution</div>
          </div>

          <div className='greenTeacherButton' onClick={() => markSubmission('correct')}>Correct</div>
          <div className='redTeacherButton' onClick={() => markSubmission('incorrect')}>Incorrect</div>

          </>
      )
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div className='headerSection'>
          <h1>Submissions</h1>
        </div>
        <hr/>
        <div className='viewSubmission'>

        <div className='teacherButton' id='closeWindow' onClick={() => markSubmission('unmarked')}>
          Reset Marking
        </div>

          <h4>Task</h4>
          {submission.task.name}

          {markingContent}

          <div id='taskSolutionContent'>
            {ReactHTMLParser(converter.makeHtml(textBox).replace(/(?:\r\n|\r|\n)/g, '<br>'))}
          </div>

          <h4>Comments</h4>
          <form name='addCommentForm' onSubmit={handleSubmit}>
            <input type='text' name='comment' defaultValue={submission.comment}/>
            <input type='submit' value='Add Comment'/>
          </form>
          <Link to='/classes/topics/taskgroups/progress'>Back</Link>
        </div>
      </>
    }/>
  )

}

export default SubmissionsMarkPage
