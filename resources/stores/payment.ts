import type Stripe from 'stripe'
import type { StripePaymentMethod } from '../types/billing'
import { dispatch } from '@stacksjs/events'

const apiUrl = `http://localhost:3008`

export const usePaymentStore = defineStore('payment', {
  state: (): any => {
    return {
      paymentMethods: [] as StripePaymentMethod[],
      transactionHistory: [] as Stripe.Invoice[],
      defaultPaymentMethod: {} as StripePaymentMethod,
      activeSubscription: {} as Stripe.Subscription,
      subscriptions: [] as Stripe.Subscription[],
      stripeCustomer: {} as Stripe.Customer,
      paymentPlans: [] as any[],
      planState: false as boolean,
    }
  },

  actions: {
    async fetchSetupIntent(): Promise<string> {
      const url = 'http://localhost:3008/payments/create-setup-intent'

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      const client: any = await response.json()
      const clientSecret = client.client_secret

      return clientSecret
    },

    async subscribeToPlan(body: { type: string, plan: string, description: string }): Promise<string> {
      const url = 'http://localhost:3008/payments/create-subscription'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const client: any = await response.json()

      dispatch('subscription:created')

      return client
    },

    async updatePlan(body: { type: string, plan: string, description: string }): Promise<string> {
      const url = 'http://localhost:3008/payments/update-subscription'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const client: any = await response.json()

      dispatch('subscription:updated')

      return client
    },

    openPlans() {
      this.planState = true
    },

    closePlans() {
      this.planState = false
    },

    async fetchSubscriptions(): Promise<void> {
      const url = 'http://localhost:3008/payments/fetch-user-subscriptions'

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        const res = await response.json()

        this.subscriptions = res
      }
      await response.json()

      dispatch('subscription:created')
    },

    async cancelPlan(): Promise<void> {
      const url = 'http://localhost:3008/payments/cancel-subscription'

      const providerId = this.getCurrentPlan.subscription.provider_id
      const subscriptionId = this.getCurrentPlan.subscription.id
      const body = { providerId, subscriptionId }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.status !== 204)
        await response.json()

      dispatch('subscription:canceled')
    },

    async fetchUserPaymentMethods(): Promise<void> {
      const response: any = await fetch(`${apiUrl}/payments/user-payment-methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        const res = await response.json()

        this.paymentMethods = res.data
      }

      dispatch('paymentMethods:fetched')
    },

    async fetchTransactionHistory(): Promise<void> {
      const response: any = await fetch(`${apiUrl}/payments/fetch-transaction-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        const res = await response.json()

        this.transactionHistory = res.data
      }

      dispatch('paymentMethods:fetched')
    },

    async deletePaymentMethod(paymentMethod: string): Promise<void> {
      const url = 'http://localhost:3008/payments/delete-payment-method'

      const body = { paymentMethod }

      try {
        await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(body),
        })
      }
      catch (err: any) {
        console.log(err)
      }

      dispatch('paymentMethod:deleted')
    },

    async updateDefaultPaymentMethod(paymentMethod: string): Promise<void> {
      const url = 'http://localhost:3008/payments/update-default-payment-method'

      const body = { paymentMethod }

      try {
        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(body),
        })
      }
      catch (err: any) {
        console.log(err)
      }

      dispatch('paymentMethod:updated')
    },

    async fetchStripeCustomer(): Promise<void> {
      const response: any = await fetch(`${apiUrl}/payments/fetch-customer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        const res = await response.json()
        this.stripeCustomer = res
      }

      dispatch('customer:fetched')
    },

    async fetchDefaultPaymentMethod(): Promise<void> {
      const response: any = await fetch(`${apiUrl}/payments/default-payment-method`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        const res = await response.json()

        this.defaultPaymentMethod = res
      }

      dispatch('paymentMethod:fetched')
    },

    async fetchUserActivePlan(): Promise<void> {
      const response: any = await fetch(`${apiUrl}/payments/fetch-active-subscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.status !== 204) {
        const res = await response.json()

        this.activeSubscription = res
      }
      else {
        this.activeSubscription = {}
      }

      dispatch('subscription:fetched')
    },
  },

  getters: {
    getPaymentMethods(state): StripePaymentMethod[] {
      return state.paymentMethods
    },
    getCurrentPlan(state): Stripe.Subscription {
      return state.activeSubscription
    },
    getTransactionHistory(state): Stripe.Invoice[] {
      return state.transactionHistory
    },
    hasPaymentMethods(state): boolean {
      return state.paymentMethods.length || !(!state.defaultPaymentMethod // Checks for null or undefined
        || (typeof state.defaultPaymentMethod === 'object'
          && Object.keys(state.defaultPaymentMethod).length === 0))
    },
    getDefaultPaymentMethod(state): StripePaymentMethod[] {
      return state.defaultPaymentMethod
    },
    getStripeCustomer(state): any {
      return state.stripeCustomer
    },
    getPlanState(state): boolean {
      return state.planState
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot))
