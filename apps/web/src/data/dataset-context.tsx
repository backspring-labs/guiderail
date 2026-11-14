import { type ReactNode, createContext, useContext } from "react";
import type { Dataset } from "./dataset.js";

const DatasetContext = createContext<Dataset | null>(null);

interface DatasetProviderProps {
	dataset: Dataset;
	children: ReactNode;
}

/** Makes one Dataset available to the kernel initialiser and every view below it. */
export function DatasetProvider({ dataset, children }: DatasetProviderProps) {
	return <DatasetContext.Provider value={dataset}>{children}</DatasetContext.Provider>;
}

/** The dataset the app is showing. Must be called under a DatasetProvider. */
export function useDataset(): Dataset {
	const dataset = useContext(DatasetContext);
	if (!dataset) {
		throw new Error("useDataset must be used inside a DatasetProvider");
	}
	return dataset;
}
