import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./input.js";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  args: {
    label: "Nombre",
    placeholder: "Escribe aqui",
    disabled: false,
  },
  argTypes: {
    type: {
      options: ["text", "email", "password", "number", "search", "tel", "url"],
      control: { type: "select" },
    },
    disabled: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const TypingInteraction: Story = {
  args: {
    label: "Nombre",
    placeholder: "Escribe aqui",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textbox = canvas.getByRole("textbox", { name: "Nombre" });
    await userEvent.type(textbox, "Carlos");
    await expect(textbox).toHaveValue("Carlos");
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    "aria-label": "Campo de texto sin etiqueta",
    placeholder: "Sin etiqueta",
  },
};
