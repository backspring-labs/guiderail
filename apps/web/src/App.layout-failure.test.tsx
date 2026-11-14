import { App } from "@/App.js";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The layout-failure path on the mounted App. ELK is replaced so the test
 * decides when layout fails; everything else is real.
 */
const elk = vi.hoisted(() => ({ compute: vi.fn() }));

vi.mock("@/lib/elk-layout.js", async (original) => ({
	...(await original<typeof import("@/lib/elk-layout.js")>()),
	computeElkLayout: elk.compute,
}));

const tab = (name: string) =>
	within(document.querySelector(".perspective-switcher") as HTMLElement).getByRole("button", {
		name,
	});

describe("automatic layout fails", () => {
	beforeEach(() => elk.compute.mockReset());

	it("shows a notice instead of failing silently, and Retry recovers", async () => {
		elk.compute
			.mockRejectedValueOnce(new Error("elk worker crashed"))
			.mockResolvedValue(new Map([["n-app-shell", { x: 40, y: 40 }]]));
		const user = userEvent.setup();
		render(<App />);

		// Orientation needs no automatic layout, so nothing has been asked of ELK yet.
		expect(elk.compute).not.toHaveBeenCalled();
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();

		await user.click(tab("Architecture"));
		const notice = await screen.findByRole("alert");
		expect(notice).toHaveTextContent("Automatic layout failed");
		// The canvas still shows the nodes, in the grid fallback.
		expect(document.querySelectorAll(".react-flow__node").length).toBeGreaterThan(0);

		await user.click(within(notice).getByRole("button", { name: "Retry layout" }));
		await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
		expect(elk.compute).toHaveBeenCalledTimes(2);
	});

	it("shows no notice when layout succeeds", async () => {
		elk.compute.mockResolvedValue(new Map());
		const user = userEvent.setup();
		render(<App />);
		await user.click(tab("Architecture"));
		await waitFor(() => expect(elk.compute).toHaveBeenCalledTimes(1));
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});
