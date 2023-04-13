import { Word } from "@/pages/api/words";

export const wordsService = {
  filterWords(input: string) {
    return (word: Word) => {
      return (
        word.english.toLowerCase().includes(input.toLowerCase()) ||
        word.spanish.toLowerCase().includes(input.toLowerCase())
      );
    };
  },
};
