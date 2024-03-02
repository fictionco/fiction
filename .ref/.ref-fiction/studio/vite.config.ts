export default {
  plugins: [],
  optimizeDeps: {
    include: ['mapbox-gl', '@stripe/stripe-js'],
    exclude: ['consola', 'prettyoutput', 'sql-formatter', 'knex', 'stripe'],
  },
}
