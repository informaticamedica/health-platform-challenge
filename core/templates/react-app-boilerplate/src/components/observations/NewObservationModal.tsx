import { addObservation } from "@/services/api";
import "@radix-ui/react-dialog";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button, Input } from "../ui";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import usePatientStore from "@/hooks/useStore";
import { useAuth } from "@/context/auth";
import { ComponentObservationTypeDto } from "@/types/dto.type";
import { FilePlusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";

export interface NewObservationType {
  category: string;
  code: string;
  value: string;
  date: string;
  components: ComponentObservationTypeDto[];
}

export const NewObservationModal = () => {
  const {
    patientObservations,
    setPatientObservations,
    observationsCategories,
  } = usePatientStore();
  const { toast } = useToast();
  const { getSession } = useAuth();

  const initObservation: NewObservationType = {
    category: "",
    code: "",
    value: "",
    date: "",
    components: [],
  };
  const [newObservation, setNewObservation] = useState(initObservation);
  const [cargando, setCargando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewObservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputComponentChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setNewObservation((prev) => {
      const newComponents = [...prev.components];
      newComponents[index] = { ...newComponents[index], [field]: value };
      return { ...prev, components: newComponents };
    });
  };

  const handleSubmit = async () => {
    const session = await getSession(); // Obtener la sesión del frontend

    if (!session?.accessToken) {
      console.error("No access token available");
      return;
    }

    try {
      setCargando(true);
      const {
        data: addedObservation,
        error,
        message,
      } = await addObservation(session.accessToken, {
        ...newObservation,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        components: newObservation.components.map(({ id: _, ...c }) => ({
          ...c,
        })),
        patient_id: patientObservations.id,
      });

      if (error) {
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      } else {
        setPatientObservations({
          ...patientObservations,
          observations: [...patientObservations.observations, addedObservation],
        });
        toast({
          description: "Observación creada correctamente",
        });
        setNewObservation(initObservation);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error adding observation:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button className="flex" onClick={() => setIsOpen(true)}>
          <FilePlusIcon className="hover:text-blue-500" /> Nueva observación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] sm:max-h-[380px]">
        <DialogHeader>
          <DialogTitle>Agregar nueva observación</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div className="flex">
            <div className="w-1/3 p-2 ">
              <div>
                <label htmlFor="category" className="block font-semibold">
                  Categoría
                </label>
                <Select
                  onValueChange={(category) =>
                    setNewObservation((prev) => ({ ...prev, category }))
                  }
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Seleccioná una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {observationsCategories.map((category) => (
                      <SelectItem value={category.code} key={v4()}>
                        {category.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="code" className="block font-semibold">
                  Código
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  value={newObservation.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="value" className="block font-semibold">
                  Valor
                </label>
                <input
                  id="value"
                  name="value"
                  type="text"
                  value={newObservation.value}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block font-semibold">
                  Fecha
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={
                    newObservation.date &&
                    new Date(newObservation.date).toISOString().split("T")[0]
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className=" w-2/3 p-2 flex flex-col pt-8">
              <div className="flex justify-end">
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setNewObservation((prev) => ({
                      ...prev,
                      components: [
                        ...prev.components,
                        { code: "", value: 0, unit: "", id: v4() },
                      ],
                    }))
                  }
                >
                  <PlusIcon className="mr-2" />
                  Agregar componente
                </Button>
              </div>
              <ScrollArea className="h-32 m-4 " type="always">
                {newObservation.components.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex justify-between  w-full p-1 border-2 rounded mt-2 px-4"
                  >
                    <div className="flex flex-col ">
                      <label
                        htmlFor={"code" + c.id}
                        className="block font-semibold"
                      >
                        Código
                      </label>
                      <Input
                        id={"code" + c.id}
                        aria-label="Código"
                        type="text"
                        value={c.code}
                        onChange={(e) =>
                          handleInputComponentChange(i, "code", e.target.value)
                        }
                        className="font-semibold w-16 p-1 border rounded"
                      />
                    </div>

                    <div className="flex w-full justify-end">
                      <div className="flex flex-col px-2">
                        <label
                          htmlFor={"value" + c.id}
                          className="block font-semibold"
                        >
                          Valor
                        </label>
                        <Input
                          id={"value" + c.id}
                          type="number"
                          value={c.value}
                          onChange={(e) =>
                            handleInputComponentChange(
                              i,
                              "value",
                              e.target.value
                            )
                          }
                          className="font-semibold w-16 p-1 border rounded"
                        />
                      </div>
                      <div className="flex flex-col px-2">
                        <label
                          htmlFor={"unit" + c.id}
                          className="block font-semibold"
                        >
                          Unidad
                        </label>
                        <Input
                          id={"unit" + c.id}
                          type="text"
                          value={c.unit}
                          onChange={(e) =>
                            handleInputComponentChange(
                              i,
                              "unit",
                              e.target.value
                            )
                          }
                          className="font-semibold w-16 p-1 border rounded"
                        />
                      </div>
                    </div>

                    <div className="pl-4">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="p-0 size-1"
                        onClick={() => {
                          setNewObservation((prev) => ({
                            ...prev,
                            components: prev.components.filter(
                              (_, ii) => i !== ii
                            ),
                          }));
                        }}
                      >
                        X
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <Button
                disabled={cargando}
                onClick={() => handleSubmit()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <div className="flex text-center">
                  {cargando && <LoadingSpinner color="text-white w-4 h-4" />}{" "}
                  Guardar
                </div>
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
