import { Word } from "@/pages/api/words";
import axios from "axios";
import { toast } from "sonner";
import type { Response } from "../pages/api/words";

export const wordsService = {
  async add(data: { [k: string]: FormDataEntryValue }) {
    for (let key in data) {
      if (!data[key]) {
        toast.error("Todos los campos son requeridos");
        return;
      }
    }
    const response = await axios.post<Response>("/api/words", data);
    if (response.data.error) {
      toast.error(response.data.message);
      return;
    }
    toast.success("Palabra agregada correctamente");
  },
  filterWords(input: string) {
    return (word: Word) => {
      return (
        word.english.toLowerCase().includes(input.toLowerCase()) ||
        word.spanish.toLowerCase().includes(input.toLowerCase())
      );
    };
  },
};
