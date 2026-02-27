import { useState } from "react";
import CustomModal from "../../../shared/components/CustomModal";

export default function Tasks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          onClick={() => setOpen(true)}
          type="button"
        >
          Nova tarefa
        </button>
      </div>

      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title="Criar tarefa"
        footer={
          <>
            <button
              className="rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
              onClick={() => setOpen(false)}
              type="button"
            >
              Salvar
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Título</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Ex: Configurar TaskForm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Descrição
            </label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="O que precisa ser feito?"
              rows={4}
            />
          </div>
        </div>
      </CustomModal>
    </div>
  );
}