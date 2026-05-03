import type { Meta, StoryObj } from "@storybook/react-vite";
import { RedirectScreen } from "./redirect-screen";

const meta: Meta<typeof RedirectScreen> = {
  title: "Feedback/RedirectScreen",
  component: RedirectScreen,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RedirectScreen>;

export const Default: Story = {};
