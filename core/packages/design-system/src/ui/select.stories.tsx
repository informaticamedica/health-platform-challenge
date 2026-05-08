import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./select.js";

const options = [
  { label: "Alta", value: "alta" },
  { label: "Media", value: "media" },
  { label: "Baja", value: "baja" },
];

const DemoSelect = ({
  label,
  disabled,
}: {
  label?: string;
  disabled?: boolean;
}) => {
  const [value, setValue] = React.useState(options[0].value);

  return (
    <Select
      label={label}
      value={value}
      onValueChange={setValue}
      disabled={disabled}
    >
      <Select.Trigger className="w-64">
        <span className="sr-only">Selector de prioridad</span>
        <Select.Value placeholder="Selecciona prioridad" />
      </Select.Trigger>
      <Select.Content>
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  );
};

const meta: Meta<typeof DemoSelect> = {
  title: "UI/Select",
  component: DemoSelect,
  args: {
    label: "Prioridad",
    disabled: false,
  },
  argTypes: {
    label: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DemoSelect>;

export const Default: Story = {};

export const SelectInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    await userEvent.click(await body.findByRole("option", { name: "Media" }));
    await expect(trigger).toHaveTextContent("Media");
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
  },
};
