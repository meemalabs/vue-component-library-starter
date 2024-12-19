import type { ProjectRequestType } from '../types/requests'
import { Request } from '@stacksjs/router'
import { customValidate, validateField } from '@stacksjs/validation'

interface ValidationField {
  rule: ReturnType<typeof schema.string>
  message: Record<string, string>
}

interface CustomAttributes {
  [key: string]: ValidationField
}
interface RequestDataProject {
  id: number
  name: string
  description: string
  url: string
  status: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
}
export class ProjectRequest extends Request<RequestDataProject> implements ProjectRequestType {
  public id = 1
  public name = ''
  public description = ''
  public url = ''
  public status = ''
  public created_at = new Date()
  public updated_at = new Date()

  public async validate(attributes?: CustomAttributes): Promise<void> {
    if (attributes === undefined || attributes === null) {
      await validateField('Project', this.all())
    }
    else {
      await customValidate(attributes, this.all())
    }
  }
}

export const request = new ProjectRequest()
