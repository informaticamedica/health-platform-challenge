import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "../ui/index.js";
import { Card, cardVariantOptions } from "./card.js";

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

export const ClickableInteraction: Story = {
  args: {
    clickable: true,
    clickableLabel: "Abrir detalle",
    onClickablePress: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const hitArea = canvas.getByRole("button", { name: "Abrir detalle" });
    await userEvent.click(hitArea);
    await expect(args.onClickablePress).toHaveBeenCalledTimes(1);
  },
};
