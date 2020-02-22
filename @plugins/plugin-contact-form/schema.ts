export default {
  name: "contact-form",
  permissions: {
    create: { accessLevel: 0 },
    retrieve: {
      accessLevel: 100,
      accessAuthor: true
    }
  }
}
