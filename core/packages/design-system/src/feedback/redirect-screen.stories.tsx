import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RedirectScreen } from "./redirect-screen.js";

const meta: Meta<typeof RedirectScreen> = {
  title: "Feedback/RedirectScreen",
  component: RedirectScreen,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RedirectScreen>;

export const Default: Story = {};

export const RedirectInteraction: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("svg")).not.toBeNull();
  },
};
