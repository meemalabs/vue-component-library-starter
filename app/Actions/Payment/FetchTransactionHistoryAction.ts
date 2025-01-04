import type { RequestInstance } from '@stacksjs/types'
import { Action } from '@stacksjs/actions'
import Transaction from '../../../storage/framework/orm/src/models/Transaction.ts'
import User from '../../../storage/framework/orm/src/models/User.ts'

export default new Action({
  name: 'FetchTransactionHistoryAction',
  description: 'Fetch the users transaction history',
  method: 'GET',
  async handle(request: RequestInstance) {
    const userId = Number(request.getParam('id'))
    const user = await User.find(userId)

    const transactions = await Transaction.where('user_id', user?.id).get()

    return transactions
  },
})
