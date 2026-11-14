import { AppShell } from "@/components/layout/AppShell.js";
import { DatasetProvider } from "@/data/dataset-context.js";
import type { Dataset } from "@/data/dataset.js";
import { demoDataset } from "@/data/demo-dataset.js";
import { KernelContext } from "@/hooks/use-context-machine.js";

interface AppProps {
	/** The content to show. Defaults to the demo corpus. */
	dataset?: Dataset;
}

/**
 * The kernel is initialised from `dataset` and every view reads the same
 * `dataset`, so supplying different content needs no change to any component.
 */
export function App({ dataset = demoDataset }: AppProps) {
	return (
		<DatasetProvider dataset={dataset}>
			<KernelContext.Provider>
				<AppShell />
			</KernelContext.Provider>
		</DatasetProvider>
	);
}
