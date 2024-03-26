import { useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import { Toaster } from "sonner";
import { NewWordForm } from "@/components/NewWordForm";
import { wordsService } from "@/services/words.service";
import type { FormEvent } from "react";
import type { Response, Word } from "./api/words";
import { Loading } from "@/components/Loading";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [formModal, setFormModal] = useState(false);
  const { data, isLoading, mutate } = useSWR<Response>("/api/words", fetcher);

  const onChangeInput = (evt: FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;
    setSearchValue(value);
  };

  const onToggle = () => {
    setFormModal(!formModal);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Toaster />
      <Head>
        <title>Words | Home</title>
      </Head>
      <main className="p-5 w-5/12 max-xl:w-8/12 my-0 mx-auto">
        <NewWordForm
          isOpen={formModal}
          updateWords={mutate}
          onToggle={onToggle}
        />
        <h1 className="text-4xl font-bold text-center">Palabras en Inglés</h1>
        <SearchBar onChangeInput={onChangeInput} onToggle={onToggle} />
        <section className="flex flex-col gap-4 ">
          {data?.data &&
            data?.data
              .filter(wordsService.filterWords(searchValue))
              .map((word: Word) => {
                return (
                  <WordCard key={`Home_WordCard_${word.id}`} data={word} />
                );
              })}
        </section>
      </main>
    </>
  );
}

type WordCardProps = {
  data: Word;
};

function WordCard({ data }: WordCardProps) {
  return (
    <div key={data.id} className="bg-slate-700 rounded-md p-4">
      <h2 className="font-bold capitalize text-xl">{data.spanish}</h2>
      <p className="text-lg">{data.english}</p>
    </div>
  );
}

type SearchBarProps = {
  onChangeInput: (evt: FormEvent<HTMLInputElement>) => void;
  onToggle: () => void;
};

function SearchBar({ onChangeInput, onToggle }: SearchBarProps) {
  return (
    <section className="flex items-center">
      <input
        className="w-full p-4 rounded-md my-5 text-slate-800 font-bold"
        type="text"
        placeholder="buscar..."
        onChange={onChangeInput}
      />
      <button
        className="bg-blue-700 p-4 rounded-md font-bold ml-3"
        onClick={onToggle}
      >
        Agregar
      </button>
    </section>
  );
}
