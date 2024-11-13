import Stripe from 'stripe'
const apiUrl = `http://localhost:3008`

export const usePaymentStore = defineStore('payment', {
  state: (): any => {
    return {
      paymentMethods: [] as Stripe.PaymentMethod[]
    }
  },

  actions: {
    async fetchUserPaymentMethods(): Promise<void> {
      const response: any = await fetch(`${apiUrl}/stripe/user-payment-methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }).then((res) => res.json())

      this.paymentMethods = response.data
    },
  },

  getters: {
    getPaymentMethods(state): Stripe.PaymentMethod[] {
      return state.paymentMethods
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(usePaymentStore, import.meta.hot))
