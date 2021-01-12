import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'
import { taskType } from '../utils/helperFunctions'

function TasksEditPage(props) {

  const [task, setTask] = React.useState({
    task_id: 0,
    taskgroup: "",
    name: "",
    difficulty: "",
    description: "",
    hint: "",
    solution: "",
    answer_type: "",
    choices: [],
    correct_answer: -1
  })
  const [numChoices, setNumChoices] = React.useState()
  const token = React.useContext(AuthContext)

  var task_id;
  if (props.location.task_id != undefined) {
    localStorage.setItem('currentTask', props.location.task_id)
    task_id = props.location.task_id
  } else {
    task_id = localStorage.getItem('currentTask')
  }

  const fetchTaskData = () => {
    const getTask = axios.get('/tasks/details', {params: { token, task_id }})
      .then((taskResponse) => {
        const taskData = taskResponse.data.task
        console.log(taskData)
        setTask(taskData)
        setNumChoices(taskData.choices.length)
      })
  }

  const step = useStep(fetchTaskData, [], 2)

  function handleSubmit(event) {
    event.preventDefault()
    console.log(event.target)
    const name = event.target[0].value
    const difficulty = event.target[1].value
    const description = event.target[2].value
    const hint = event.target[3].value

    var choices = []
    var correct_answers = [];
    for (var c = 0; c < numChoices; c++) {
        choices.push(document.getElementById('choice' + (c + 1)).value)
        if (document.getElementById('answer' + (c + 1)).checked) {
            correct_answers.push(c)
        }
    }

    var solution
    if (task.answer_type == 'multiple-choice-single' || task.answer_type == 'multiple-choice-multiple') {
        solution = event.target[(numChoices * 2) + 6].value
    } else {
        solution = event.target[4].value
    }

    axios.put('/tasks/edit', { token, task_id, name, difficulty, description, hint, solution, choices, correct_answers })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/topics/manage')
      })
      .catch((err) => {})
  }

  function setChoices() {
      var n = document.getElementById('numChoices').value
      if (n >= 0) {
          setNumChoices(n)
      } else {
          console.log('Invalid number of choices')
      }
  }

  var answerBox
  if (task.answer_type == 'multiple-choice-single') {
      if (numChoices == task.choices.length) {
          answerBox = (
              <>
                <h4>Choices</h4><br/>
                <p>Choose the correct answer.</p>
                {task.choices.map((element, index) => (
                    <>
                        <input type='radio' name='correctAnswer' id={'answer' + (index + 1)} defaultChecked={(task.correct_answer == index)}/>
                        <input type='text' id={'choice' + (index + 1)} defaultValue={element} /><br/>
                    </>
                ))}
                <h4>Number of Choices</h4>
                <input type='text' id='numChoices'/><br/>
                <input type='button' onClick={setChoices} value='Reset Choices' />
                <br/><br/>
              </>
          )
      } else {
          var nums = []
          for (var i = 0; i < numChoices; i++) {
              nums.push(i)
          }
          answerBox = (
              <>
                <h4>Choices</h4><br/>
                <p>Choose the correct answer.</p>
                {nums.map((element, index) => (
                    <><input type='radio' name='correctAnswer' id={'answer' + (index + 1)} />
                    <input type='text' id={'choice' + (index + 1)} placeholder={'Choice ' + (index + 1)} /><br/></>
                ))}
                <h4>Number of Choices</h4>
                <input type='text' id='numChoices'/><br/>
                <input type='button' onClick={setChoices} value='Reset Choices' />
                <br/><br/>
              </>
          )
      }
  } else if (task.answer_type == 'multiple-choice-multiple') {
      if (numChoices == task.choices.length) {
          answerBox = (
              <>
                <h4>Choices</h4><br/>
                <p>Choose the correct answer.</p>
                {task.choices.map((element, index) => (
                    <>
                        <input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} defaultChecked={(task.correct_answer == index)}/>
                        <input type='text' id={'choice' + (index + 1)} defaultValue={element} /><br/>
                    </>
                ))}
                <h4>Number of Choices</h4>
                <input type='text' id='numChoices'/><br/>
                <input type='button' onClick={setChoices} value='Reset Choices' />
                <br/><br/>
              </>
          )
      } else {
          var nums = []
          for (var i = 0; i < numChoices; i++) {
              nums.push(i)
          }
          answerBox = (
              <>
                <h4>Choices</h4><br/>
                <p>Choose the correct answers.</p>
                {nums.map((element, index) => (
                    <><input type='checkbox' name='correctAnswer' id={'answer' + (index + 1)} />
                    <input type='text' id={'choice' + (index + 1)} placeholder={'Choice ' + (index + 1)} /><br/></>
                ))}
                <h4>Number of Choices</h4>
                <input type='text' id='numChoices'/><br/>
                <input type='button' onClick={setChoices} value='Reset Choices' />
                <br/><br/>
              </>
          )
      }
  } else if (task.answer_type == 'content') {
      answerBox = <></>
  }

  console.log(answerBox)

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Tasks</h1>
            <h2>Topic: {props.location.topic_name}</h2>
            <h2>Task Group: {task.taskgroup}</h2>
            <h4>Task Type: {taskType(task.answer_type)}</h4>
        </div>
        <hr/>

        <form name='addTask' onSubmit={handleSubmit}>
          <input type='text' placeholder='*Title' name='name' defaultValue={task.name}/><br/><br/>
          <h4>*Difficulty</h4>

          <select id="difficulty">
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value='Platinum'>Platinum</option>
              <option value='Kryptonite'>Kryptonite</option>
              <option value='Unspecified'>Unspecified</option>
          </select><br/><br/>

          <textarea name='description' placeholder="Description" defaultValue={task.description}></textarea><br/><br/>

          <textarea name='hint' placeholder="Hint" defaultValue={task.hint}></textarea><br/><br/>

          {answerBox}

          {(task.answer_type != 'content') ? (<><textarea name='solution' placeholder="Solution" defaultValue={task.solution}></textarea><br/><br/></>) : <></>}


          <input type='submit' value='Update Task' />
          <Link to='/topics/manage'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default TasksEditPage;
