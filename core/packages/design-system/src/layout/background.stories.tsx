import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Background } from "./background.js";

const meta: Meta<typeof Background> = {
  title: "Layout/Background",
  component: Background,
  tags: ["autodocs"],
  args: {
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop",
    children: <div className="rounded-2xl bg-card/90 p-6 text-primary shadow-xl">Contenido sobre el fondo</div>,
  },
};

export default meta;

type Story = StoryObj<typeof Background>;

export const Default: Story = {};

export const BackgroundInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Contenido sobre el fondo")).toBeInTheDocument();
  },
};
