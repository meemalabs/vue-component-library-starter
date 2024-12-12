import type { RequestInstance } from '@stacksjs/types'
import { Action } from '@stacksjs/actions'
import User from '../../../storage/framework/orm/src/models/User.ts'

export default new Action({
  name: 'DeleteDefaultPaymentAction',
  description: 'Delete the customers default payment method',
  method: 'POST',
  async handle(request: RequestInstance) {
    const userId = Number(request.getParam('id'))

    const user = await User.find(userId)
    const paymentMethod = Number(request.get('paymentMethod'))

    await user?.deletePaymentMethod(paymentMethod)
  },
})
