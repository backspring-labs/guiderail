import type { ContextMachineEvent } from "@guiderail/core/context";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSearchShortcut() {
	const [searchOpen, setSearchOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return { searchOpen, setSearchOpen };
}

export function useExpandEvents(send: (event: ContextMachineEvent) => void) {
	useEffect(() => {
		const handleExpand = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			if (detail?.type === "journey") {
				send({ type: "SELECT_JOURNEY", journeyId: detail.id });
			} else if (detail?.type === "sequence") {
				send({ type: "SELECT_SEQUENCE", sequenceId: detail.id });
			} else if (detail?.type === "subprocess") {
				send({ type: "SELECT_PROCESS", processId: detail.id });
			}
		};
		window.addEventListener("guiderail:expand", handleExpand);
		return () => window.removeEventListener("guiderail:expand", handleExpand);
	}, [send]);
}

interface ReactFlowInstance {
	fitView: (options?: { padding?: number; duration?: number }) => void;
	getViewport: () => { x: number; y: number; zoom: number };
	setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
	getNodes: () => Array<{
		position: { x: number; y: number };
		measured?: { width?: number; height?: number };
	}>;
	viewportInitialized: boolean;
}

function fitViewTopLeft(instance: ReactFlowInstance) {
	const nodes = instance.getNodes();
	if (nodes.length === 0) {
		instance.fitView({ padding: 0.15 });
		return;
	}

	// Compute bounds
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	for (const n of nodes) {
		const w = n.measured?.width ?? 150;
		const h = n.measured?.height ?? 50;
		if (n.position.x < minX) minX = n.position.x;
		if (n.position.y < minY) minY = n.position.y;
		if (n.position.x + w > maxX) maxX = n.position.x + w;
		if (n.position.y + h > maxY) maxY = n.position.y + h;
	}

	// Get canvas size from the viewport container
	const container = document.querySelector(".react-flow");
	const canvasW = container?.clientWidth ?? 1200;
	const canvasH = container?.clientHeight ?? 800;

	const contentW = maxX - minX;
	const contentH = maxY - minY;
	const padding = 40;

	// Compute zoom to fit content with padding
	const zoomX = (canvasW - padding * 2) / contentW;
	const zoomY = (canvasH - padding * 2) / contentH;
	const zoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.3), 1);

	instance.setViewport({
		x: -minX * zoom + padding,
		y: -minY * zoom + padding,
		zoom,
	});
}

export function useFitViewOnSwitch(activePerspectiveId: string, activeCanvasMode: string | null) {
	const reactFlowRef = useRef<ReactFlowInstance | null>(null);
	const lastPerspectiveId = useRef(activePerspectiveId);
	const lastCanvasMode = useRef(activeCanvasMode);

	useEffect(() => {
		const perspectiveChanged = activePerspectiveId !== lastPerspectiveId.current;
		const canvasModeChanged = activeCanvasMode !== lastCanvasMode.current;
		lastPerspectiveId.current = activePerspectiveId;
		lastCanvasMode.current = activeCanvasMode;

		if ((perspectiveChanged || canvasModeChanged) && reactFlowRef.current) {
			setTimeout(() => {
				if (reactFlowRef.current) fitViewTopLeft(reactFlowRef.current);
			}, 50);
		}
	}, [activePerspectiveId, activeCanvasMode]);

	const onInit = useCallback((instance: ReactFlowInstance) => {
		reactFlowRef.current = instance;
		fitViewTopLeft(instance);
	}, []);

	return { onInit };
}
