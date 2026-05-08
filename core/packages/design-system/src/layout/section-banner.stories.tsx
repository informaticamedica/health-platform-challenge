import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../ui/index.js";
import { SectionBanner, sectionBannerVariantOptions } from "./section-banner.js";

const meta: Meta<typeof SectionBanner> = {
  title: "Layout/SectionBanner",
  component: SectionBanner,
  tags: ["autodocs"],
  args: {
    variant: "primary",
    title: "Estado de emergencias",
    description: "Monitoreo en tiempo real de eventos activos y su prioridad.",
    action: <Button variant="secondary">Ver detalle</Button>,
  },
  argTypes: {
    variant: {
      options: sectionBannerVariantOptions,
      control: { type: "select" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof SectionBanner>;

export const Default: Story = {};

export const BannerInteraction: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Estado de emergencias" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Ver detalle" })).toBeInTheDocument();
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};
