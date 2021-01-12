import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'
import '../App.css'
import AuthContext from '../AuthContext'
import { useStep } from '../utils/update'

function CourseProgressDifficultyPage(props) {

  var class_id
  if (props.location.class_id != undefined) {
    class_id = props.location.class_id
    localStorage.setItem('currentClass', class_id)
  } else {
    class_id = localStorage.getItem('currentClass')
  }

  const token = React.useContext(AuthContext)

  const [cls, setClass] = React.useState({
    class_id: 0,
    name: "",
    course: {
      topics: []
    },
    teachers: [],
    students: [],
    progress: [],
  })
  const [topics, setTopics] = React.useState([])

  const fetchClassData = () => {
    const getCourse = axios.get('/classes/details', {params: { token, class_id }})
      .then((classResponse) => {
        const classData = classResponse.data.class
        console.log(classData)
        setClass(classData)
      })
      .catch((err) => {})
  }

  const step = useStep(fetchClassData, [], 1)

  return (<Layout navtype='teacher' body={
    <>
      <div class='headerSection'>
          <h1>Difficulty Report</h1>
      </div>

      <div className='teacherButton'>
        <Link to={{
          pathname: '/classes/progress/',
          class_id: class_id
        }}>Progress Report</Link>
      </div>

      <hr/>

      <h4>Class</h4>
      <Link to={{
        pathname: '/classes/manage',
        class_id: cls.class_id
      }}>{cls.name}</Link>
      <h4>Course</h4>
      <Link to={{
        pathname: '/courses/manage',
        course_id: cls.course.course_id
      }}>{cls.course.name}</Link>

      <table id="topicProgress">
        <thead>
          <td><h4>Student</h4></td>
          {cls.course.topics.map(({ topic_id, name }, index) => (
            <td class='topicName'><h4>{name}</h4></td>
          ))}
          <td>Course</td>
        </thead>
        {cls.students.map(({ username, name, progress, difficulty }, index) => (
          <tr>
            <td>{name}</td>
            {difficulty.topics.map(({ module, progress }, index) => (
              <td>
                <div className='progressBlock'>
                  { (progress.Bronze != null) ? (<div className='progressSlice'><div className='difficultyBronze' style={{width: progress.Bronze + '%'}}></div></div>) : (<></>) }
                  { (progress.Silver != null) ? (<div className='progressSlice'><div className='difficultySilver' style={{width: progress.Silver + '%'}}></div></div>) : (<></>) }
                  { (progress.Gold != null) ? (<div className='progressSlice'><div className='difficultyGold' style={{width: progress.Gold + '%'}}></div></div>) : (<></>) }
                  { (progress.Platinum != null) ? (<div className='progressSlice'><div className='difficultyPlatinum' style={{width: progress.Platinum + '%'}}></div></div>) : (<></>) }
                  { (progress.Kryptonite != null) ? (<div className='progressSlice'><div className='difficultyKryptonite' style={{width: progress.Kryptonite + '%'}}></div></div>) : (<></>) }
                </div>
              </td>
            ))}
            <td>
              <div className='progressBlock'>
                { (difficulty.course.Bronze != null) ? (<div className='progressSlice'><div className='difficultyBronze' style={{width: difficulty.course.Bronze + '%'}}></div></div>) : (<></>) }
                { (difficulty.course.Silver != null) ? (<div className='progressSlice'><div className='difficultySilver' style={{width: difficulty.course.Silver + '%'}}></div></div>) : (<></>) }
                { (difficulty.course.Gold != null) ? (<div className='progressSlice'><div className='difficultyGold' style={{width: difficulty.course.Gold + '%'}}></div></div>) : (<></>) }
                { (difficulty.course.Platinum != null) ? (<div className='progressSlice'><div className='difficultyPlatinum' style={{width: difficulty.course.Platinum + '%'}}></div></div>) : (<></>) }
                { (difficulty.course.Kryptonite != null) ? (<div className='progressSlice'><div className='difficultyKryptonite' style={{width: difficulty.course.Kryptonite + '%'}}></div></div>) : (<></>) }
              </div>
            </td>
          </tr>
        ))}
      </table>
    </>
  }/>)
}

export default CourseProgressDifficultyPage

//
//{ }
//{ (progress.kryptonite != null) ? (<div className='difficultyKryptonite'></div>) : (</></>)}
