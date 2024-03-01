// const fs = require('node:fs')
// const path = require('node:path')

// const exists = fs.existsSync(path.join(process.cwd(), '../factor/package.json'))
// const localInstall = process.env.INSTALL_ENV === 'local'
function rewriteFactorDependency(deps) {
  // Object.entries(deps).forEach(([name, version]) => {
  //   if (name.includes("@factor")) {
  //     deps[name] =
  //       exists && localInstall ? `file:~/Projects/factor/${name}` : "latest"
  //   }
  // })
  return deps
}

function readPackage(pkg, _context) {
  pkg.dependencies = rewriteFactorDependency(pkg.dependencies)
  pkg.devDependencies = rewriteFactorDependency(pkg.devDependencies)

  return pkg
}

function afterAllResolved(lockfile, _context) {
  return lockfile
}

module.exports = {
  hooks: {
    afterAllResolved,
    readPackage,
  },
}
