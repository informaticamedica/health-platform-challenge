import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip, chipVariantOptions } from "./chip";

const meta: Meta<typeof Chip> = {
  title: "UI/Chip",
  component: Chip,
  args: {
    children: "Emergencia activa",
    variant: "default",
    showClose: true,
  },
  argTypes: {
    variant: {
      options: chipVariantOptions,
      control: { type: "select" },
    },
    showClose: { control: { type: "boolean" } },
    onClose: { action: "closed" },
  },
};

export default meta;

type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

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
