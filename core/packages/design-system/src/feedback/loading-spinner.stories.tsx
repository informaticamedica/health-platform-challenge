import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
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

export const SpinnerInteraction: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg.animate-spin")).not.toBeNull();
  },
};
