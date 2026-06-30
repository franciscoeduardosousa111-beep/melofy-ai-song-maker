import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Info, Lock } from "lucide-react";

export const Route = createFileRoute("/pagamento")({
  component: PaymentPage,
});

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...props}
        className="rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function PaymentPage() {
  const navigate = useNavigate();
  const [save, setSave] = useState(true);

  return (
    <div className="flex flex-1 flex-col gap-5">
      <h1 className="text-2xl font-extrabold">Pagamento</h1>

      <div className="rounded-2xl border border-border/60 bg-surface p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">5 músicas</span>
          <span className="font-semibold">R$ 49,90</span>
        </div>
        <div className="my-3 h-px bg-border" />
        <div className="flex items-center justify-between text-base">
          <span className="font-bold">Total</span>
          <span className="font-extrabold text-gradient-brand">R$ 49,90</span>
        </div>
      </div>

      <Field label="E-mail" type="email" defaultValue="voce@email.com" />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome" placeholder="João" />
        <Field label="Sobrenome" placeholder="Silva" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground">Número do cartão</span>
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface px-4 py-3">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="0000 0000 0000 0000"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          />
          <div className="flex items-center gap-1">
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-blue-700">VISA</span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-red-600">MC</span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-sky-700">AMEX</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Validade" placeholder="MM/AA" />
        <Field label="CVC" placeholder="123" />
      </div>

      <Field label="CPF" placeholder="000.000.000-00" />

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={save}
          onChange={(e) => setSave(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[color:var(--primary)]"
        />
        <span>Guardar dados para uso futuro</span>
      </label>

      <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-accent/30 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Pagamentos internacionais podem ter IOF de 3,5% aplicado pelo seu banco.</span>
      </div>

      <button
        onClick={() => navigate({ to: "/resultado" })}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl btn-gradient py-4 text-base font-bold"
      >
        <Lock className="h-4 w-4" /> Pagar R$ 49,90
      </button>
    </div>
  );
}
