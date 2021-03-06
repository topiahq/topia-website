import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { ConfirmationBar, Line, InputWithLabel, SubmitButton } from '../Form'
import { Card, GrayLink, FormContainer, SaveBtnContainer } from './Card'
import { updateProfile } from '../../utils/user'
import { isEmpty } from 'ramda'
import IconInfo from '../../assets/icon-info.png'
import ReactTooltip from 'react-tooltip'

const Account = ({store}) => {
  const { token } = store.CurrentUser
  const { name, email } = store.CurrentUser.user
  const [userParams, setUserParams] = useState({ name, email })
  const [errors, setErrors] = useState({})
  const [ showConfirmation, setConfirmation] = useState(false)

  const validate = () => {
    const currentErrors = { ...errors }

    if(!userParams.currentPassword) {
      currentErrors.currentPassword = 'Current password needed'
    } else {
      delete currentErrors.currentPassword
    }

    if (userParams.password || userParams.verifyPassword) {
      if(userParams.verifyPassword !== userParams.password) {
        currentErrors.verifyPassword = 'Password does not match'
      } else {
        delete currentErrors.verifyPassword
      }
    }

    setErrors(currentErrors)

    return isEmpty(currentErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(validate()) {
      const response = await updateProfile({ token, ...userParams })
      store.UpdateProfile(response)
      setConfirmation(true)
      setTimeout(() => setConfirmation(false), 3000) // close after 3 sec.
    }
  }

  const handleUpdate = (e) => {
    const params = {...userParams}
    params[e.target.name] = e.target.value
    setUserParams(params)
  }

  return (
  <Card onSubmit={handleSubmit}>
    {showConfirmation && <ConfirmationBar>
      <span role="img" aria-label='OK emoji'>✌️</span> Your changes have been saved.
    </ConfirmationBar>}
    <div className='header'>
      <div>
        <h1>Account</h1>
        <p>Change your email or password here..</p>
      </div>
      <SaveBtnContainer>
        <SubmitButton label='Save' />
      </SaveBtnContainer>
    </div>
    <a href="#account" id="account"></a>
    <Line />
    <FormContainer>
      <div className='row' style={{width: '100%'}}>
        <div className='col' style={{width: '80%'}}>
          <InputWithLabel
            handleUpdate={handleUpdate}
            value={userParams.email}
            label='Email'
            type='email'
            name='email'
          />
        </div>
        <div
          className='col'
          style={{width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
          <img data-tip="You will have to verify your email change with your old and new email account." src={IconInfo} alt='icon info' />
        </div>
      </div>

    </FormContainer>
    <Line />
    <FormContainer>
      <InputWithLabel
        error={errors.currentPassword}
        handleUpdate={handleUpdate}
        label='Current Password'
        type='password'
        name='currentPassword'
      />
      <InputWithLabel
        handleUpdate={handleUpdate}
        label='New Password'
        type='password'
        name='password'
      />
      <InputWithLabel
        error={errors.verifyPassword}
        handleUpdate={handleUpdate}
        label='Verify Password'
        type='password'
        name='verifyPassword'
      />
    </FormContainer>
    <Line />
    <FormContainer>
      <b>Delete Account</b>
      <p>
        You can request the deletion of your account here and after 7 days your
        account will be automatically deleted. Note that this action can’t be undone.
      </p>
      <GrayLink href='/' data-tip="Not available yet.">
        Request Account Deletion
      </GrayLink>
    </FormContainer>
    <ReactTooltip />
  </Card>
  )
}

export default inject(`store`)(observer(Account))
