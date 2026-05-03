import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui";
import { SectionBanner, sectionBannerVariantOptions } from "./section-banner";

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

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};
