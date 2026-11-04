const installButton = document.getElementById("btnInstallApp");
let installPromptEvent = null;

const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    || (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

if ("serviceWorker" in navigator) {
    const hadController = Boolean(navigator.serviceWorker.controller);
    let isReloadingForUpdate = false;

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hadController || isReloadingForUpdate) return;
        isReloadingForUpdate = true;
        window.location.reload();
    });

    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js", {
            scope: "./",
            updateViaCache: "none"
        })
            .then((registration) => registration.update())
            .catch((error) => {
                console.error("Service worker registration or update failed:", error);
            });
    });
}

if (installButton && !isStandalone()) {
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        installPromptEvent = event;
        installButton.hidden = false;
    });

    if (isIos()) {
        installButton.hidden = false;
    }

    installButton.addEventListener("click", async () => {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            await installPromptEvent.userChoice;
            installPromptEvent = null;
            installButton.hidden = true;
            return;
        }

        if (isIos()) {
            window.alert("To install this app, tap Share and choose 'Add to Home Screen'.");
        }
    });

    window.addEventListener("appinstalled", () => {
        installPromptEvent = null;
        installButton.hidden = true;
    });
}
