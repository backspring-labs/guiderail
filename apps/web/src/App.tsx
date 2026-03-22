import { AppShell } from "@/components/layout/AppShell.js";
import { KernelContext } from "@/hooks/use-context-machine.js";

export function App() {
	return (
		<KernelContext.Provider>
			<AppShell />
		</KernelContext.Provider>
	);
}
