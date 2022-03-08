export const setup = async (): Promise<void> => {
  process.env.NODE_ENV = "development"
  process.env.TEST_ENV = "unit"
  process.env.POSTGRES_URL = "http://test:test@localhost:5432/test"
  process.env.POSTGRES_PASSWORD = "test"
}

export const teardown = async (): Promise<void> => {}
