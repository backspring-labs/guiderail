import { orderedMessagesOf } from "@/lib/ordered-groups.js";
import { seedGraph, seedInterfaces, seedSequences } from "@/store/seed-loader.js";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SequenceDetailPanel } from "./SequenceDetailPanel.js";

const [sequence, otherSequence] = seedSequences;
if (!sequence || !otherSequence) throw new Error("the demo data needs two sequences for this test");
const messages = orderedMessagesOf(sequence.id);

function renderPanel(
	selectedNodeId: string,
	activeSequenceId: string | null = sequence?.id ?? null,
) {
	const onSelectNode = vi.fn();
	const view = render(
		<SequenceDetailPanel
			selectedNodeId={selectedNodeId}
			activeSequenceId={activeSequenceId}
			graph={seedGraph}
			onSelectNode={onSelectNode}
		/>,
	);
	return { ...view, onSelectNode };
}

describe("SequenceDetailPanel — message", () => {
	it.each([0, 1, messages.length - 1])(
		"numbers the message at position %i as position + 1",
		(position) => {
			const message = messages[position];
			if (!message) throw new Error("no message at that position");
			renderPanel(`msg-node-${message.id}`);
			expect(screen.getByText(`message #${position + 1}`)).toBeInTheDocument();
			expect(screen.getByRole("heading", { name: message.label })).toBeInTheDocument();
		},
	);

	it("shows no number for a message outside the active sequence", () => {
		const foreign = orderedMessagesOf(otherSequence.id).find(
			(m) => !sequence.messageIds.includes(m.id),
		);
		if (!foreign) throw new Error("the second sequence has no message of its own");
		renderPanel(`msg-node-${foreign.id}`);
		expect(screen.getByText("message")).toBeInTheDocument();
		expect(screen.queryByText(/message #/)).not.toBeInTheDocument();
	});

	it("renders nothing for an unknown message", () => {
		const { container } = renderPanel("msg-node-does-not-exist");
		expect(container).toBeEmptyDOMElement();
	});
});

describe("SequenceDetailPanel — lifeline", () => {
	const sender = messages[0]?.sourceInterfaceId ?? "";
	const iface = seedInterfaces.find((i) => i.id === sender);
	const sent = messages
		.map((message, position) => ({ message, position }))
		.filter(({ message }) => message.sourceInterfaceId === sender);

	it("lists only the active sequence's messages from that lifeline, numbered by position", () => {
		renderPanel(`lifeline-${sender}`);
		expect(screen.getByRole("heading", { name: iface?.label })).toBeInTheDocument();
		expect(screen.getByText(`Sends (${sent.length})`)).toBeInTheDocument();

		const numbers = screen.getAllByText(/^#\d+$/).map((el) => el.textContent);
		expect(numbers).toEqual(sent.map(({ position }) => `#${position + 1}`));
	});

	it("selects the lifeline's system node when its link is clicked", async () => {
		const { onSelectNode } = renderPanel(`lifeline-${sender}`);
		const system = screen.getByRole("heading", { name: "System" }).parentElement;
		if (!system) throw new Error("no System section");
		await userEvent.click(within(system).getByRole("button"));
		expect(onSelectNode).toHaveBeenCalledWith(iface?.nodeId);
	});

	it("renders nothing for an unknown lifeline", () => {
		const { container } = renderPanel("lifeline-does-not-exist");
		expect(container).toBeEmptyDOMElement();
	});
});

it("renders nothing for a selection that is neither a lifeline nor a message", () => {
	const { container } = renderPanel("n-app-shell");
	expect(container).toBeEmptyDOMElement();
});
