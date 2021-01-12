import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function UsersImportPage(props) {

  const token = React.useContext(AuthContext)
  var file = false

  var importType;
  if (props.location.importType != undefined) {
    importType = props.location.importType
  } else {
    importType = 'student'
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
    form.append('type', importType)
    form.append('file', file)

    axios.post('/users/import', form, { headers: { 'content-type': 'multipart/form-data' }})
      .then((response) => {
        const data = response.data
        console.log(data)
        props.history.push('/users')
      })
      .catch((err) => {})
  }


  return (
    <Layout navtype='teacher' body={
      <>
        <div class='headerSection'>
            <h4 id="className"></h4>
            <h1>Users</h1>
        </div>
        <hr/>

        <form name='addImportForm' onSubmit={handleSubmit}>
            <div className='notice'>The file should be formatted as a CSV containing column of {importType} username values and a column of names. There should be no header row.</div>
            <input type='file' name='attachment' onChange={setFile} /><br/>
            <input type='submit' value={'Import ' + importType.charAt(0).toUpperCase() + importType.slice(1) + 's'} />
            <br/>
            <Link to='/users'>Cancel</Link>
        </form>
      </>
    }/>

  )

}

export default UsersImportPage
