import process from 'node:process'

export async function setup(): Promise<void> {
}
export async function teardown(): Promise<void> {
  setTimeout(() => process.exit(0), 1000).unref()
}
