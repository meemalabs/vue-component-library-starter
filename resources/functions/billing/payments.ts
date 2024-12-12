import { confirmCardSetup, loadCardElement } from '@stacksjs/browser'

const paymentStore = usePaymentStore()

export function useBillable() {
  function convertUnixTimestampToDate(timestamp: number): string {
    // Create a Date object from the Unix timestamp
    const date = new Date(timestamp * 1000) // Multiply by 1000 to convert to milliseconds

    // Define arrays for month names
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    // Extract day, month, and year
    const day = date.getDate()
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    // Return the formatted string in "Month Day, Year" format
    return `${month} ${day}, ${year}`
  }

  async function loadCardForm(): Promise<boolean> {
    const isCreated = await loadCardElement()

    return isCreated
  }

  async function handleAddPaymentMethod(elements: any) {
    const clientSecret = await paymentStore.fetchSetupIntent(1)

    const param = {
      clientSecret,
      paymentMethod: {
        card: elements,
        billing_details: { name: 'Chris Breuer' },
      },
    }

    const { setupIntent, error } = await confirmCardSetup(param)

    if (error) {
      console.error(error.message)
    }
    else {
      await paymentStore.storePaymentMethod(setupIntent.payment_method)

      if (!paymentStore.hasPaymentMethods)       
        await paymentStore.setUserDefaultPaymentMethod(setupIntent.payment_method)

    }
  }

  function isEmpty(object: any) {
    return !object // Checks for null or undefined
      || (typeof object === 'object'
        && Object.keys(object).length === 0)
  }

  const updatingPlanState = computed(() => {
    return !isEmpty(paymentStore.getCurrentPlan) && paymentStore.getPlanState
  })

  const showCurrentPlan = computed(() => {
    return !isEmpty(paymentStore.getCurrentPlan) && !paymentStore.getPlanState
  })

  const showPlans = computed(() => {
    return isEmpty(paymentStore.getCurrentPlan)
  })

  function editPlan() {
    paymentStore.openPlans()
  }

  function cancelEditPlan() {
    paymentStore.closePlans()
  }

  return { loadCardForm, handleAddPaymentMethod, isEmpty, convertUnixTimestampToDate, editPlan, updatingPlanState, showCurrentPlan, cancelEditPlan, showPlans }
}
