import {
  LoadingSpinner,
  useToast,
  Button,
  Modal,
} from "@ds";
import usePatientStore from "@/hooks/useStore";
import { useAuth } from "@/context/auth";
import { removeObservation } from "@/services/api";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";

export const DeleteObservationModal = ({ id }: { id: string }) => {
  const { patientObservations, setPatientObservations } = usePatientStore();
  const { toast } = useToast();
  const { getSession } = useAuth();

  const [cargando, setCargando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    const session = await getSession(); // Obtener la sesión del frontend

    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      setCargando(true);
      const { error, message } = await removeObservation(
        session.accessToken,
        id,
      );

      if (error) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } else {
        setPatientObservations({
          ...patientObservations,
          observations: patientObservations.observations.filter(
            (obs) => obs.id !== id,
          ),
        });
        setIsOpen(false); // Cerrar el modal después de guardar
      }
    } catch (error) {
      console.error("Error delete observation:", error);
    } finally {
      setCargando(false);
    }
  };
  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Trigger asChild className="cursor-pointer">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
        >
          <Trash2Icon className="size-4" />
        </button>
      </Modal.Trigger>
      <Modal.Content className="sm:max-w-[425px]">
        <Modal.Header>
          <Modal.Title>Eliminar observación</Modal.Title>
          <Modal.Description>
            ¿Estás seguro que deseas eliminar esta observación?
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Button
            variant="destructive"
            disabled={cargando}
            onClick={handleSubmit}
          >
            <div className="flex text-center">
              {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
              Eliminar
            </div>
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
