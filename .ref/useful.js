// Scans a schema and adds the populated field names to an array property
// Needed to help determine when/where to populate them
// _registerPopulatedFields(schema, options) {
//   const populated = []
//   schema.eachPath(function process(pathName, schemaType) {
//     if (pathName == "_id") return
//     if (schemaType.options.ref || (schemaType.caster && schemaType.caster.options.ref)) {
//       if (!populated.includes(pathName)) {
//         populated.push(pathName)
//       }
//     }
//   })

//   schema.populatedFields = populated
// }
