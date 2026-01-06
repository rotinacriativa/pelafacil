
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
                "primary": "#13ec25",
                "primary-hover": "#0fd120",
                "primary-dark": "#0ea31b",
                "background-light": "#f6f8f6",
                "background-dark": "#102212",
                "surface-light": "#ffffff",
                "surface-dark": "#1a2e1d",
                "text-main": "#111812",
                "text-secondary": "#618965",
                "text-muted": "#618965",
                "accent-warning": "#f59e0b",
                "danger": "#ff4d4d",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "1.5rem",
                "xl": "2rem",
                "2xl": "3rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        forms,
        containerQueries,
    ],
}
