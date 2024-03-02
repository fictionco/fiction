// const fs = require('node:fs')
// const path = require('node:path')

// const exists = fs.existsSync(path.join(process.cwd(), '../fiction/package.json'))
// const localInstall = process.env.INSTALL_ENV === 'local'
function rewriteFictionDependency(deps) {
  // Object.entries(deps).forEach(([name, version]) => {
  //   if (name.includes("@fiction")) {
  //     deps[name] =
  //       exists && localInstall ? `file:~/Projects/fiction/${name}` : "latest"
  //   }
  // })
  return deps
}

function readPackage(pkg, _context) {
  pkg.dependencies = rewriteFictionDependency(pkg.dependencies)
  pkg.devDependencies = rewriteFictionDependency(pkg.devDependencies)

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
