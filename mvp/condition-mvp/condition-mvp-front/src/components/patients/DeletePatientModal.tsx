import {
  Button,
  Modal,
  LoadingSpinner,
  useToast,
} from "@platform/design-system";
import { useAuth } from "@/context/auth";
import usePatientStore from "@/hooks/useStore";
import { deletePatient } from "@/services/backend";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const DeletePatientModal = ({
  patientId,
  patientName,
}: Readonly<{
  patientId: string;
  patientName: string;
}>) => {
  const { getSession } = useAuth();
  const { patients, setPatients } = usePatientStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    const session = await getSession();
    if (!session?.accessToken) return;

    setIsDeleting(true);
    const response = await deletePatient({
      accessToken: session.accessToken,
      patientId,
    });

    if (response.error) {
      toast({
        title: "Error",
        description: response.message || "No se pudo eliminar el paciente",
        variant: "destructive",
      });
      setIsDeleting(false);
      return;
    }

    setPatients(patients.filter((patient) => patient.id !== patientId));
    toast({ description: "Paciente eliminado correctamente" });
    setIsDeleting(false);
    setIsOpen(false);
  };

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center justify-center rounded-lg border border-error bg-error/10 p-2 text-error transition hover:bg-error/20"
        >
          <Trash2Icon className="size-4" />
        </button>
      </Modal.Trigger>
      <Modal.Content className="sm:max-w-[420px]">
        <Modal.Header>
          <Modal.Title>Eliminar paciente</Modal.Title>
          <Modal.Description>
            Esta accion eliminara a {patientName}. No se puede deshacer.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? <LoadingSpinner color="text-white w-4 h-4" /> : null}
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
