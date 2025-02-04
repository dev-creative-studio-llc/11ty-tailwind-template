document.addEventListener("DOMContentLoaded", function () {
    const consentBanner = document.getElementById("cookie-consent-banner")
    const acceptBtn = document.getElementById("accept-cookies")
    const rejectBtn = document.getElementById("reject-cookies")

    // Check if consent was previously given or rejected
    const consentStatus = localStorage.getItem("analytics_consent")
    if (consentStatus === "granted") {
        loadAnalytics()
        consentBanner.style.display = "none"
    } else if (consentStatus === "denied") {
        consentBanner.style.display = "none"
    } else {
        consentBanner.style.display = "block"; // Show banner if no consent state
    }

    // Handle Accept Button Click
    acceptBtn.addEventListener("click", function () {
        localStorage.setItem("analytics_consent", "granted")
        consentBanner.style.display = "none"
        loadAnalytics(true)
    })

    // Handle Reject Button Click
    rejectBtn.addEventListener("click", function () {
        localStorage.setItem("analytics_consent", "denied")
        consentBanner.style.display = "none"
        loadAnalytics(false)
    })

    // Ensure GA4 script is loaded before setting up events
    if (typeof gtag === "function") {
        document.dispatchEvent(new Event("gtagLoaded"))
    } else {
        document.addEventListener("gtagLoaded", () => {
            console.log("GA4 loaded")
        })
    }
});

// Function to Load GA4 Analytics
function loadAnalytics(consentGranted = true) {
    const script = document.createElement("script")
    script.async = true
    script.src = "https://www.googletagmanager.com/gtag/js?id=X-XXXXXXX"
    document.head.appendChild(script)

    script.onload = function () {
        window.dataLayer = window.dataLayer || []
        function gtag() {
            dataLayer.push(arguments)
        }
        window.gtag = gtag

        gtag("consent", "default", {
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            analytics_storage: "denied",
        })

        gtag("js", new Date())
        gtag("config", "X-XXXXXXX", { anonymize_ip: true })

        gtag("consent", "update", {
            analytics_storage: consentGranted ? "granted" : "denied",
        })

        // Dispatch an event to notify that GA4 has been loaded
        document.dispatchEvent(new Event("gtagLoaded"))
    }
}

// Setup tracking events when GA4 is loaded
document.addEventListener('gtagLoaded', function () {
    const consentStatus = localStorage.getItem("analytics_consent");
    if (consentStatus === "granted") {
        setupGlobalTrackingEvents();
    } else {
        console.log("Consent not granted: Skipping GA4 event setup.");
    }
});

// Setup tracking events for buttons and links
function setupGlobalTrackingEvents() {

}

function sendAnalyticsEvent(eventType, category, label, value, additionalParams = {}) {
    const eventData = {
        event_category: category,
        event_label: label,
        value: value,
        ...additionalParams,
    };

    gtag("event", eventType, eventData);
}