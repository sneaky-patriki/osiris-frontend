import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'
import { Converter } from 'showdown'
import ReactHTMLParser from 'react-html-parser'

function TasksViewPage(props) {

  const showdownHighlight = require('showdown-highlight')

  var task_id;
  if (props.location.task_id != undefined) {
    task_id = props.location.task_id
    localStorage.setItem('currentTask', props.location.task_id)
  } else {
    task_id = localStorage.getItem('currentTask')
  }

  const [task, setTask] = React.useState({
    task_id: 0,
    taskgroup: "",
    name: "",
    difficulty: "",
    description: "",
    hint: "",
    solution: "",
    attachments: [],
    answer_type: "",
    choices: [],
    correct_answer: -1
  })
  const token = React.useContext(AuthContext)

  const fetchTaskData = () => {
    const getTask = axios.get('/tasks/details', {params: { token, task_id }})
      .then((taskResponse) => {
        const taskData = taskResponse.data.task
        console.log(taskData)
        setTask(taskData)
      })
  }

  var answerBox
  if (task.answer_type == 'multiple-choice-single') {
      answerBox = (
          <>
            <h4>Choices</h4>
            {task.choices.map((element, index) => (
                <>
                    <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} checked={(task.correct_answer == index)}/>
                    <label for={'answer' + (index + 1)}>{element}</label><br/>
                </>
            ))}
          </>
      )
  } else if (task.answer_type == 'multiple-choice-multiple') {
      answerBox = (
          <>
            <h4>Choices</h4>
            {task.choices.map((element, index) => (
                <>
                    <input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} checked={(task.correct_answer.includes(index))}/>
                    <label for={'answer' + (index + 1)}>{element}</label><br/>
                </>
            ))}
          </>
      )
  }

  const step = useStep(fetchTaskData, [], 2)
  var converter = new Converter({extensions: [showdownHighlight]})
  console.log(converter.makeHtml(task.description).replace(/(?:\r\n|\r|\n)/g, '<br>'))

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h4 id='topicTitle'>{props.location.topic_name}</h4>
            <h4 id='taskGroupTitle'>{task.taskgroup}</h4>
            <h1>Tasks</h1>
        </div>
        <hr/>

        <div>
            <h3 id='taskName'>{task.name}</h3>

            <h4>Difficulty</h4>
            <p id='difficulty'>{task.difficulty}</p>

            <h4>Description</h4>
            <p id='description'>{ReactHTMLParser(converter.makeHtml(task.description).replace(/(?:\r\n|\r|\n)/g, '<br>'))}</p>

            <h4>Hint</h4>
            <p id='hint'>{ReactHTMLParser(converter.makeHtml(task.hint).replace(/(?:\r\n|\r|\n)/g, '<br>'))}</p>

            {answerBox}

            { (task.answer_type != 'content') ? (<><h4>Solution</h4>
            <p id='solution'>{task.solution}</p></>) : (<></>) }

            <h4>Attachments</h4>
            <div id='attachments'>
            {task.attachments.map(({attachment_id, cover_name, url}, index) => (
              <div className='attachment'>
                <h4>Attachment</h4>
                {cover_name} <a href={url}>Download</a><br/>
              </div>
            ))}
            </div>
        </div>

        <Link to='/topics/manage'>Back</Link>

      </>
    }/>
  )

}


export default TasksViewPage;
