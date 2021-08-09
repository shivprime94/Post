import React from 'react'
import axios from 'axios'
// import './Login.css'
import './Forms.css'

import { SIGNIN_URL } from '../config/constants'
// import TextField from '@material-ui/core/TextField'
const Signin = (props) => {
  var signInEmail = null
  var signInPassword = null

  const updateEmail = (input) => {
    signInEmail = input
  }

  const updatePassword = (input) => {
    signInPassword = input
  }

  const validate = (event) => {
    event.preventDefault()
    var mailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (signInEmail != null && signInEmail.match(mailFormat)) {
      if (signInPassword != null && signInPassword.length > 6) {
        axios
          .post(SIGNIN_URL, {
            email: signInEmail,
            password: signInPassword,
          })
          .then((response) => {
            props.submit(response.data.token)
          })
          .catch((error) => {
            props.notify(error.response.data.msg)
          })
      } else {
        props.notify('Password too short!')
      }
    } else {
      props.notify('Email address not valid')
    }
    console.log(signInEmail)
  }

  return (
    <div className='signup'>
      <div className='form-redirect'>
        <div className='form-change-text'>
          <h2>Don't have an account ?</h2>
        </div>
        <button className='form-btn form-change-btn' onClick={props.change}>
          Sign Up
        </button>
      </div>

      <div>
        <h1>Sign In</h1>
        <div className='form'>
          <form action='noaction.php'>
            <div className='form-group'>
              <input
                className='input-2'
                onChange={(event) => updateEmail(event.target.value)}
                type='email'
                placeholder='virat@gmail.com'
              />
            </div>
            <div className='form-group'>
              <input
                className='input-2'
                onChange={(event) => updatePassword(event.target.value)}
                type='password'
                placeholder='More than 6 character'
              />
            </div>
            <button onClick={(event) => validate(event)} className='btn-2'>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signin
