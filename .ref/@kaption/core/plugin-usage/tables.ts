export default {}
// if (!existsUsageTable) {
//   await db.schema.createTable(AppTable.Usage, (t) => {
//     t.string(`usage_id`, 32)
//       .primary()
//       .defaultTo(db.raw(`generate_object_id('us')`))
//     t.dateTime("timestamp").defaultTo(db.fn.now())
//     t.string("organization_id", 32)
//       .references(`${AppTable.Organizations}.organization_id`)
//       .onUpdate("CASCADE")

//     t.string("project_id")
//       .references(`${AppTable.Projects}.project_id`)
//       .onUpdate("CASCADE")

//     t.integer("sessions")
//     t.integer("events")
//     t.integer("replays")

//     t.string("env")

//     t.timestamps(true, true)
//   })
// }
