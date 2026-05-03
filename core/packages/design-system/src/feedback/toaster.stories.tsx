import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button, ToastAction } from "../ui";
import { toast } from "../hooks";
import { Toaster } from "./toaster";

const ToasterDemo = () => {
  const showToast = () => {
    toast({
      title: "Incidente actualizado",
      description: "Los datos se guardaron correctamente.",
      action: <ToastAction altText="Deshacer">Deshacer</ToastAction>,
    });
  };

  return (
    <div>
      <Button onClick={showToast}>Mostrar toast</Button>
      <Toaster />
    </div>
  );
};

const meta: Meta<typeof ToasterDemo> = {
  title: "Feedback/Toaster",
  component: ToasterDemo,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ToasterDemo>;

export const Default: Story = {};

export const ToasterInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Mostrar toast" }));
    await expect(await body.findByText("Incidente actualizado")).toBeInTheDocument();
  },
};
