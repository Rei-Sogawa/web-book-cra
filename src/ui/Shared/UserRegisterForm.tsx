import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import { VFC } from 'react'
import { useForm } from 'react-hook-form'

export type FormValues = {
  email: string
  password: string
}

export type UserRegisterFormProps = {
  submitButtonText: string
  onSubmit: (values: FormValues) => Promise<void>
}

export const UserRegisterForm: VFC<UserRegisterFormProps> = ({ submitButtonText, onSubmit }) => {
  const { handleSubmit, register } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="8" alignItems="stretch">
        <VStack spacing="4">
          <FormControl>
            <FormLabel fontSize="sm">メールアドレス</FormLabel>
            <Input type="email" {...register('email')} required autoComplete="off" />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">パスワード</FormLabel>
            <Input type="password" {...register('password')} required autoComplete="off" />
          </FormControl>
        </VStack>

        <Button type="submit" colorScheme="blue">
          {submitButtonText}
        </Button>
      </VStack>
    </form>
  )
}
