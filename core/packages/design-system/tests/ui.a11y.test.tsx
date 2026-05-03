import * as React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../src/ui/button";
import { Input } from "../src/ui/input";

describe("UI accessibility", () => {
  it("button has no basic accessibility violations", async () => {
    const { container } = render(<Button>Guardar</Button>);
    const results = await axe(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toHaveLength(0);
  });

  it("input with label has no basic accessibility violations", async () => {
    const { container } = render(<Input label="Nombre" placeholder="Juan" />);
    const results = await axe(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations).toHaveLength(0);
  });
});
