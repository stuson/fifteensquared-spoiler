// ==UserScript==
// @name         Fifteensquared Spoiler
// @namespace    https://github.com/stuson/fifteensquared-spoiler
// @homepageURL  https://github.com/stuson/fifteensquared-spoiler
// @downloadURL  https://github.com/stuson/fifteensquared-spoiler/releases/latest/download/fifteensquared-spoiler.user.js
// @updateURL    https://github.com/stuson/fifteensquared-spoiler/releases/latest/download/fifteensquared-spoiler.user.js
// @version      0.1
// @description  Hides all answers and explanations for cryptic crosswords on Fifteensquared behind toggleable spoilers.
// @author       Sam Tuson
// @match        https://www.fifteensquared.net/*/*/*/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function () {
    "use strict";

    const addStyle = (cssObj) => {
        const mapProperties = (props) => {
            return Object.entries(props)
                .map(([prop, value]) => {
                    prop = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                    return `${prop}: ${value}`;
                })
                .join("; ");
        };

        const id = "fifteensquared-spoiler-style";
        let styleEl = document.getElementById(id);
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = id;
            document.head.appendChild(styleEl);
        }

        Object.entries(cssObj).forEach(([selector, style]) => {
            styleEl.sheet.insertRule(`${selector} { ${mapProperties(style)} }`);
        });
    };

    const addSpoilers = () => {
        const testRow = (row) => {
            const el = row.firstElementChild;
            if (el.textContent.match(/^\s*\d/)) return true;

            if (row.childElementCount > 1 && !el.textContent && el.colSpan > 1) return true;

            return false;
        };

        const toggleSpoiler = (e) => {
            e.target.classList.toggle("revealed");
        };

        const rows = document.querySelectorAll(".entry-content tr");
        const updatedRows = Array.from(rows).map((row) => {
            if (testRow(row)) {
                row.querySelectorAll("td:nth-of-type(n+2)").forEach((a) => {
                    a.classList.add("spoiler");
                    a.addEventListener("click", toggleSpoiler);
                });

                return row;
            }
        });

        if (updatedRows.length < 1) console.warn("No spoilers added");
    };

    const css = {
        ".spoiler": {
            position: "relative",
            padding: "2px 5px",
        },
        ".spoiler:hover": {
            opacity: "0.8",
        },
        ".spoiler::after": {
            content: "''",
            position: "absolute",
            inset: "0",
            margin: "2px",
            backgroundColor: "rgba(12, 12, 12, 1.0)",
            cursor: "pointer",
            transition: "background-color 0.1s ease-in-out",
        },
        ".spoiler.revealed::after": {
            backgroundColor: "rgba(12, 12, 12, 0.08)",
        },
    };

    addStyle(css);
    addSpoilers();
})();
