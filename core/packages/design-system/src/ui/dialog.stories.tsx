import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button";
import { Input } from "./input";
import { Modal } from "./dialog";
const meta: Meta<typeof Modal> = {
  title: "UI/Dialog",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger asChild>
        <Button>Abrir modal</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Actualizar incidente</Modal.Title>
          <Modal.Description>
            Edita los datos y guarda los cambios.
          </Modal.Description>
        </Modal.Header>
        <div className="space-y-3 py-2">
          <Input label="Titulo" defaultValue="Corte de energia" />
          <Input label="Ubicacion" defaultValue="Zona norte" />
        </div>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="outline">Cancelar</Button>
          </Modal.Close>
          <Button>Guardar</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  ),
};

export const OpenAndCloseInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const openButton = canvas.getByRole("button", { name: "Abrir modal" });
    await userEvent.click(openButton);
    await expect(await body.findByRole("dialog")).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Cancelar" }));
  },
};
