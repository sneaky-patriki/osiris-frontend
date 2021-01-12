import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'

function TopicsAddPage(props) {

  const token = React.useContext(AuthContext)

  function handleSubmit(event) {
    event.preventDefault()
    console.log(token)

    const name = event.target[0].value

    axios.post('/topics/add', { token, name })
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/topics')
      })
      .catch((err) => {})
  }

  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h1>Topics</h1>
        </div>
        <hr/>

        <form name='addTopicForm' onSubmit={handleSubmit}>
            <input type='text' placeholder='*Title' name='name' /><br/>
            <input type='submit' value='Create Topic' />
            <Link to='/topics'>Cancel</Link>
        </form>
      </>
    }/>
  )
}

export default TopicsAddPage;
