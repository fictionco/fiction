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
})

require('./main')
