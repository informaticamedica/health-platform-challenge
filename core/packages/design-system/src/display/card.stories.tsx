import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui";
import { Card, cardVariantOptions } from "./card";

const meta: Meta<typeof Card> = {
  title: "Display/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    title: "Incidente electrico",
    subtitle: "Subestacion Norte",
    children: "Se registro una variacion de voltaje en el sector norte.",
    meta: <span className="rounded-full bg-warning px-2 py-1 text-xs font-semibold text-warning-foreground">Alta</span>,
    footer: (
      <div className="flex justify-end">
        <Button size="sm">Abrir</Button>
      </div>
    ),
  },
  argTypes: {
    variant: {
      options: cardVariantOptions,
      control: { type: "select" },
    },
    clickable: { control: { type: "boolean" } },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};
