import type { Preview } from "@storybook/react";
import "../src/styles/index.css";

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: "dark",
			values: [
				{ name: "dark", value: "#0f172a" },
				{ name: "panel", value: "#1e293b" },
			],
		},
	},
};

export default preview;
