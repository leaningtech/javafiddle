// for adblockers protection
export function tryPlausible(msg: string) {
	if (self.plausible)
		plausible(msg)
}