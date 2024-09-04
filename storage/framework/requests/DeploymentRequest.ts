import { Request } from '@stacksjs/router'
import type { VineType } from '@stacksjs/types'
import { validateField } from '@stacksjs/validation'
import { customValidate } from '@stacksjs/validation'

import type { DeploymentRequestType } from '../types/requests'

interface ValidationField {
  rule: ReturnType<typeof schema.string>
  message: Record<string, string>
}

interface CustomAttributes {
  [key: string]: ValidationField
}
interface RequestDataDeployment {
  id?: number
  commitSha: string
  commitMessage: string
  branch: string
  status: string
  executionTime: number
  deployScript: string
  terminalOutput: string
  user_id: number
  created_at?: string
  updated_at?: string
  deleted_at?: string
}
export class DeploymentRequest extends Request<RequestDataDeployment> implements DeploymentRequestType {
  public id = 1
  public commit_sha = ''
  public commit_message = ''
  public branch = ''
  public status = ''
  public execution_time = 0
  public deploy_script = ''
  public terminal_output = ''
  public user_id = 0
  public created_at = ''
  public updated_at = ''

  public async validate(attributes?: CustomAttributes): Promise<void> {
    if (attributes === undefined || attributes === null) {
      await validateField('Deployment', this.all())
    } else {
      await customValidate(attributes, this.all())
    }
  }
}

export const request = new DeploymentRequest()
