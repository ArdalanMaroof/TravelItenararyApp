import React from 'react'
import { Signup } from '../components/Signup'
import { Box } from '@mui/material'

export const SignupPage = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Signup />
    </Box>
  )
}
