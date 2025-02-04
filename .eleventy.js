// Import prior to `module.exports` within `.eleventy.js`
const { DateTime } = require("luxon");
const path = require("path");
const fs = require("fs");

module.exports = function (eleventyConfig) {
    // Manually filter and copy files
    const sourceDir = "src/assets/styles";
    const destinationDir = "assets/styles";

    fs.readdirSync(sourceDir).forEach((file) => {
        if (!file.endsWith("base.css")) {
            eleventyConfig.addPassthroughCopy({
                [path.join(sourceDir, file)]: path.join(destinationDir, file),
            });
        }
    });

    eleventyConfig.addPassthroughCopy("src/assets/images");
    eleventyConfig.addPassthroughCopy("src/assets/scripts");
    eleventyConfig.addPassthroughCopy("src/assets/favicon");
    eleventyConfig.addPassthroughCopy("src/robots.txt");

    // Shortcode for `dateModified` using file metadata
    eleventyConfig.addShortcode("dateModified", (filePath) => {
        if (filePath) {
            try {
                const stats = fs.statSync(filePath); // Get file stats
                return stats.mtime.toISOString().split("T")[0]; // Last modified date as YYYY-MM-DD
            } catch (error) {
                console.error(`dateModified: Error reading file stats for ${filePath}.`, error);
            }
        } else {
            console.warn("dateModified: Missing filePath.");
        }
        return null; // Fallback for missing or unreadable file
    });

    eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

    eleventyConfig.addFilter("date", (dateObj) => {
        return DateTime.fromISO(dateObj).toLocaleString(DateTime.DATE_MED);
    });

    return {
        dir: {
            input: "src",
            output: "dist",
        },
    };
};