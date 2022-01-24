export const setup = async (): Promise<void> => {
  process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
  process.env.POSTGRES_PASSWORD = "test"
}

export const teardown = async (): Promise<void> => {}
