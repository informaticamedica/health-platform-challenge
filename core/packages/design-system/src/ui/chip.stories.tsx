import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Chip, chipVariantOptions } from "./chip.js";

const meta: Meta<typeof Chip> = {
  title: "UI/Chip",
  component: Chip,
  args: {
    children: "Emergencia activa",
    variant: "default",
    showClose: true,
    onClose: fn(),
  },
  argTypes: {
    variant: {
      options: chipVariantOptions,
      control: { type: "select" },
    },
    showClose: { control: { type: "boolean" } },
    onClose: { action: "closed" },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const CloseInteraction: Story = {
  args: {
    children: "Cerrar chip",
    showClose: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const closeButton = canvas.getByRole("button", { name: "Quitar" });
    await userEvent.click(closeButton);
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {chipVariantOptions.map((variant) => (
        <Chip key={variant} {...args} variant={variant}>
          {variant}
        </Chip>
      ))}
    </div>
  ),
};
