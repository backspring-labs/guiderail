import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StoryRouteBar } from "./StoryRouteBar.js";

const mockRoute = {
	id: "sr-1",
	title: "Test Route",
	destinationObjective: "Understand the flow",
	overview: "A test route",
	waypointIds: ["sw-1", "sw-2", "sw-3"],
	tags: [],
	metadata: {},
};

const mockWaypoint = {
	id: "sw-2",
	storyRouteId: "sr-1",
	sequenceNumber: 1,
	title: "Waypoint 2",
	keyMessage: "This is the key message",
	whyItMatters: "Because it matters",
	focusTargets: [],
	evidenceRefIds: [],
	metadata: {},
};

const baseProps = {
	route: mockRoute,
	currentWaypoint: mockWaypoint,
	waypointIndex: 1,
	totalWaypoints: 3,
	onNext: vi.fn(),
	onPrevious: vi.fn(),
	onPause: vi.fn(),
	onResume: vi.fn(),
	onEnd: vi.fn(),
};

describe("StoryRouteBar", () => {
	it("renders nothing when inactive", () => {
		const { container } = render(<StoryRouteBar routeState="inactive" {...baseProps} />);
		expect(container.innerHTML).toBe("");
	});

	it("renders active state with title, progress, and message", () => {
		render(<StoryRouteBar routeState="active" {...baseProps} />);
		expect(screen.getByText("Test Route")).toBeDefined();
		expect(screen.getByText("2 / 3")).toBeDefined();
		expect(screen.getByText("This is the key message")).toBeDefined();
		expect(screen.getByText("Because it matters")).toBeDefined();
	});

	it("renders paused state with badge and resume button", () => {
		render(<StoryRouteBar routeState="paused" {...baseProps} />);
		expect(screen.getByText("Paused")).toBeDefined();
		expect(screen.getByText("Return to Route")).toBeDefined();
		expect(screen.getByText("End Route")).toBeDefined();
	});

	it("shows destination objective at waypoint 0", () => {
		render(<StoryRouteBar routeState="active" {...baseProps} waypointIndex={0} />);
		expect(screen.getByText("Understand the flow")).toBeDefined();
	});

	it("does not show destination objective at waypoint > 0", () => {
		render(<StoryRouteBar routeState="active" {...baseProps} waypointIndex={1} />);
		expect(screen.queryByText("Understand the flow")).toBeNull();
	});

	it("disables Previous at first waypoint", () => {
		render(<StoryRouteBar routeState="active" {...baseProps} waypointIndex={0} />);
		const prevBtn = screen.getByText("Previous");
		expect(prevBtn.closest("button")?.disabled).toBe(true);
	});

	it("disables Next at last waypoint", () => {
		render(<StoryRouteBar routeState="active" {...baseProps} waypointIndex={2} />);
		const nextBtn = screen.getByText("Next");
		expect(nextBtn.closest("button")?.disabled).toBe(true);
	});
});
