import PrivateRoute from '@/components/privateRoute'
import VerifyEmailForm from '@/components/auth/verify-email-form'
import React from 'react'

const VerifyEmailPage = () => {
  return (
    <PrivateRoute>
      <div>
        <VerifyEmailForm />
      </div>
    </PrivateRoute>
  )
}

export default VerifyEmailPage