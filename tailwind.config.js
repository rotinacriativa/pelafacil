
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
                "background-light": "#f6f8f6",
                "background-dark": "#102212",
                "surface-light": "#ffffff",
                "surface-dark": "#152a18",
                "text-main-light": "#111812",
                "text-main-dark": "#e0e6e0",
                "text-sec-light": "#618965",
                "text-sec-dark": "#8fa892",
                "border-light": "#dbe6dc",
                "border-dark": "#2a402d",
            },
            fontFamily: {
                "display": ["Spline Sans", "Lexend", "sans-serif"],
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
