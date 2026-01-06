
import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#00ff66", // Updated to vibrant green from screenshot
                "primary-dark": "#0db61b",
                "primary-hover": "#0fd120",
                "background-light": "#f6f8f6",
                "background-dark": "#102212",
                "surface-light": "#f0f4f0",
                "surface-dark": "#233825",
                "card-light": "#ffffff",
                "card-dark": "#1a2c1e",
                "accent-warning": "#FFB800",
                "text-main": "#111812",
                "text-muted": "#618965",
                "text-secondary": "#618965",

                // Legacy Aliases for backwards compatibility
                "text-main-light": "#111812",
                "text-main-dark": "#e0e6e0",
                "text-sec-light": "#618965",
                "text-sec-dark": "#8fa892",
                "border-light": "#dbe6dc",
                "border-dark": "#2a402d",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Lexend", "sans-serif"],
            },
            borderRadius: {
                "lg": "1.5rem",
                "xl": "2rem",
                "2xl": "3rem",
            },
        },
    },
    plugins: [
        forms,
        containerQueries,
    ],
}
