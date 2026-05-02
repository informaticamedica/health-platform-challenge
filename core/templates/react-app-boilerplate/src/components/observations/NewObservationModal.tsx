import { addObservation } from "@/services/api";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Button, Input } from "../ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { NewObservationType } from "@/types/observation-form.type";
import { FilePlusIcon, PlusIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { v4 } from "uuid";

export const NewObservationModal = () => {
  const { patientObservations, setPatientObservations, observationsCategories } =
    usePatientStore();
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    const session = await getSession();
    if (!session?.accessToken) return;

    try {
      setCargando(true);
      const { data: addedObservation, error, message } = await addObservation(
        session.accessToken,
        {
          ...newObservation,
          components: newObservation.components.map(({ id: _, ...c }) => ({ ...c })),
          patient_id: patientObservations.id,
        }
      );

      if (error) {
        toast({ title: "Error", description: message, variant: "destructive" });
      } else {
        setPatientObservations({
          ...patientObservations,
          observations: [...patientObservations.observations, addedObservation],
        });
        toast({ description: "Observacion creada correctamente" });
        setNewObservation(initObservation);
        setIsOpen(false);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <Button className="bg-slate-900 hover:bg-slate-800" onClick={() => setIsOpen(true)}>
          <FilePlusIcon /> Nueva observacion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[860px]">
        <DialogHeader>
          <DialogTitle>Agregar nueva observacion</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label htmlFor="category" className="mb-1 block text-sm font-medium">
                Categoria
              </label>
              <Select
                onValueChange={(category) =>
                  setNewObservation((prev) => ({ ...prev, category }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoria" />
                </SelectTrigger>
                <SelectContent>
                  {observationsCategories.map((category) => (
                    <SelectItem value={category.code} key={category.code}>
                      {category.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="code" className="mb-1 block text-sm font-medium">
                Codigo
              </label>
              <Input id="code" name="code" value={newObservation.code} onChange={handleInputChange} />
            </div>

            <div>
              <label htmlFor="value" className="mb-1 block text-sm font-medium">
                Valor
              </label>
              <Input id="value" name="value" value={newObservation.value} onChange={handleInputChange} />
            </div>

            <div>
              <label htmlFor="date" className="mb-1 block text-sm font-medium">
                Fecha
              </label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newObservation.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 p-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() =>
                  setNewObservation((prev) => ({
                    ...prev,
                    components: [...prev.components, { code: "", value: 0, unit: "", id: v4() }],
                  }))
                }
              >
                <PlusIcon className="mr-2" />
                Agregar componente
              </Button>
            </div>

            <ScrollArea className="mt-4 h-52" type="always">
              {newObservation.components.map((c, i) => (
                <div
                  key={c.id}
                  className="mb-3 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div>
                    <label className="mb-1 block text-sm font-medium">Codigo</label>
                    <Input
                      value={c.code}
                      onChange={(e) => handleInputComponentChange(i, "code", e.target.value)}
                      className="w-24 bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Valor</label>
                    <Input
                      type="number"
                      value={c.value}
                      onChange={(e) => handleInputComponentChange(i, "value", e.target.value)}
                      className="w-24 bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Unidad</label>
                    <Input
                      value={c.unit}
                      onChange={(e) => handleInputComponentChange(i, "unit", e.target.value)}
                      className="w-24 bg-white"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setNewObservation((prev) => ({
                        ...prev,
                        components: prev.components.filter((_, ii) => ii !== i),
                      }))
                    }
                  >
                    Quitar
                  </Button>
                </div>
              ))}
            </ScrollArea>

            <Button disabled={cargando} onClick={handleSubmit} className="mt-4 self-end bg-teal-700 hover:bg-teal-600">
              {cargando ? <LoadingSpinner color="text-white w-4 h-4" /> : null}
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
