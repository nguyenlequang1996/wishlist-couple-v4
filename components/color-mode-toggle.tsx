"use client"

import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"

export function ColorModeToggle() {
  const { toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)
  const modeText = useColorModeValue("Dark Mode", "Light Mode")

  return (
    <IconButton
      aria-label={`Switch to ${modeText}`}
      icon={<SwitchIcon />}
      variant="ghost"
      onClick={toggleColorMode}
      color={useColorModeValue("gray.600", "gray.400")}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.700"),
      }}
    />
  )
}
