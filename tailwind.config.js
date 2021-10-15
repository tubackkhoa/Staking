module.exports = {
    purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'hwl-blue-1': '#4664F0',
                'hwl-gray-1': '#24252D',
                'hwl-gray-2': '#26272E',
                'hwl-gray-3': '#363943',
                'hwl-gray-4': '#535562',
                'blue-linear': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #029CC1 100%)',
                'yellow-linear': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #E2C656 100%)',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
