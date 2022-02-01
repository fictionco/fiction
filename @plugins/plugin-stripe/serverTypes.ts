import { PrivateUser, EndpointResponse } from "@factor/types"
import Stripe from "stripe"
import { CustomerData } from "./types"

type ManageAction =
  | "create"
  | "retrieve"
  | "update"
  | "delete"
  | "list"
  | "cancel"
  | "restore"
  | "setDefault"
  | "attach"

export type PaymentsEndpoint = {
  manageCustomer: {
    request: {
      customerId?: string
      id?: string
      name?: string
      email?: string
      _action: ManageAction
    }
    response: EndpointResponse<Stripe.Customer | Stripe.DeletedCustomer> & {
      customerId: string
      customerData?: CustomerData
    }
  }
  getCustomerData: {
    request: { customerId: string }
    response: EndpointResponse<Partial<CustomerData>>
  }
  listCustomerSubscriptions: {
    request: {
      customerId: string
    }
    response: EndpointResponse<Stripe.ApiList<Stripe.Subscription>>
  }
  manageSubscription: {
    request: {
      _action?: ManageAction
      customerId?: string
      paymentMethodId?: string
      priceId?: string
      idempotencyKey?: string
      coupon?: string
      subscriptionId?: string
      note?: string
    }
    response: EndpointResponse<Stripe.Subscription> & {
      customerId: string
      customerData?: CustomerData
      userId?: string
      user?: PrivateUser
    }
  }
  managePaymentMethod: {
    request: {
      customerId: string
      paymentMethodId?: string
      _action: ManageAction
    }
    response: EndpointResponse<Stripe.ApiList<Stripe.PaymentMethod>> & {
      customerId: string
      customerData?: CustomerData
      setupIntent?: Stripe.SetupIntent
    }
  }
  getInvoices: {
    request: { customerId: string; limit?: number; startingAfter?: string }
    response: EndpointResponse<Stripe.ApiList<Stripe.Invoice>> & {
      customerId: string
      customerData?: CustomerData
    }
  }
  getProduct: {
    request: { productId: string }
    response: EndpointResponse<Stripe.Product>
  }
  getAllProducts: {
    request: undefined
    response: EndpointResponse<Stripe.Product[]>
  }
  getCoupon: {
    request: { couponCode: string }
    response: EndpointResponse<Stripe.Response<Stripe.Coupon>>
  }
}

export type PaymentsFetch<U extends keyof PaymentsEndpoint> = {
  request: PaymentsEndpoint[U]["request"]
  response: PaymentsEndpoint[U]["response"]
  endpoint: `/payments/${U}`
  method: U
}

export type PaymentsEndpointMethod<U extends keyof PaymentsEndpoint> = (
  args: PaymentsEndpoint[U]["request"],
) => Promise<PaymentsEndpoint[U]["response"]>

export type PaymentsEndpointMethodWithBearer<U extends keyof PaymentsEndpoint> =
  (
    args: PaymentsEndpoint[U]["request"] & {
      bearer: PrivateUser
      userId: string
    },
  ) => Promise<PaymentsEndpoint[U]["response"]>

export type EndpointMethods = {
  [K in keyof PaymentsEndpoint]:
    | PaymentsEndpointMethod<K>
    | PaymentsEndpointMethodWithBearer<K>
}
