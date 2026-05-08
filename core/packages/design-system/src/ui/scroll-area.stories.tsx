import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ScrollArea } from "./scroll-area.js";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  args: {
    className: "h-56 w-80 rounded-md border border-border bg-card p-3",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args}>
      <div className="space-y-2">
        {Array.from({ length: 20 }, (_, index) => (
          <div
            key={index}
            className="rounded-md bg-tertiary p-2 text-sm text-tertiary-foreground"
          >
            Registro {index + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const ContentInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Registro 20")).toBeInTheDocument();
  },
};
