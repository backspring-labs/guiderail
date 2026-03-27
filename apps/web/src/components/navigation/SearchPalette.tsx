import {
	seedCapabilities,
	seedDomains,
	seedJourneys,
	seedNodes,
	seedProcesses,
	seedProviders,
	seedSequences,
	seedStoryRoutes,
} from "@/store/seed-loader.js";
import { useEffect, useMemo, useRef, useState } from "react";

interface SearchResult {
	id: string;
	label: string;
	type:
		| "domain"
		| "capability"
		| "node"
		| "provider"
		| "journey"
		| "process"
		| "sequence"
		| "route";
	action: () => void;
}

interface SearchPaletteProps {
	open: boolean;
	onClose: () => void;
	onSelectDomain: (id: string) => void;
	onSelectCapability: (id: string) => void;
	onSelectNode: (id: string) => void;
	onSelectProcess: (id: string) => void;
	onSelectJourney: (id: string) => void;
	onSelectSequence: (id: string) => void;
	onStartRoute: (id: string) => void;
}

function fuzzyMatch(text: string, query: string): number {
	const lower = text.toLowerCase();
	const q = query.toLowerCase();
	if (lower === q) return 100;
	if (lower.startsWith(q)) return 80;
	if (lower.includes(q)) return 60;
	return 0;
}

export function SearchPalette({
	open,
	onClose,
	onSelectDomain,
	onSelectCapability,
	onSelectNode,
	onSelectProcess,
	onSelectJourney,
	onSelectSequence,
	onStartRoute,
}: SearchPaletteProps) {
	const [query, setQuery] = useState("");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus input when palette opens
	useEffect(() => {
		if (open) {
			setQuery("");
			setSelectedIndex(0);
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	}, [open]);

	// Build all searchable items
	const allItems = useMemo((): SearchResult[] => {
		const items: SearchResult[] = [];

		for (const d of seedDomains) {
			items.push({ id: d.id, label: d.label, type: "domain", action: () => onSelectDomain(d.id) });
		}
		for (const c of seedCapabilities) {
			items.push({
				id: c.id,
				label: c.label,
				type: "capability",
				action: () => onSelectCapability(c.id),
			});
		}
		for (const n of seedNodes) {
			items.push({ id: n.id, label: n.label, type: "node", action: () => onSelectNode(n.id) });
		}
		for (const p of seedProviders) {
			items.push({ id: p.id, label: p.label, type: "provider", action: () => onSelectNode(p.id) });
		}
		for (const j of seedJourneys) {
			items.push({
				id: j.id,
				label: j.label,
				type: "journey",
				action: () => onSelectJourney(j.id),
			});
		}
		for (const p of seedProcesses) {
			items.push({
				id: p.id,
				label: p.label,
				type: "process",
				action: () => onSelectProcess(p.id),
			});
		}
		for (const s of seedSequences) {
			items.push({
				id: s.id,
				label: s.label,
				type: "sequence",
				action: () => onSelectSequence(s.id),
			});
		}
		for (const r of seedStoryRoutes) {
			items.push({ id: r.id, label: r.title, type: "route", action: () => onStartRoute(r.id) });
		}

		return items;
	}, [
		onSelectDomain,
		onSelectCapability,
		onSelectNode,
		onSelectProcess,
		onSelectJourney,
		onSelectSequence,
		onStartRoute,
	]);

	// Filter and score results
	const results = useMemo(() => {
		if (!query.trim()) return [];
		return allItems
			.map((item) => ({ ...item, score: fuzzyMatch(item.label, query.trim()) }))
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 15);
	}, [query, allItems]);

	// Keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const selected = results[selectedIndex];
			if (selected) {
				selected.action();
				onClose();
			}
		}
	};

	const handleSelect = (result: SearchResult) => {
		result.action();
		onClose();
	};

	if (!open) return null;

	return (
		<div
			className="search-palette__overlay"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div
				className="search-palette"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={handleKeyDown}
			>
				<input
					ref={inputRef}
					type="text"
					className="search-palette__input"
					placeholder="Search domains, capabilities, nodes, providers, routes..."
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setSelectedIndex(0);
					}}
				/>
				{results.length > 0 && (
					<div className="search-palette__results">
						{results.map((result, index) => (
							<button
								key={result.id}
								type="button"
								className={`search-palette__result ${index === selectedIndex ? "search-palette__result--selected" : ""}`}
								onClick={() => handleSelect(result)}
								onMouseEnter={() => setSelectedIndex(index)}
							>
								<span className="search-palette__result-type" data-type={result.type}>
									{result.type}
								</span>
								<span className="search-palette__result-label">{result.label}</span>
							</button>
						))}
					</div>
				)}
				{query.trim() && results.length === 0 && (
					<div className="search-palette__empty">No results found</div>
				)}
			</div>
		</div>
	);
}
