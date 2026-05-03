import { useAuth } from "@/context/auth";
import { createCondition } from "@/services/backend";
import { ConditionPayloadType, ConditionType } from "@/types/dto.type";
import { Button, Input, Modal, Select, useToast } from "@platform/design-system";
import { FormEvent, useState } from "react";

const initialForm = (patientId: string): ConditionPayloadType => ({
  patient_id: patientId,
  clinical_status: "active",
  verification_status: "confirmed",
  code: "",
  recorded_date: new Date().toISOString().slice(0, 10),
  notes: "",
});

export function NewConditionModal({
  patientId,
  onCreated,
}: {
  patientId: string;
  onCreated: (condition: ConditionType) => void;
}) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ConditionPayloadType>(initialForm(patientId));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    const response = await createCondition({
      accessToken: session.accessToken,
      condition: { ...form, patient_id: patientId },
    });

    if (response.error) {
      toast({
        title: "Error",
        description: response.message || "No se pudo crear la condition",
        variant: "destructive",
      });
      return;
    }

    onCreated(response.data);
    setForm(initialForm(patientId));
    setOpen(false);
    toast({ description: "Condition creada" });
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button variant="secondary">Nueva condition</Button>
      </Modal.Trigger>
      <Modal.Content className="sm:max-w-[560px]">
        <Modal.Header>
          <Modal.Title>Nueva Condition</Modal.Title>
          <Modal.Description />
        </Modal.Header>
        <form className="space-y-3" onSubmit={submit}>
          <Input
            label="Codigo"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <Input
            type="date"
            label="Fecha"
            value={form.recorded_date}
            onChange={(e) => setForm({ ...form, recorded_date: e.target.value })}
            required
          />
          <Select
            label="Clinical status"
            onValueChange={(v) =>
              setForm({
                ...form,
                clinical_status: v as ConditionPayloadType["clinical_status"],
              })
            }
            value={form.clinical_status}
          >
            <Select.Trigger>
              <Select.Value placeholder="Selecciona estado" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="active">active</Select.Item>
              <Select.Item value="inactive">inactive</Select.Item>
              <Select.Item value="resolved">resolved</Select.Item>
            </Select.Content>
          </Select>
          <Select
            label="Verification status"
            onValueChange={(v) =>
              setForm({
                ...form,
                verification_status: v as ConditionPayloadType["verification_status"],
              })
            }
            value={form.verification_status}
          >
            <Select.Trigger>
              <Select.Value placeholder="Selecciona verificacion" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="confirmed">confirmed</Select.Item>
              <Select.Item value="provisional">provisional</Select.Item>
              <Select.Item value="refuted">refuted</Select.Item>
            </Select.Content>
          </Select>
          <Input
            label="Notas"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <div className="flex justify-end">
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
