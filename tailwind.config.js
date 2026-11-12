
export default {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        wine: '#681f32',
        gold: '#b89555',
        ivory: '#fbf8f2',
        beige: '#eee5d9',
        charcoal: '#292522'
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Poppins', 'sans-serif'],
        promo: ['Cormorant Garamond', 'serif']
      }
    }
  },
  plugins: []
};
