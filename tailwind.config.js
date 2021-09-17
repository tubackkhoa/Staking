module.exports = {
    darkMode: false,
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'hwl-blue-1': '#4664F0',
                'hwl-gray-1': '#24252D',
                'hwl-gray-2': '#26272E',
                'hwl-gray-3': '#363943',
                'hwl-gray-4': '#535562',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
