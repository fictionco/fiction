// export type StripeProductId = {
//   priceId?: string
//   productId?: string
//   key: string
// }

// export const getStripeProducts = (): StripeProductId[] => {
//   const config = process.env.STRIPE_PRODUCTS

//   if (!config) throw new Error("no stripe products configured")

//   return JSON.parse(config) as StripeProductId[]
// }

// export const getStripeProduct = (params: {
//   key?: string
//   productId?: string
// }): StripeProductId | void => {
//   if (!params.key && !params.productId) return

//   const p = getStripeProducts()

//   let product: StripeProductId | undefined = undefined

//   if (params.key) {
//     product = p.find((_) => _.key === params.key)
//   } else {
//     product = p.find((_) => _.productId === params.productId)
//   }

//   if (!product || !product?.key) {
//     throw new Error(`not found: getStripeProduct`)
//   }

//   return product
// }
