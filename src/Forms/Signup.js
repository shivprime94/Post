import axios from 'axios'
import React from 'react'
import { SIGNUP_URL } from '../config/constants'
import './Forms.css'

const Signup = (props) => {
  var signUpEmail = null
  var signUpName = null
  var signUpPhone = null
  var signUpPassword = null
  var signUpConfirmPassword = null

  const updateEmail = (input) => {
    signUpEmail = input
  }

  const updateName = (input) => {
    signUpName = input
  }

  const updatePhone = (input) => {
    signUpPhone = input
  }

  const updatePassword = (input) => {
    signUpPassword = input
  }

  const updateConfirmPassword = (input) => {
    signUpConfirmPassword = input
  }

  const validate = (event) => {
    event.preventDefault()
    var mailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (signUpName != null) {
      if (signUpEmail != null && signUpEmail.match(mailFormat)) {
        if (signUpPassword != null && signUpPassword.length > 6) {
          if (signUpPassword === signUpConfirmPassword) {
            axios
              .post(SIGNUP_URL, {
                name: signUpName,
                email: signUpEmail,
                phone: signUpPhone,
                password: signUpPassword,
              })
              .then((response) => {
                props.notify('Created Account ' + signUpName)
                props.submit(response)
              })
              .catch((error) => {
                props.notify(error.response.data.msg)
              })
          } else {
            props.notify('Password and Confirmatory password do not match!')
          }
        } else {
          props.notify('Password is less than 6 character short!')
        }
      } else {
        props.notify('Email Invalid !!!')
      }
    } else {
      props.notify('Invalid Name!!!')
    }
  }

  return (
    <section className='signup'>
      <div className='form-redirect'>
        <div className='form-change-text'>
          <h2>Already have an Account ?</h2>
        </div>
        <button className='form-btn form-change-btn' onClick={props.change}>
          Sign In
        </button>
      </div>
      <div className='container mt-5'>
        <div className='signup-form'>
          <h1>Sign Up</h1>
          <form action='noaction.php'>
            <div className='form-group'>
              {/* <TextField
                id='standard-basic'
                label='Full Name'
                defaultValue='Virat Kohli'
                onChange={(event) => updateName(event.target.value)}
              /> */}

              <input
                type='text'
                name=''
                placeholder='Full Name'
                onChange={(event) => updateName(event.target.value)}
              />
            </div>
            <div className='form-group'>
              {/* <TextField
                id='standard-basic'
                type='email'
                label='Email'
                defaultValue='virat@gmail.com'
                onChange={(event) => updateEmail(event.target.value)}
              />  */}
              <input
                onChange={(event) => updateEmail(event.target.value)}
                type='email'
                placeholder='virat@gmail.com'
                className='input-field'
              />
            </div>
            <div className='form-group'>
              {/* <TextField
                id='standard-basic'
                label='Phone Number'
                defaultValue='+91xxxxxxxxx'
                type='number'
                onChange={(event) => updatePhone(event.target.value)}
              /> */}
              <input
                onChange={(event) => updatePhone(event.target.value)}
                type='tel'
                placeholder='Phone Number'
                className='input-field'
              />
            </div>
            <div className='form-group'>
              {/* <TextField
                id='standard-basic'
                label='Password'
                defaultValue='More than 6 digits'
                type='password'
                onChange={(event) => updatePassword(event.target.value)}
              /> */}
              <input
                onChange={(event) => updatePassword(event.target.value)}
                type='password'
                className='input-field'
                placeholder='6+ characters'
              />
            </div>
            <div className='form-group'>
              {/* <TextField
                id='standard-basic'
                label='Confirm Password'
                defaultValue='More than 6 digits'
                type='password'
                onChange={(event) => updateConfirmPassword(event.target.value)}
              /> */}
              <input
                onChange={(event) => updateConfirmPassword(event.target.value)}
                type='password'
                className='input-field'
                placeholder='6+ characters'
              />
            </div>

            <button onClick={validate} className='btn'>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Signup
