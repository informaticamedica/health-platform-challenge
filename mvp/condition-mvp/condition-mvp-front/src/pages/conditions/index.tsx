import { useAuth } from "@/context/auth";
import {
  createCondition,
  getConditions,
} from "@/services/backend";
import { ConditionPayloadType, ConditionType } from "@/types/dto.type";
import { Button, SectionBanner } from "@platform/design-system";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialForm: ConditionPayloadType = {
  patient_id: "",
  clinical_status: "active",
  verification_status: "confirmed",
  code: "",
  recorded_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function ConditionsPage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [conditions, setConditions] = useState<ConditionType[]>([]);
  const [form, setForm] = useState<ConditionPayloadType>(initialForm);

  useEffect(() => {
    const load = async () => {
      if (!session?.accessToken) {
        navigate("/");
        return;
      }
      const response = await getConditions(session.accessToken);
      if (response.error) {
        if (response.status === 401) {
          await signOut();
          navigate("/");
        }
        return;
      }
      setConditions(response.data);
    };

    load().catch((error: unknown) => {
      console.error("Error loading conditions", error);
    });
  }, [navigate, session?.accessToken, signOut]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.accessToken) return;
    const response = await createCondition({
      accessToken: session.accessToken,
      condition: form,
    });
    if (!response.error) {
      setConditions((prev) => [response.data, ...prev]);
      setForm(initialForm);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <SectionBanner
        variant="primary"
        title="Conditions"
        description="Registro rapido de condiciones clinicas por paciente."
      />

      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5">
        <input className="rounded border p-2" placeholder="Patient ID" value={form.patient_id} onChange={(e) => setForm({ ...form, patient_id: e.target.value })} required />
        <input className="rounded border p-2" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <select className="rounded border p-2" value={form.clinical_status} onChange={(e) => setForm({ ...form, clinical_status: e.target.value as ConditionPayloadType["clinical_status"] })}>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="resolved">resolved</option>
        </select>
        <select className="rounded border p-2" value={form.verification_status} onChange={(e) => setForm({ ...form, verification_status: e.target.value as ConditionPayloadType["verification_status"] })}>
          <option value="confirmed">confirmed</option>
          <option value="provisional">provisional</option>
          <option value="refuted">refuted</option>
        </select>
        <Button type="submit">Crear</Button>
      </form>

      <div className="mt-6 grid gap-3">
        {conditions.map((item) => (
          <Link key={item.id} to={`/conditions/${item.id}`} className="rounded-xl border border-border bg-card p-4 hover:bg-muted/50">
            <p className="text-sm font-semibold">{item.code}</p>
            <p className="text-xs text-muted-foreground">Paciente {item.patient_id} · {item.clinical_status}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
