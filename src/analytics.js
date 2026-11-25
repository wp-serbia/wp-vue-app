export function setupAnalytics(router) {
  if (!GA_TRACKING_ID.startsWith("G-")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_TRACKING_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_TRACKING_ID);
  document.head.appendChild(script);

  router.afterEach((to, from, failure) => {
    if (!failure) window.gtag("event", "page_view", { page_path: to.fullPath });
  });
}
