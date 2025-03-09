const consentBanner = document.getElementById("cookie-consent-banner");
const ga4MeasurementId = "G-Q186WH0511"
const gadsMeasurementId = "AW-16497493814"
// Event queue for gtag events
window.gtagQueue = window.gtagQueue || [];

document.addEventListener("DOMContentLoaded", function () {
    // Check if consent was previously given or rejected
    const consentStatus = localStorage.getItem("analytics_storage");

    if (consentStatus === "granted" || consentStatus === "denied") {
        consentBanner.style.display = "none";
    } else {
        consentBanner.style.display = "block"; // Show banner if no consent state
    }

    loadAnalytics();
    updateAllVisualCues();

    if (typeof gtag === "function") {
        document.dispatchEvent(new Event("gtagLoaded"));
    } else {
        document.addEventListener("gtagLoaded", () => {
            console.log("GA4 loaded");
        });
    }
});

// Centralized function for all gtag commands (including consent updates)
function sendGtagCommand(command, action, params) {
    if (typeof gtag === "function") {
        // Flush any queued events if present
        while (window.gtagQueue && window.gtagQueue.length > 0) {
            const queued = window.gtagQueue.shift();
            gtag("event", queued.eventType, queued.eventData);
        }
        gtag(command, action, params);
    } else {
        console.warn(`gtag is not available for ${command} ${action}`, params);
    }
}

// Centralized analytics event function remains similar
function sendAnalyticsEvent(eventType, category, label, value, additionalParams = {}) {
    const eventData = getEventData(eventType, category, label, value, additionalParams);

    if (typeof gtag === "function") {
        while (window.gtagQueue.length > 0) {
            const queuedEvent = window.gtagQueue.shift();
            gtag("event", queuedEvent.eventType, queuedEvent.eventData);
        }
        gtag("event", eventType, eventData);
    } else {
        window.gtagQueue.push({ eventType, eventData });
        console.warn("gtag is not available yet. Queuing event:", eventType, eventData);
    }
}

function getEventData(eventType, category, label, value, additionalParams = {}) {
    if (eventType === "search")
        return {
            search_term: label
        };
    else if (eventType === "view_item" || eventType === "begin_checkout") {
        return {
            currency: "USD",
            value: additionalParams.price,
            items: [
                additionalParams
            ]
        };
    }
    else if (eventType === "select_item") {
        return {
            item_list_id: "quickbooks_2024_licenses",
            item_list_name: "QuickBooks Desktop Pro Plus 2024 Licenses",
            items: [
                additionalParams
            ]
        };
    }
    else if (eventType === "select_content") {
        return {
            content_type: category,
            content_id: value
        };
    }
    else return {
        event_category: category,
        event_label: label,
        value: value,
        ...additionalParams,
    }
}

// Function to set cookie preference and update visual cues
function setCookiePreference(category, choice) {
    localStorage.setItem(category, choice);
    updateVisualCues(category, choice);
    // Optionally, call your updateIndividualConsent here as well
    updateIndividualConsent(category, choice);
}

// Function to update the visual cues for a given category based on stored preference
function updateVisualCues(category, choice) {
    const grantBtn = document.getElementById(`btn-${category}-granted`);
    const denyBtn = document.getElementById(`btn-${category}-denied`);
    // Clear active styles
    grantBtn.classList.remove('ring-2', 'ring-green-700');
    denyBtn.classList.remove('ring-2', 'ring-red-700');

    if (choice === 'granted') {
        grantBtn.classList.add('ring-2', 'ring-green-700');
    } else if (choice === 'denied') {
        denyBtn.classList.add('ring-2', 'ring-red-700');
    }
}

// On modal load, update visual cues for each category based on localStorage
function updateAllVisualCues() {
    ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'].forEach(function (category) {
        const savedChoice = localStorage.getItem(category);
        if (savedChoice) {
            updateVisualCues(category, savedChoice);
        }
    });
}

// Updated consent functions use sendGtagCommand
function updateConsent(userChoice) {
    const consentParams = {
        ad_storage: userChoice,
        ad_user_data: userChoice,
        ad_personalization: userChoice,
        analytics_storage: userChoice,
    };

    sendGtagCommand("consent", "update", consentParams);

    localStorage.setItem("ad_storage", userChoice);
    localStorage.setItem("ad_user_data", userChoice);
    localStorage.setItem("ad_personalization", userChoice);
    localStorage.setItem("analytics_storage", userChoice);

    consentBanner.style.display = "none";

    if (userChoice === "granted") {
        document.dispatchEvent(new Event("gtagLoaded"));
    }
}

function updateIndividualConsent(category, choice) {
    const consentObject = {};
    consentObject[category] = choice;

    sendGtagCommand("consent", "update", consentObject);

    localStorage.setItem(category, choice);
    consentBanner.style.display = "none";

    if (choice === "granted") {
        document.dispatchEvent(new Event("gtagLoaded"));
    }
}

// Functions to open and close the modal
function openModal() {
    document.getElementById("individualModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("individualModal").classList.add("hidden");
}

// NEW: Function to retrieve the client_id via gtag's get API
function getClientIdFromGtag(callback) {
    if (typeof gtag === "function") {
        gtag('get', ga4MeasurementId, 'client_id', (clientID) => {
            callback(clientID);
        });
    } else {
        callback(null);
    }
}

// Function to Load GA4 Analytics
function loadAnalytics() {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;
    document.head.appendChild(script);

    script.onload = function () {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        window.gtag = gtag;

        gtag("consent", "default", {
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            analytics_storage: "denied",
        });

        gtag("js", new Date());
        gtag("config", ga4MeasurementId, { anonymize_ip: true });

        if (gadsMeasurementId) gtag('config', gadsMeasurementId);

        // Capture the client_id via gtag's get API and store it globally
        getClientIdFromGtag(function (clientID) {
            window.clientID = clientID;
        });

        document.dispatchEvent(new Event("gtagLoaded"));
    }
}

// Setup tracking events when GA4 is loaded
document.addEventListener('gtagLoaded', function () {
    const consentStatus = localStorage.getItem("analytics_storage");
    if (consentStatus === "granted") {
        setupGlobalTrackingEvents();
    } else {
        console.log("Consent not granted: Skipping GA4 event setup.");
    }
});

// Setup tracking events for buttons and links
function setupGlobalTrackingEvents() {
    const page = document.body.getAttribute("data-page");

    setupBackToTopTracking();

    if (page === "homepage")
        setupHomepageTracking();
}

function setupHomepageTracking() { }

function setupBackToTopTracking() {
    const backToTop = document.getElementById("back-to-top");
    if (backToTop) {
        backToTop.addEventListener("click", function () {
            sendAnalyticsEvent("Back to Top Click", "Navigation", "Desktop Back-to-Top clicked on " + document.title, 0);
        });
    }
}