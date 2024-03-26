import { useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import { Toaster, toast } from "sonner";
import { NewWordForm } from "@/components/NewWordForm";
import { wordsService } from "@/services/words.service";
import type { FormEvent } from "react";
import type { Response, Word } from "./api/words";

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

  const onSubmitSearchBar = async (evt: FormEvent) => {
    evt.preventDefault();
    if (data && data.data) {
      const foundItems = data?.data.filter(
        wordsService.filterWords(searchValue)
      ).length;
      if (foundItems === 0) {
        const [english, spanish] = searchValue.split("@");
        if (!english || !spanish) {
          toast(
            "Por favor, recuerda que para agregar una palabra necesita estar separada por un @"
          );
        } else {
          await wordsService.add({ english, spanish });
          setSearchValue("");
          mutate();
        }
      }
    }
  };

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
        <SearchBar
          onChangeInput={onChangeInput}
          onToggle={onToggle}
          searchValue={searchValue}
          onSubmitForm={onSubmitSearchBar}
        />
        <section className="flex flex-col gap-4 ">
          {isLoading &&
            new Array(3)
              .fill(0)
              .map((v, i) => (
                <WordCardSkeleton key={`Home_WordCardSkeleton_${i}`} />
              ))}
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
  onSubmitForm: (evt: FormEvent) => void;
  searchValue: string;
};

function SearchBar({
  onChangeInput,
  onToggle,
  searchValue,
  onSubmitForm,
}: SearchBarProps) {
  return (
    <form className="flex items-center" onSubmit={onSubmitForm}>
      <input
        className="w-full p-4 rounded-md my-5 text-slate-800 font-bold"
        type="text"
        placeholder="buscar..."
        onChange={onChangeInput}
        value={searchValue}
      />
      <button
        type="button"
        className="bg-blue-700 p-4 rounded-md font-bold ml-3"
        onClick={onToggle}
      >
        Agregar
      </button>
    </form>
  );
}

function WordCardSkeleton() {
  return (
    <div className="animate-pulse bg-gray-700 rounded-md p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="mt-2 h-5 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
