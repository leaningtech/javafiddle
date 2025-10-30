// for adblockers protection
export function tryPlausible(msg: string) {
	if (self.plausible) plausible(msg);
}

export function debounceFunction(fn: () => void, delay: number) {
	let timeoutId: number;
	return () => {
		clearInterval(timeoutId);
		timeoutId = setTimeout(() => fn(), delay);
	};
}
