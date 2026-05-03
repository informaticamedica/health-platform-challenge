import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button, buttonSizeOptions, buttonVariantOptions } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    controls: {
      expanded: true,
    },
  },
  args: {
    children: "Boton",
    variant: "default",
    size: "default",
    asChild: false,
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      options: buttonVariantOptions,
      control: { type: "select" },
    },
    size: {
      options: buttonSizeOptions,
      control: { type: "select" },
    },
    asChild: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    className: {
      control: { type: "text" },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const ClickInteraction: Story = {
  args: {
    children: "Ejecutar",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Ejecutar" });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Accion",
  },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {buttonVariantOptions.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
  args: {
    size: "default",
    disabled: false,
  },
};

export const AllSizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {buttonSizeOptions.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
  args: {
    variant: "default",
    disabled: false,
  },
};
