import { useAuth } from "@/context/auth";
import usePatientStore from "@/hooks/useStore";
import { createPatient, updatePatient } from "@/services/backend";
import { PatientPayloadType, PatientTypeDto } from "@/types/dto.type";
import {
  useToast,
  Button,
  Modal,
  Input,
  LoadingSpinner,
  Select,
} from "@ds";
import { PlusIcon } from "lucide-react";
import { ChangeEvent, ReactNode, useState } from "react";

const EMPTY_PATIENT: PatientPayloadType = {
  name: "",
  birth_date: "",
  gender: "other",
  address: "",
};

type Props = {
  mode: "create" | "edit";
  patient?: PatientTypeDto;
  trigger?: ReactNode;
};

export const PatientFormModal = ({ mode, patient, trigger }: Props) => {
  const { patients, setPatients } = usePatientStore();
  const { getSession } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<PatientPayloadType>(
    patient
      ? {
          name: patient.name,
          birth_date: new Date(patient.birth_date).toISOString().split("T")[0],
          gender: patient.gender,
          address: patient.address,
        }
      : EMPTY_PATIENT,
  );

  const isCreate = mode === "create";
  const isFormValid =
    form.name.trim().length > 0 &&
    form.birth_date.trim().length > 0 &&
    form.gender.trim().length > 0 &&
    form.address.trim().length > 0;

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    const session = await getSession();
    if (!session?.accessToken) return;

    setIsSaving(true);
    const payload: PatientPayloadType = {
      ...form,
      birth_date: new Date(form.birth_date).toISOString(),
    };

    const response = isCreate
      ? await createPatient({
          accessToken: session.accessToken,
          patient: payload,
        })
      : await updatePatient({
          accessToken: session.accessToken,
          patientId: patient?.id ?? "",
          patient: payload,
        });

    if (response.error) {
      toast({
        title: "Error",
        description: response.message || "No se pudo guardar el paciente",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    const saved = response.data;
    setPatients(
      isCreate
        ? [...patients, { ...saved, observations: saved.observations ?? "0" }]
        : patients.map((item) =>
            item.id === saved.id
              ? {
                  ...item,
                  ...saved,
                  observations: item.observations ?? saved.observations ?? "0",
                }
              : item,
          ),
    );

    toast({
      description: isCreate
        ? "Paciente creado correctamente"
        : "Paciente actualizado correctamente",
    });
    if (isCreate) setForm(EMPTY_PATIENT);
    setIsOpen(false);
    setIsSaving(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild>
        {trigger ?? (
          <Button className="bg-teal-700 hover:bg-teal-600">
            <PlusIcon /> Nuevo paciente
          </Button>
        )}
      </Modal.Trigger>
      <Modal.Content className="sm:max-w-[560px]">
        <Modal.Header>
          <Modal.Title>
            {isCreate ? "Agregar paciente" : "Editar paciente"}
          </Modal.Title>
          <Modal.Description>
            Completa los datos clinicos basicos del paciente.
          </Modal.Description>
        </Modal.Header>

        <div className="grid gap-4 py-2">
          <Input label="Nombre completo" name="name" value={form.name} onChange={onInput} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Fecha de nacimiento"
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={onInput}
            />
            <Select
              label="Genero"
              value={form.gender}
              onValueChange={(gender: "male" | "female" | "other") =>
                setForm((prev) => ({ ...prev, gender }))
              }
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="male">Masculino</Select.Item>
                <Select.Item value="female">Femenino</Select.Item>
                <Select.Item value="other">Otro</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <Input label="Direccion" name="address" value={form.address} onChange={onInput} />
        </div>

        <Modal.Footer>
          <Button disabled={isSaving || !isFormValid} onClick={onSubmit}>
            {isSaving ? <LoadingSpinner color="text-white w-4 h-4" /> : null}
            Guardar
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
