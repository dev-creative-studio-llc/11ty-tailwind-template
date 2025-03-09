document.addEventListener("DOMContentLoaded", function () {
    // theme support
    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    document.documentElement.classList.toggle(
        "dark",
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    // Whenever the user explicitly chooses light mode
    localStorage.theme = "light";
    // Whenever the user explicitly chooses dark mode
    localStorage.theme = "dark";
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");


    // Desktop Navbar
    // Select all dropdown toggle buttons in the desktop navigation.
    const desktopDropdownToggles = document.querySelectorAll('.desktop-dropdown-toggle');
    const desktopMenu = document.getElementById("desktop-navbar-menu");

    if (desktopDropdownToggles && desktopMenu) {
        desktopDropdownToggles.forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                // Prevent the default action
                e.preventDefault();

                // Find the parent element with class "dropdown-parent"
                const parent = toggle.closest('.dropdown-parent');

                // Toggle the 'open' class on the parent element
                if (parent) {
                    parent.classList.toggle('open');
                }
            });
        });

        // Optionally, close dropdowns if clicking outside.
        document.addEventListener('click', function (e) {
            desktopDropdownToggles.forEach(function (toggle) {
                const parent = toggle.closest('.dropdown-parent');
                if (parent && !parent.contains(e.target)) {
                    parent.classList.remove('open');
                }
            });
        });

        // NEW: Close dropdown when a dropdown menu item is clicked
        const dropdownLinks = document.querySelectorAll('.dropdown-menu a');
        dropdownLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                const parent = link.closest('.dropdown-parent');
                if (parent) {
                    parent.classList.remove("open");
                }
            });
        });
    }

    // Mobile Navbar
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = mobileMenu.querySelectorAll("a");
    const dropdownButtons = document.querySelectorAll(".dropdown-toggle");

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            mobileMenuToggle.innerHTML = mobileMenu.classList.contains("hidden")
                ? '<i class="fas fa-bars fa-2x"></i>'
                : '<i class="fas fa-times fa-2x"></i>';
        });

        // Close menu when a nav item is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", function () {
                mobileMenu.classList.add("hidden");
                mobileMenuToggle.innerHTML = mobileMenu.classList.contains("hidden")
                    ? '<i class="fas fa-bars fa-2x"></i>'
                    : '<i class="fas fa-times fa-2x"></i>';
            });
        });
    }

    dropdownButtons.forEach(button => {
        button.addEventListener("click", function () {
            const menuId = this.dataset.menu; // Get the menu ID from data attribute
            const menu = document.getElementById(menuId + "-menu");
            const icon = this.querySelector("i");

            // Close any open dropdowns before opening a new one
            document.querySelectorAll(".dropdown-menu").forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.classList.add("hidden");
                    const otherIcon = otherMenu.previousElementSibling.querySelector("i");
                    if (otherIcon) otherIcon.classList.remove("rotate-45");
                }
            });

            // Toggle current dropdown
            menu.classList.toggle("hidden");
            icon.classList.toggle("rotate-90");
        });
    });

    // Floating Buttons
    const stickyFloatingBtns = document.getElementById("sticky-floating-buttons");
    const backToTopBtn = document.getElementById("back-to-top");

        // Show/Hide Floating Buttons Based on Scroll Position
        window.addEventListener("scroll", () => {
            const isMobile = window.matchMedia("(max-width: 640px)").matches;
    
            if (!isMobile && window.scrollY > 300) {
                stickyFloatingBtns?.classList.remove("hidden");
            } else {
                stickyFloatingBtns?.classList.add("hidden");
            }
        });

    // Smooth Scroll to Top (for both desktop and mobile buttons)
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    backToTopBtn?.addEventListener("click", scrollToTop);
});