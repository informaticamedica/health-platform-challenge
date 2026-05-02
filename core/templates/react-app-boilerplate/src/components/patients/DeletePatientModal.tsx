import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/auth";
import { useToast } from "@/hooks/use-toast";
import usePatientStore from "@/hooks/useStore";
import { deletePatient } from "@/services/backend";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const DeletePatientModal = ({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName: string;
}) => {
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
        >
          <Trash2Icon className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Eliminar paciente</DialogTitle>
          <DialogDescription>
            Esta accion eliminara a {patientName}. No se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" disabled={isDeleting} onClick={onDelete}>
            {isDeleting ? <LoadingSpinner color="text-white w-4 h-4" /> : null}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
