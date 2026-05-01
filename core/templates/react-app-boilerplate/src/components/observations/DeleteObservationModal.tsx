import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button } from "../ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
        id
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
            (obs) => obs.id !== id
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Trash2Icon className="hover:text-red-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar observación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar esta observación?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={cargando}
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <div className="flex text-center">
              {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
              Eliminar
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
