module.exports = {
    purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'hwl-blue-1': '#4664F0',
                'hwl-gray-1': '#17141B',  //'#24252D',
                'hwl-gray-2': '#26272E',
                'hwl-gray-3': '#363943',
                'hwl-gray-4': '#535562',
                'nav-bar': '#1C171D',
                'blue-linear': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #029CC1 100%)',
                'yellow-linear': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #E2C656 100%)',
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'cardNft': '0 25px 50px -12px #029CC1',
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
                inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                none: 'none',
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
