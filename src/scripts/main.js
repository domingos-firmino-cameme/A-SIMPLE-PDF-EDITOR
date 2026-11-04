const tools = document.querySelectorAll("[data-modal-target]");
const modals = document.querySelectorAll(".tool-modal");
const toolEmptyState = document.querySelector("#toolEmptyState");
const toolEmptyStateClose = document.querySelector("#toolEmptyStateClose");
const welcomeOverlay = document.querySelector("#welcomeOverlay");
const welcomeClose = document.querySelector("#welcomeClose");
const welcomeAction = document.querySelector("#welcomeAction");
const exitButton = document.querySelector("#btnExit");
const exitScreen = document.querySelector("#exitScreen");
const exitLoading = document.querySelector("#exitLoading");
const exitContent = document.querySelector("#exitContent");
const exitReturn = document.querySelector("#exitReturn");
const toolRoutePrefix = "tool/";
let applyingToolRoute = false;
let toolEmptyStateDismissed = false;
let returningToEditor = false;

function getToolSlug(modal) {
	return modal.id
		.replace(/^modal/, "")
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.toLowerCase();
}

function getToolRoute() {
	const match = window.location.hash.match(/^#tool\/([a-z0-9-]+)$/i);
	return match ? match[1].toLowerCase() : null;
}

function updateToolRoute(slug, replace = false) {
	const url = new URL(window.location.href);
	url.hash = slug ? `${toolRoutePrefix}${slug}` : "";
	const method = replace ? "replaceState" : "pushState";
	window.history[method]({ toolRoute: slug }, "", url);
	window.dispatchEvent(new CustomEvent("toolroutechange", { detail: { slug } }));
}

window.updateToolRoute = updateToolRoute;

function closeModals(updateRoute = true) {
	modals.forEach((modal) => {
		modal.hidden = true;
	});
	if (toolEmptyState) toolEmptyState.hidden = toolEmptyStateDismissed;
	if (updateRoute && !applyingToolRoute && getToolRoute()) updateToolRoute(null);
}

function applyToolRoute() {
	const slug = getToolRoute();
	if (!slug) {
		if (window.location.hash.toLowerCase().startsWith(`#${toolRoutePrefix}`)) {
			applyingToolRoute = true;
			closeModals(false);
			window.dispatchEvent(new CustomEvent("toolroutechange", { detail: { slug: null } }));
			applyingToolRoute = false;
		}
		return;
	}

	applyingToolRoute = true;
	const routeModal = [...modals].find((modal) => getToolSlug(modal) === slug);
	closeModals(false);

	if (routeModal) {
		routeModal.hidden = false;
		if (toolEmptyState) toolEmptyState.hidden = true;
	} else if (slug === "select-to-edit") {
		if (toolEmptyState) toolEmptyState.hidden = true;
	}

	window.dispatchEvent(new CustomEvent("toolroutechange", { detail: { slug } }));
	applyingToolRoute = false;
}

tools.forEach((tool) => {
	tool.addEventListener("click", () => {
		const target = document.getElementById(tool.dataset.modalTarget);
		const wasOpen = target && !target.hidden;

		closeModals(false);

		if (target && !wasOpen) {
			if (toolEmptyState) toolEmptyState.hidden = true;
			target.hidden = false;
			target.querySelector("input, textarea")?.focus();
			updateToolRoute(getToolSlug(target));
		} else {
			updateToolRoute(null);
		}
	});
});

function closeWelcome() {
	welcomeOverlay.classList.add("is-closed");
}

function leaveEditor() {
	document.body.classList.add("app-exited");
	exitScreen.hidden = false;
	exitLoading.hidden = true;
	exitContent.hidden = false;
	exitReturn.focus();
}

async function returnToEditor() {
	if (returningToEditor) return;
	returningToEditor = true;
	exitContent.hidden = true;
	exitLoading.hidden = false;

	await new Promise((resolve) => window.setTimeout(resolve, 900));

	document.body.classList.remove("app-exited");
	exitScreen.hidden = true;
	exitLoading.hidden = true;
	exitContent.hidden = false;
	exitButton.focus();
	returningToEditor = false;
}

toolEmptyStateClose.addEventListener("click", () => {
	toolEmptyStateDismissed = true;
	toolEmptyState.hidden = true;
});

exitButton.addEventListener("click", leaveEditor);
exitReturn.addEventListener("click", returnToEditor);
welcomeClose.addEventListener("click", closeWelcome);
welcomeAction.addEventListener("click", closeWelcome);

modals.forEach((modal) => {
	modal.addEventListener("submit", (event) => {
		event.preventDefault();
		if (modal.id !== "modalQuickActions") closeModals();
	});
});

document.addEventListener("click", (event) => {
	if (!(event.target instanceof Element)) return;

	const routedButton = event.target.closest("[data-tool-route]");
	if (routedButton) {
		const slug = routedButton.dataset.toolRoute;
		const isToggle = slug === "select-to-edit";
		const isActive = isToggle && routedButton.getAttribute("aria-pressed") === "true";
		updateToolRoute(isActive ? slug : isToggle ? null : slug);
		return;
	}

	if (event.target === welcomeOverlay) {
		closeWelcome();
		return;
	}

	if (event.target.closest('[data-action="cancel"]')) {
		closeModals();
		return;
	}

	if (event.target.closest("[data-header-action]")) {
		const activeModal = [...modals].find((modal) => !modal.hidden);
		if (activeModal) updateToolRoute(getToolSlug(activeModal));
		return;
	}

	const selectionMode = document.getElementById("btnSelectToEdit")?.getAttribute("aria-pressed") === "true";
	const selectingPreview = selectionMode
		&& event.target.closest(".document-preview")
		&& !event.target.closest("#exitSelectionEditMode");

	if (!selectingPreview && !event.target.closest(".tools-bar, .tool-modals, .header-top-bar, .header-menu, .header-menu-item")) {
		closeModals();
	}
});

document.addEventListener("submit", (event) => {
	if (!(event.target instanceof HTMLFormElement) || event.target.id !== "modalQuickActions") return;

	const activeModal = [...modals].find((modal) => !modal.hidden);
	const selectionMode = document.getElementById("btnSelectToEdit")?.getAttribute("aria-pressed") === "true";
	const selectionAction = document.getElementById("quickActionSelect")?.value;
	if (activeModal && activeModal.id !== "modalQuickActions") {
		updateToolRoute(getToolSlug(activeModal));
	} else if (selectionMode && selectionAction === "select") {
		updateToolRoute("select-to-edit");
	}
});

window.addEventListener("popstate", applyToolRoute);
window.addEventListener("hashchange", applyToolRoute);
applyToolRoute();

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		if (document.body.classList.contains("app-exited")) {
			returnToEditor();
		} else if (!welcomeOverlay.classList.contains("is-closed")) {
			closeWelcome();
		} else {
			closeModals();
			if (!modals.length) updateToolRoute(null);
		}
	}
});
