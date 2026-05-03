import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastVariantOptions,
} from "./toast";

const ToastDemo = ({
  variant,
}: {
  variant: (typeof toastVariantOptions)[number];
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <ToastProvider>
      <Button onClick={() => setOpen(true)}>Mostrar toast</Button>
      <Toast open={open} onOpenChange={setOpen} variant={variant}>
        <div className="grid gap-1">
          <ToastTitle>Actualizacion completada</ToastTitle>
          <ToastDescription>
            El incidente fue sincronizado correctamente.
          </ToastDescription>
        </div>
        <ToastAction altText="Reintentar">Deshacer</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

const meta: Meta<typeof ToastDemo> = {
  title: "UI/Toast",
  component: ToastDemo,
  args: {
    variant: "default",
  },
  argTypes: {
    variant: {
      options: toastVariantOptions,
      control: { type: "select" },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ToastDemo>;

export const Default: Story = {};

export const ToastInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Mostrar toast" }));
    await expect(await body.findByText("Actualizacion completada")).toBeInTheDocument();
  },
};
