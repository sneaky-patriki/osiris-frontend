import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function EnrolmentsImportPage(props) {

  const token = React.useContext(AuthContext)
  var file = false

  var class_id;
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  function setFile(event) {
    file = event.target.files[0]
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!file) {
      console.log('No file chosen')
      return
    }

    var form = new FormData()
    form.append('token', token)
    form.append('class_id', class_id)
    form.append('file', file)

    axios.post('/classes/enrolments/import', form, { headers: { 'content-type': 'multipart/form-data' }})
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/classes/manage')
      })
      .catch((err) => {})
  }


  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h4 id="className"></h4>
            <h1>Classes</h1>
        </div>
        <hr/>

        <form name='addEnrolmentForm' onSubmit={handleSubmit}>
            <div className='notice'>The file should be formatted as a CSV containing a single column of student ID values. There should be no header row.</div>
            <input type='file' name='attachment' onChange={setFile} /><br/>
            <input type='submit' value='Import Students' />
            <Link to='/classes/manage'>Cancel</Link>
        </form>
      </>
    }/>

  )

}

export default EnrolmentsImportPage
