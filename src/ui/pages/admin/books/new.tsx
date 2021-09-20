import { Button, Container, Icon, Textarea, VStack } from '@chakra-ui/react'
import { FormEventHandler, useState, VFC } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useHistory } from 'react-router'

import { BookData } from '@/domain/book'
import { routeMap } from '@/routes'
import { BookService } from '@/service/book'

type BookNewPageProps = {
  createBook: (newBookData: Pick<BookData, 'title'>) => Promise<string>
}

const BookNewPage: VFC<BookNewPageProps> = ({ createBook }) => {
  const history = useHistory()

  const handleClickBack = () => {
    history.push(routeMap['/'].path())
  }

  const [title, setTitle] = useState('')

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const newBookId = await createBook({ title })
    history.push(routeMap['/admin/books/:bookId/edit'].path({ bookId: newBookId }))
  }

  return (
    <VStack minH="100vh" bg="gray.50">
      <Container maxW="container.lg" h="14" display="flex" alignItems="center">
        <Button variant="link" p="1" onClick={handleClickBack}>
          <Icon as={FaArrowLeft} h="6" w="6" color="gray.500" />
        </Button>
      </Container>

      <Container
        maxW="container.lg"
        flex="1"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        pb="14"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing="8">
            <Textarea
              placeholder="本のタイトルを入力"
              bg="white"
              fontSize="2xl"
              fontWeight="bold"
              width="320px"
              rows={12}
              p="8"
              resize="none"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button type="submit" colorScheme="blue">
              本を作る
            </Button>
          </VStack>
        </form>
      </Container>
    </VStack>
  )
}

const BookNewPageContainer: VFC = () => {
  const createBook = async (newBookData: Pick<BookData, 'title'>) => {
    const docSnap = await BookService.createDoc(newBookData)
    return docSnap.id
  }

  return <BookNewPage createBook={createBook} />
}

export default BookNewPageContainer
