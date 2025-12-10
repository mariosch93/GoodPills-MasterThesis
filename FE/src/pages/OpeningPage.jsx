import { CssVarsProvider, extendTheme } from '@mui/joy'
import GlobalStyles from '@mui/joy/GlobalStyles'
import CssBaseline from '@mui/joy/CssBaseline'
import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import Divider from '@mui/joy/Divider'
import FormControl from '@mui/joy/FormControl'
import FormLabel from '@mui/joy/FormLabel'
import IconButton from '@mui/joy/IconButton'
import Link from '@mui/joy/Link'
import Input from '@mui/joy/Input'
import Typography from '@mui/joy/Typography'
import Stack from '@mui/joy/Stack'
import medicineLight from '../assets/images/medicine_light.jpg'
import medicineDark from '../assets/images/medicine_dark.jpg'
import ColorSchemeToggle from '../components/ColorSchemeToggle.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/axiosInstance.js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import medicineLogo from '../assets/images/medicineLogo.png'

const customTheme = extendTheme()

export default function JoySignInSideTemplate () {
  const navigate = useNavigate()

  // State to manage the form data (email and password)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // State to manage any error messages from the login attempt
  const [error, setError] = useState(null)

  // State to manage a success message on successful login
  const [successMessage, setSuccessMessage] = useState(null)

  // Function to handle changes in the input fields
  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  // Function to handle the form submission
  const handleSubmit = async event => {
    event.preventDefault()
    setError(null) // Clear previous errors
    setSuccessMessage(null) // Clear previous success messages
    console.log(event)

    try {
      // Make the POST request to the C# backend using Axios
      // const response = await axios.post(
      //   "https://localhost:7056/api/Auth/login",
      //   {
      //     email: formData.email,
      //     password: formData.password,
      //   }
        // );
      // dummy commit v4
      const response = await api.post('Auth/login', {
        email: formData.email,
        password: formData.password
      })

      const token = response.data.token
      console.log('Login successful. Token:', token)

      localStorage.setItem('jwt_token', token)

      // Set the success message
      setSuccessMessage('Login successful!')

      // Navigate to the home page after a short delay so the user can see the message
      setTimeout(() => {
        navigate('/home')
      }, 1500)
    } catch (err) {
      // Handle different types of errors from the API call
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        console.error('Login failed:', err.response.data)
        setError(`Login failed: ${err.response.data || 'Invalid credentials'}`)
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Network error:', err.request)
        setError('Network error. No response from server.')
      } else {
        // Something else happened in setting up the request
        console.error('Error setting up the request:', err.message)
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <CssVarsProvider
      theme={customTheme}
      defaultMode='dark'
      modeStorageKey='goodpills-color-scheme'
      disableTransitionOnChange
    >
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s' // set to `none` to disable transition
          }
        }}
      />
      <Box
        sx={theme => ({
          width: { xs: '100%', md: '50vw' },
          transition: 'width var(--Transition-duration)',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255 255 255 / 0.2)',
          [theme.getColorSchemeSelector('dark')]: {
            backgroundColor: 'rgba(19 19 24 / 0.4)'
          }
        })}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100dvh',
            width: '100%',
            px: 2
          }}
        >
          <Box
            component='header'
            sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}
          >
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <IconButton
                onClick={() => navigate('/')}
                color='primary'
                size='sm'
              >
                <img
                  src={medicineLogo}
                  alt='site logo'
                  width={24}
                  height={24}
                />
              </IconButton>
              <Typography level='title-lg'>Welcome to GoodPills</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
          <Box
            component='main'
            sx={{
              my: 'auto',
              py: 2,
              pb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: 400,
              maxWidth: '100%',
              mx: 'auto',
              borderRadius: 'sm',
              '& form': {
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              },
              [`& .MuiFormLabel-asterisk`]: {
                visibility: 'hidden'
              }
            }}
          >
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component='h1' level='h3'>
                  Sign in
                </Typography>
                <Typography level='body-sm'>
                  New customer?{' '}
                  <Link
                    onClick={() => navigate('/signup')}
                    level='title-sm'
                    sx={{ cursor: 'pointer' }}
                  >
                    Sign up!
                  </Link>
                </Typography>
              </Stack>
            </Stack>
            <Divider
              sx={theme => ({
                [theme.getColorSchemeSelector('light')]: {
                  color: { xs: '#FFF', md: 'text.tertiary' }
                }
              })}
            >
              or
            </Divider>
            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Link
                      onClick={() => navigate('/resetpasswordopening')}
                      level='title-sm'
                      sx={{ cursor: 'pointer' }}
                    >
                      Forgot your password?
                    </Link>
                  </Box>
                  <Button type='submit' fullWidth>
                    Sign in
                  </Button>
                  <Button
                    type='submit'
                    fullWidth
                    onClick={() => {
                      localStorage.clear()
                      navigate('/home')
                    }}
                  >
                    Continue without login
                  </Button>
                </Stack>
              </form>
              {/* Display a success message in green on successful login */}
              {successMessage && (
                <div
                  className='p-4 mt-4 text-sm text-center text-green-700 bg-green-100 rounded-lg'
                  role='status'
                >
                  {successMessage}
                </div>
              )}

              {/* Display any login errors in red */}
              {error && (
                <div
                  className='p-4 mt-4 text-sm text-center text-red-700 bg-red-100 rounded-lg'
                  role='alert'
                >
                  {error}
                </div>
              )}
            </Stack>
          </Box>
          <Box component='footer' sx={{ py: 3 }}>
            <Typography level='body-xs' sx={{ textAlign: 'center' }}>
              © GoodPills {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={theme => ({
          height: '100%',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: '50vw' },
          transition:
            'background-image var(--Transition-duration), left var(--Transition-duration) !important',
          transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
          backgroundColor: 'background.level1',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundImage: `url(${medicineLight})`,
          [theme.getColorSchemeSelector('dark')]: {
            backgroundImage: `url(${medicineDark})`
          }
        })}
      />
    </CssVarsProvider>
  )
}
