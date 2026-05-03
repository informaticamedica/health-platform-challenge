import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingSpinner } from "./loading-spinner";

const meta: Meta<typeof LoadingSpinner> = {
  title: "Feedback/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
  args: {
    color: "text-primary",
  },
};

export default meta;

type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};
