import { renderMarkdown } from "@/lib/simple-markdown.js";
import type { OrientationItem } from "@guiderail/core/entities";

interface OrientationDeckProps {
	items: OrientationItem[];
	activeIndex: number;
	onSelect: (index: number) => void;
}

export function OrientationDeck({ items, activeIndex, onSelect }: OrientationDeckProps) {
	const activeItem = items[activeIndex] ?? items[0];
	if (!activeItem) return null;

	return (
		<div className="orientation-deck">
			<div className="orientation-deck__card">
				<div className="orientation-deck__tabs">
					{items.map((item, i) => (
						<button
							key={item.id}
							type="button"
							className={`orientation-deck__tab ${i === activeIndex ? "orientation-deck__tab--active" : ""}`}
							onClick={() => onSelect(i)}
						>
							<span className="orientation-deck__tab-num">{i + 1}</span>
							<span className="orientation-deck__tab-label">{item.title}</span>
						</button>
					))}
				</div>
				<div className="orientation-deck__content">
					<div className="orientation-deck__body">{renderMarkdown(activeItem.body)}</div>

					{activeItem.terms.length > 0 && (
						<div className="orientation-deck__terms">
							<h2 className="orientation-deck__section-heading">Key Terms</h2>
							<dl className="orientation-deck__term-list">
								{activeItem.terms.map((t) => (
									<div key={t.term} className="orientation-deck__term-entry">
										<dt className="orientation-deck__term">{t.term}</dt>
										<dd className="orientation-deck__definition">{t.definition}</dd>
									</div>
								))}
							</dl>
						</div>
					)}

					{activeItem.links.length > 0 && (
						<div className="orientation-deck__links">
							{activeItem.links.map((link) => (
								<button
									key={`${link.perspectiveId}-${link.entityId ?? ""}`}
									type="button"
									className="orientation-deck__link"
									onClick={() => {
										window.dispatchEvent(
											new CustomEvent("guiderail:orientation-link", {
												detail: { perspectiveId: link.perspectiveId, entityId: link.entityId },
											}),
										);
									}}
								>
									{link.label} →
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
