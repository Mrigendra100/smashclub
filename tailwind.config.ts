import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                court: {
                    green: '#15803d',
                    deep: '#14532d',
                    darker: '#0f2e1a',
                    light: '#dcfce7',
                    DEFAULT: '#15803d',
                },
                rich: {
                    white: '#f8fafc',
                    gray: '#f1f5f9',
                    DEFAULT: '#f8fafc',
                },
            },
        },
    },
    plugins: [],
};
export default config;
