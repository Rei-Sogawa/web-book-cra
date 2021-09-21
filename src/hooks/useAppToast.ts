import { useToast } from '@chakra-ui/toast'

export const useAppToast = () => {
  const toast = useToast()

  const success = (title: string) =>
    toast({
      title,
      status: 'success',
      position: 'top-right',
      isClosable: true,
    })

  const info = (title: string) =>
    toast({
      title,
      status: 'info',
      position: 'top-right',
      isClosable: true,
    })

  const error = (title: string) =>
    toast({
      title,
      status: 'error',
      position: 'top-right',
      isClosable: true,
    })

  const warning = (title: string) =>
    toast({
      title,
      status: 'warning',
      position: 'top-right',
      isClosable: true,
    })

  return {
    success,
    info,
    error,
    warning,
  }
}
