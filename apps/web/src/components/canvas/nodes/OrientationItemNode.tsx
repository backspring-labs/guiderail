interface OrientationItemNodeData {
	title: string;
	/** Position in navigation order, starting at 0. */
	position: number;
	itemId: string;
	isActive?: boolean;
	[key: string]: unknown;
}

interface OrientationItemNodeProps {
	data: OrientationItemNodeData;
}

export function OrientationItemNode({ data }: OrientationItemNodeProps) {
	const isActive = data.isActive === true;
	const activeClass = isActive ? "orientation-item--active" : "";

	const handleClick = () => {
		window.dispatchEvent(
			new CustomEvent("guiderail:orientation-select", {
				detail: { itemId: data.itemId, position: data.position },
			}),
		);
	};

	return (
		<button type="button" className={`orientation-item ${activeClass}`} onClick={handleClick}>
			<div className="orientation-item__seq">{data.position + 1}</div>
			<div className="orientation-item__title">{data.title}</div>
		</button>
	);
}
