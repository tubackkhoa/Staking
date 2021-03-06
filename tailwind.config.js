module.exports = {
    purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    mode: 'jit',
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'hwl-gray-1': '#17141B',  //'#24252D',
                'hwl-gray-2': '#26272E',
                'hwl-gray-3': '#363943',
                'hwl-gray-4': '#535562',
                'nav-bar': '#1C171D',
                'Blue-1': '#4664F0',
                'Blue-2': '#0177FB',
                'Gray-1': '#232128',
                'Gray-2': '#2D2E36',
                'Gray-3': '#8B8CA7',
                'Gray-5': '#8B8CA6',
                'Gray-4': '#3B3C4E',
                'Gray-21': '#23242F',
                'Gray-20': '#2C2D3A',
                'Green-1': '#13B9B9',
                'Green-2': 'rgba(19, 185, 185, 0.3)',
                'blue-linear': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #029CC1 100%)',
                'yellow-linear': 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #E2C656 100%)',
                'linear-blue-2': 'linear-gradient(101.12deg, #4664F0 27.35%, rgba(70, 100, 240, 0.6) 99.99%, #C81CC5 100%, #4664F0 100%)',
                'Yellow-1': '#F0B90B',
                'Purple-1': '#DA18A3',
                'Purple-2': '#A695FF',
                'Border-1': 'rgba(190, 194, 196, 0.4)',
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
                nav: '0px 4px 12px rgba(0, 0, 0, 0.16)',
            }
        },
        borderWidth: {
            DEFAULT: '1px',
            '0.5': '0.1px',
            '2': '2px',
            '3': '3px',
            '4': '4px',
            '6': '6px',
            '8': '8px',
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
