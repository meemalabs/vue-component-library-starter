import type { RequestInstance } from '@stacksjs/types'
import { Action } from '@stacksjs/actions'
import User from '../../../storage/framework/orm/src/models/User.ts'

export default new Action({
  name: 'CreateSubscriptionAction',
  description: 'Create Subscription for stripe',
  method: 'POST',
  async handle(request: RequestInstance) {
    const type = request.get('type') as string
    const plan = request.get('plan') as string
    const period = request.get('period') as string
    const description = request.get('description') as string

    const user = await User.find(1)

    const subscription = await user?.newSubscription(plan, type, { description, metadata: { period } })

    return subscription?.paymentIntent
  },
})
