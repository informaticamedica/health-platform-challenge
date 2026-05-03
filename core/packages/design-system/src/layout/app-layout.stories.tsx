import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppHeader } from "./app-header";
import { AppLayout } from "./app-layout";

const meta: Meta<typeof AppLayout> = {
  title: "Layout/AppLayout",
  component: AppLayout,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  render: () => (
    <AppLayout
      header={
        <AppHeader
          brand={<span className="text-lg font-black">Design System</span>}
          actions={<span className="text-sm">v1.0</span>}
        />
      }
    >
      <div className="mx-auto mt-24 max-w-4xl rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold text-primary">Contenido principal</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ejemplo de layout con header fijo y contenido.
        </p>
      </div>
    </AppLayout>
  ),
};
