/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: [
            "emerald",
            "retro",
            "cyberpunk",
            "halloween",
            "pastel",
            "dracula",
            "lemonade",
            "night",
            "coffee"
        ],
    },
}
