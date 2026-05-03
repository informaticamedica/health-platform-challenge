import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon } from "lucide-react";
import { Button } from "../ui";
import { AppHeader } from "./app-header";

const meta: Meta<typeof AppHeader> = {
  title: "Layout/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  args: {
    brand: <span className="text-lg font-black">Design System</span>,
    actions: (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost">
          <BellIcon className="size-4" />
        </Button>
        <Button size="sm" variant="secondary">
          Nuevo incidente
        </Button>
      </div>
    ),
  },
};

export default meta;

type Story = StoryObj<typeof AppHeader>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-48">
      <AppHeader {...args} />
    </div>
  ),
};
