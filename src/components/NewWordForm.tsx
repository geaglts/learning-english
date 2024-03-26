import { useRef } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Modal } from "./Modal";
import type { FormEvent } from "react";
import type { Response } from "../pages/api/words";
import { wordsService } from "@/services/words.service";

type NewWordFormProps = {
  isOpen: boolean;
  updateWords: () => void;
  onToggle: () => void;
};

export function NewWordForm({
  isOpen,
  updateWords,
  onToggle,
}: NewWordFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmitForm = async (evt: FormEvent) => {
    evt.preventDefault();
    const data = Object.fromEntries(
      new FormData(formRef.current as HTMLFormElement)
    );
    await wordsService.add(data);
    formRef.current?.reset();
    updateWords();
  };

  return (
    <Modal isOpen={isOpen}>
      <form
        ref={formRef}
        className="w-4/12 max-md:w-full max-md:mx-4 max-xl:w-6/12  grid gap-2 bg-slate-50 p-4 rounded"
        onSubmit={onSubmitForm}
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Agregar Palabra
        </h2>
        <FormInput
          id="palabra_en_ingles"
          label="Palabra en Inglés"
          name="english"
        />
        <FormInput
          id="palabra_en_español"
          label="Palabra en Español"
          name="spanish"
        />
        <GeneralFormAction primaryText="Agregar" onToggle={onToggle} />
      </form>
    </Modal>
  );
}

type FormInputProps = {
  label: string;
  name: string;
  id: string;
};

function FormInput(props: FormInputProps) {
  return (
    <div className="flex flex-col bg-stone-100 text-slate-900 py-2 px-4 rounded">
      <label htmlFor={props.id} className="text-sm text-gray-400">
        {props.label}
      </label>
      <input
        id={props.id}
        type="text"
        name={props.name}
        className="bg-transparent py-1 outline-none"
        placeholder="escribe aquí..."
      />
    </div>
  );
}

type GeneralFormActionProps = {
  onToggle: () => void;
  primaryText: string;
};

function GeneralFormAction(props: GeneralFormActionProps) {
  return (
    <div className="flex gap-3">
      <button className="text-white bg-blue-700 py-2 rounded-md font-bold w-full">
        {props.primaryText}
      </button>
      <button
        type="button"
        className="text-white bg-red-500 py-2 rounded-md font-bold w-full"
        onClick={props.onToggle}
      >
        Cerrar
      </button>
    </div>
  );
}
