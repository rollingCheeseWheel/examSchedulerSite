export default {
	baseApiPath: "/api/v1",
	get schoolDropdown() {
		return mergePaths(this.baseApiPath, "signup/schools");
	},
};

function mergePaths(base: string, path: string) {
	return (
		base + (base.endsWith("/") || path.startsWith("/") ? "" : "/") + path
	);
}
