import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import Head from "next/head";
import useSWR from "swr";
import axios from "axios";
import { Toaster, toast } from "sonner";
import type { FormEvent } from "react";
import type { Response, Word } from "./api/words";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const filterWord = (input: string) => (word: Word) => {
  return (
    word.english.toLowerCase().includes(input.toLowerCase()) ||
    word.spanish.toLowerCase().includes(input.toLowerCase())
  );
};

export default function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [formModal, setFormModal] = useState(false);
  const { data, isLoading, mutate } = useSWR<Response>("/api/words", fetcher);
  const formRef = useRef<HTMLFormElement>(null);

  const onChangeInput = (evt: FormEvent<HTMLInputElement>) => {
    const { value } = evt.target as HTMLInputElement;
    setSearchValue(value);
  };

  const onSubmitForm = async (evt: FormEvent) => {
    evt.preventDefault();
    const data = Object.fromEntries(
      new FormData(formRef.current as HTMLFormElement)
    );
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
    formRef.current?.reset();
    mutate();
  };

  if (isLoading) return null;
  if (!data?.data) return null;

  return (
    <>
      <Head>
        <title>Words | Home</title>
      </Head>
      <main className="p-5 w-5/12 max-xl:w-8/12 my-0 mx-auto">
        <Toaster />
        <Modal isOpen={formModal}>
          <form
            ref={formRef}
            className="w-4/12 max-md:w-full max-md:mx-4 max-xl:w-6/12  grid gap-2 bg-slate-50 p-4 rounded"
            onSubmit={onSubmitForm}
          >
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
              Agregar Palabra
            </h2>
            <div className="flex flex-col bg-stone-100 text-slate-900 py-2 px-4 rounded">
              <label htmlFor="" className="text-sm text-gray-400">
                Palabra en Inglés
              </label>
              <input
                type="text"
                name="english"
                className="bg-transparent py-1 outline-none"
                placeholder="escribe aquí..."
              />
            </div>
            <div className="flex flex-col bg-stone-100 text-slate-900 py-2 px-4 rounded">
              <label htmlFor="" className="text-sm text-gray-400">
                Palabra en Español
              </label>
              <input
                type="text"
                name="spanish"
                className="bg-transparent py-1 outline-none"
                placeholder="escribe aquí..."
              />
            </div>
            <div className="flex gap-3">
              <button className="text-white bg-blue-700 py-2 rounded-md font-bold w-full">
                Agregar
              </button>
              <button
                type="button"
                className="text-white bg-red-500 py-2 rounded-md font-bold w-full"
                onClick={() => setFormModal(false)}
              >
                Cerrar
              </button>
            </div>
          </form>
        </Modal>
        <h1 className="text-4xl font-bold text-center">Palabras en Inglés</h1>
        <section className="flex items-center">
          <input
            className="w-full p-4 rounded-md my-5 text-slate-800 font-bold"
            type="text"
            placeholder="buscar..."
            onChange={onChangeInput}
          />
          <button
            className="bg-blue-700 p-4 rounded-md font-bold ml-3"
            onClick={() => setFormModal(true)}
          >
            Agregar
          </button>
        </section>
        <section className="flex flex-col gap-4 ">
          {data?.data.filter(filterWord(searchValue)).map((word: Word) => {
            return <WordCard key={`Home_WordCard_${word.id}`} data={word} />;
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

type PortalProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

function Modal({ children, isOpen = false }: PortalProps) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed left-0 top-0 flex justify-center items-center h-screen w-full bg-slate-900/80 backdrop-blur">
      {children}
    </div>,
    document.getElementById("portal") as Element
  );
}
