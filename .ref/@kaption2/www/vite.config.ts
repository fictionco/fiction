export default {
  plugins: [],

  optimizeDepss: {
    include: ['chart.js', 'mapbox-gl', '@stripe/stripe-js'],
    exclude: ['@factor/plugin-blog-engine', '@factor/plugin-docs-engine'],
  },
}
