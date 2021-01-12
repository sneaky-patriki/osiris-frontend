import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function QuizAddPage(props) {

  const token = React.useContext(AuthContext)
  const [questions, setQuestions] = React.useState([])

  var taskgroup_id;
  if (props.location.taskgroup_id != undefined) {
    localStorage.setItem('currentTaskgroup', props.location.taskgroup_id)
    taskgroup_id = props.location.taskgroup_id
  } else {
    taskgroup_id = localStorage.getItem('currentTaskgroup')
  }

  function handleSubmit(event) {
      event.preventDefault()

  }

  function createQuestion() {
    const description = document.getElementById('description').value
    const type = document.getElementById('newQuestionType').value

    questions.push({description: description, type: type, choices: []})
    console.log(questions)
    setQuestions(questions)
  }


  function questionContent(type, choices, questionNo) {

      if (type == 'multiple choice single') {
          return (<>
              {[...Array(choices)].map((element, index) => (
                  <>
                      <input type='radio' value={index} id={'question' + questionNo + '-' + index} />
                      <label for={'question' + questionNo + '-' + index}>{element}</label>
                      <div className='minusButton'>-</div>
                  </>
              ))}
              <input type='text' id='multichoicenew' />
              <div className='plusButton' onClick={() => addChoice(questionNo)}>+</div>
          </>)
      }
  }

  function addChoice(q) {
      var choice = document.getElementById('multichoicenew').value
      console.log(choice)
      questions[q - 1].choices.push(choice)
      console.log(questions)
      setQuestions(questions)
  }

  console.log('questions', questions)


  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Tasks</h1>
            <h2>Topic: {props.location.topic_name}</h2>
            <h2>Task Group: {props.location.taskgroup_name}</h2>
        </div>
        <hr/>

        <form name='addTask' onSubmit={handleSubmit}>
          <input type='text' placeholder='*Title' name='name' /><br/><br/>

          <h4>*Difficulty</h4><br/>

          <select id="difficulty">
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value='Platinum'>Platinum</option>
              <option value='Kryptonite'>Kryptonite</option>
          </select><br/><br/>

          <div id='quizQuestions'>
             <h4>Questions</h4>
             {questions.map(({description, type, choices}, index) => (
                 <div className='question'>
                     <h4>Question {index + 1}</h4><br/>
                     Type: {type}<br/>
                     <textarea name='description' defaultValue={description} /><br/>
                     {questionContent(type, choices, index + 1)}
                     <div className='redTeacherButton'>Remove Question</div>
                 </div>
             ))}

             <div id='questionCreate'>
                 <h4>New Question</h4>
                 <form name='questionCreate'>
                     <textarea id='description' placeholder='Description' /><br/>
                     <select id='newQuestionType'>
                         <option value='multiple choice single'>Multiple Choice (Single Answer)</option>
                         <option value='multiple choice multi'>Multiple Choice (Multiple Answers)</option>
                         <option value='short answer'>Short Answer</option>
                     </select>
                     <input type='button' value='Create Question' onClick={() => createQuestion()} />
                 </form>
             </div>

             <h4>End of Questions</h4>
          </div>

          <input type='submit' value='Create Task' />
          <Link to='/topics/manage'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default QuizAddPage;
