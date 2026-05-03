import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

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
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    placeholder: "Sin etiqueta",
  },
};
