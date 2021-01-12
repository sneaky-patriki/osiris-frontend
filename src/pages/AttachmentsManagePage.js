import React from 'react'
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useStep } from '../utils/update'

function AttachmentsManagePage(props) {

  var task_id
  if (props.location.task_id != undefined) {
    task_id = props.location.task_id
    localStorage.setItem('currentTask', task_id)
  } else {
    task_id = localStorage.getItem('currentTask')
  }

  const [attachments, setAttachments] = React.useState([])
  const [newAttachments, setNewAttachments] = React.useState(0)
  const token = React.useContext(AuthContext)
  var file = false

  const fetchAttachmentsData = () => {
    axios.get('/tasks/attachments', { params: { token, task_id }})
      .then((attachmentsResponse) => {
        const attachmentsData = attachmentsResponse.data.attachments
        console.log(attachmentsData)
        setAttachments(attachmentsData)
      })
      .catch((err) => {})
  }

  function addNewAttachment(event) {
    event.preventDefault()
    console.log(newAttachments)
    document.getElementById('addAttachmentButton').style.display = 'none'
    setNewAttachments(newAttachments + 1)
  }

  function removeNewAttachment(event) {
    event.preventDefault()
    document.getElementById('addAttachmentButton').style.display = 'block'
    setNewAttachments(newAttachments - 1)
  }

  function setFile(event) {
    file = event.target.files[0]
  }

  function handleSubmit(event) {
    event.preventDefault()

    console.log(event)
    const cover_name = event.target[0].value

    if (!file) {
      console.log('No file chosen')
      return
    }

    const attachment = file
    console.log(cover_name, attachment)

    var form = new FormData()
    form.append('token', token)
    form.append('task_id', task_id)
    form.append('cover_name', cover_name)
    form.append('attachment', attachment)

    axios.post('/tasks/attachments/add', form, { headers: { 'content-type': 'multipart/form-data' }})
      .then((response) => {
        const data = response.data
        console.log(data)
        window.location.reload()
      })
      .catch((err) => {})
  }

  function deleteAttachment(attachment_id) {
    axios.delete('/tasks/attachments/delete', { data: { token, attachment_id }})
      .then((response) => {
        const data = response.data
        window.location.reload()
      })
      .catch((err) => {})
  }

  const step = useStep(fetchAttachmentsData, [], 2)

  return (
    <Layout navtype='teacher' body={
      <>
        <div className='headerSection'>
            <h4 id='topicTitle'>{props.location.topic_name}</h4>
            <h4 id='taskTitle'>{props.location.task_name}</h4>
            <h1>Attachments</h1>
            <div onClick={addNewAttachment} id='addAttachmentButton' class='teacherButton'>Add Attachment</div>
        </div>
        <hr/>


        <div id='attachments'>
        {attachments.map(({attachment_id, cover_name, url}, index) => (
          <div className='attachment'>
            <h4>Attachment</h4>
            {cover_name} <a href={url}>Download</a><br/><br/>
            <a onClick={() => deleteAttachment(attachment_id)}>Remove Attachment</a>
          </div>
        ))}
        {[...Array(newAttachments)].map((element, index) => (
          <div className='attachment'>
            <form name='addAttachment' onSubmit={handleSubmit} encType='multipart/form-data'>
              <input type='text' name='name' /><br/>
              <div className='filebox'>
                <input type='file' name='attachment' id={'attachment' + index} onChange={setFile} />
                <label for={'attachment' + index}>Choose File</label><br/>
              </div>
              <br/>
              <input type='submit' id='addAttachmentButton' value='Add Attachment' />
              <a onClick={removeNewAttachment}>Remove Attachment</a>
            </form>
          </div>
        ))}
        </div>

        <Link to='/topics/manage'>Back</Link>
      </>
    }/>
  )
}

export default AttachmentsManagePage
