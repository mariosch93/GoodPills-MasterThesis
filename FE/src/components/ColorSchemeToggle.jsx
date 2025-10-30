// components/ColorSchemeToggle.jsx
import { useEffect, useState } from 'react'
import IconButton from '@mui/joy/IconButton'
import { useColorScheme } from '@mui/joy/styles'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'

const ColorSchemeToggle = () => {
  const { mode, setMode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <IconButton
      aria-label='toggle light/dark mode'
      size='sm'
      variant='outlined'
      disabled={!mounted}
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  )
}

export default ColorSchemeToggle
