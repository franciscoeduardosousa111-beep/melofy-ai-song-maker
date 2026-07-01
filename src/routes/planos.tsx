import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useMusicStore } from "@/stores/useMusicStore";

export const Route = createFileRoute("/planos")({
  component: PlansPage,
});

const plans = [
  { id: "1", name: "1 música", price: "R$ 29,90", per: "R$ 29,90/música", featured: false },
  { id: "5", name: "5 músicas", price: "R$ 49,90", per: "R$ 9,98/música", featured: false },
  { id: "30", name: "30 músicas", price: "R$ 99,90", per: "R$ 3,33/música", featured: true },
];

function PlansPage() {
  const navigate = useNavigate();
  const selected = useMusicStore((s) => s.selectedPlan);
  const setSelectedPlan = useMusicStore((s) => s.setSelectedPlan);

  const handlePick = (id: string) => {
    setSelectedPlan(id);
    navigate({ to: "/pagamento" });
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight">
          Escolha seu <span className="text-gradient-brand">plano</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Pague uma vez. Sem assinatura.</p>
      </div>

      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const active = selected === plan.id;
          return (
            <button
              key={plan.id}
              onClick={() => handlePick(plan.id)}
              className={`relative flex items-center justify-between rounded-2xl border p-5 text-left transition-all ${
                active
                  ? "border-transparent btn-gradient"
                  : plan.featured
                  ? "border-primary/60 bg-surface"
                  : "border-border/60 bg-surface"
              }`}
            >
              {plan.featured && !active && (
                <span className="absolute -top-2 right-4 flex items-center gap-1 rounded-full btn-gradient px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> Mais vantajoso
                </span>
              )}
              <div>
                <div className="text-lg font-extrabold">{plan.name}</div>
                <div className={`text-xs ${active ? "text-white/80" : "text-muted-foreground"}`}>{plan.per}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xl font-extrabold">{plan.price}</div>
                <div className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-white bg-white" : "border-border"}`}>
                  {active && <Check className="h-4 w-4 text-primary" strokeWidth={3} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigate({ to: "/pagamento" })}
        className="mt-auto w-full rounded-2xl btn-gradient py-4 text-base font-bold"
      >
        Continuar para pagamento
      </button>
    </div>
  );
}
