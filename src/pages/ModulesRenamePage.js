import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ModulesRenamePage(props) {

  const token = React.useContext(AuthContext)

  var module_id
  if (props.location.module_id != undefined) {
    module_id = props.location.module_id
    localStorage.setItem('currentModule', module_id)
  } else {
    module_id = localStorage.getItem('currentModule')
  }

  function handleSubmit(event) {
    event.preventDefault()

    const name = event.target[0].value

    axios.put('/courses/topics/rename', { token, module_id, name })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/courses/manage')
      })
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Courses</h1>
        </div>
        <hr/>

        <form name='renameTopicForm' onSubmit={handleSubmit}>
            <input type='text' defaultValue={props.location.module_name} name='name' /><br/>
            <input type='submit' value='Update Topic' />
            <Link to='/courses/manage'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default ModulesRenamePage
