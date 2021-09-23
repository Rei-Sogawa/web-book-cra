import { AddIcon } from '@chakra-ui/icons'
import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import { VFC } from 'react'

import { numberToTwoDigits } from '@/lib/display'
import { Chapter } from '@/model/chapter'

export type ChaptersProps = {
  chapters: Chapter[]
  onAddChapter: () => Promise<void>
  onClickChapter: (chapterId: string) => Promise<void>
}

export const Chapters: VFC<ChaptersProps> = ({ chapters, onAddChapter, onClickChapter }) => {
  return (
    <VStack spacing="8">
      <Text alignSelf="start" fontWeight="bold" fontSize="2xl">
        Chapters
      </Text>

      {chapters.length && (
        <VStack alignSelf="stretch" alignItems="stretch" spacing="0.5">
          {chapters.map((chapter) => (
            <HStack key={chapter.id} bg="white" py="4" px="8" spacing="8">
              <Text fontWeight="bold" fontSize="lg" fontFamily="mono" color="blue.300">
                {numberToTwoDigits(chapter.number)}
              </Text>
              <Button
                onClick={() => onClickChapter(chapter.id)}
                variant="link"
                color="black"
                fontWeight="bold"
                fontSize="lg"
              >
                {chapter.title || '無題のチャプター'}
              </Button>
            </HStack>
          ))}
        </VStack>
      )}

      <Button
        alignSelf="stretch"
        size="lg"
        variant="outline"
        color="gray.500"
        _hover={{ background: 'white' }}
        _active={{ background: 'white' }}
        leftIcon={<AddIcon />}
        onClick={onAddChapter}
      >
        チャプターを追加
      </Button>
    </VStack>
  )
}
