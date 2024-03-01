module.exports = () => {
  const transpileModules = ['@factor', '.*factor', '@kaption', 'dayjs']
  require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      strict: false,
      allowJs: true,
      resolveJsonModule: true,
      moduleResolution: 'node',
      module: 'commonjs',
      target: 'es2020',
      esModuleInterop: true,
      skipLibCheck: true,
    },
    ignore: [`node_modules/(?!(${transpileModules.join('|')}))`],
  })
}
