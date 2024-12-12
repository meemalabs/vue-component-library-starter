import type { RequestInstance } from '@stacksjs/types'
import { Action } from '@stacksjs/actions'
import User from '../../../storage/framework/orm/src/models/User.ts'

export default new Action({
  name: 'FetchUserSubscriptionsAction',
  description: 'Fetch the users subscriptions',
  method: 'GET',
  async handle(request: RequestInstance) {
    const userId = Number(request.getParam('id'))
    const user = await User.find(userId)

    const subscriptions = await user?.subscriptions()

    return subscriptions
  },
})
