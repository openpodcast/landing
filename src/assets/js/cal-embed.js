(function () {
    const embed = document.querySelector("[data-cal-inline]");
    if (!embed) return;

    const initializeCal = function () {
        (function (windowObject, scriptUrl, initCommand) {
            const queue = function (api, args) {
                api.q.push(args);
            };
            const documentObject = windowObject.document;

            windowObject.Cal = windowObject.Cal || function () {
                const cal = windowObject.Cal;
                const args = arguments;

                if (!cal.loaded) {
                    cal.ns = {};
                    cal.q = cal.q || [];
                    const script = documentObject.createElement("script");
                    script.src = scriptUrl;
                    script.async = true;
                    documentObject.head.appendChild(script);
                    cal.loaded = true;
                }

                if (args[0] === initCommand) {
                    const namespace = args[1];
                    const namespacedApi = function () {
                        queue(namespacedApi, arguments);
                    };
                    namespacedApi.q = namespacedApi.q || [];
                    cal.ns[namespace] = cal.ns[namespace] || namespacedApi;
                    queue(cal.ns[namespace], args);
                    queue(cal, ["initNamespace", namespace]);
                    return;
                }

                queue(cal, args);
            };
        })(window, "https://app.cal.com/embed/embed.js", "init");

        const namespace = "openpodcastDemo";
        const calLink = embed.dataset.calLink;

        window.Cal("init", namespace, { origin: "https://cal.com" });
        window.Cal.ns[namespace]("inline", {
            elementOrSelector: "[data-cal-inline]",
            calLink: calLink,
            config: {
                layout: "month_view",
                theme: "light",
            },
        });
        window.Cal.ns[namespace]("ui", {
            theme: "light",
            hideEventTypeDetails: false,
            layout: "month_view",
            cssVarsPerTheme: {
                light: {
                    "cal-brand": "#2563EB",
                    "cal-brand-emphasis": "#1D4ED8",
                    "cal-brand-text": "#FFFFFF",
                    "cal-brand-subtle": "#DBEAFE",
                    "cal-brand-accent": "#FFFFFF",
                    "cal-text": "#4B5563",
                    "cal-text-emphasis": "#111827",
                    "cal-text-subtle": "#6B7280",
                    "cal-text-muted": "#9CA3AF",
                    "cal-text-inverted": "#FFFFFF",
                    "cal-bg": "#FFFFFF",
                    "cal-bg-emphasis": "#EFF6FF",
                    "cal-bg-subtle": "#F9FAFB",
                    "cal-bg-muted": "#F3F4F6",
                    "cal-bg-inverted": "#111827",
                    "cal-border": "#E5E7EB",
                    "cal-border-emphasis": "#2563EB",
                    "cal-border-subtle": "#E5E7EB",
                    "cal-border-muted": "#F3F4F6",
                    "cal-border-booker": "#E5E7EB",
                    "cal-border-booker-width": "1px",
                    radius: "0.75rem",
                },
            },
        });
    };

    if (!("IntersectionObserver" in window)) {
        initializeCal();
        return;
    }

    const observer = new IntersectionObserver(
        function (entries) {
            if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
            observer.disconnect();
            initializeCal();
        },
        { rootMargin: "600px 0px" }
    );

    observer.observe(embed);
})();
