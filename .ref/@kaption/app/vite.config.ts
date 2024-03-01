export default {
  plugins: [],
  optimizeDeps: {
    include: ['chart.js', 'mapbox-gl', '@stripe/stripe-js'],
    exclude: [
      '@kaption/core',
      'consola',
      'prettyoutput',
      'sql-formatter',
      'knex',
      'stripe',
    ],
  },
}
