import { log } from '@stacksjs/cli'
import { path } from '@stacksjs/path'
import { Model } from '@stacksjs/types'
import { SimpleMessagesProvider, VineError, reportError, schema } from '@stacksjs/validation'
import type { SchemaTypes } from '@vinejs/vine/types'

interface RequestData {
  [key: string]: string | number | null | undefined | boolean
}

export async function validateField(modelFile: string, params: RequestData): Promise<void> {

  console.log(params)
  const model = (await import(path.userModelsPath(modelFile))).default
  const attributes = model.attributes

  const ruleObject: Record<string, SchemaTypes> = {}
  const messageObject: Record<string, string> = {}

  for (const key in attributes) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (attributes.hasOwnProperty(key)) {
      ruleObject[key] = attributes[key].validator.rule

      const validatorMessages = attributes[key].validator.message

      for (const validatorMessageKey in validatorMessages) {
        const validatorMessageString = `${key}.${validatorMessageKey}`

        messageObject[validatorMessageString] = attributes[key].validator.message[validatorMessageKey]
      }
    }
  }

  schema.messagesProvider = new SimpleMessagesProvider(messageObject)

  console.log(ruleObject)
  try {
    const vineSchema = schema.object(ruleObject)
    const validator = schema.compile(vineSchema)
    await validator.validate(params)
  } catch (error: any) {
    if (error instanceof VineError.E_VALIDATION_ERROR) reportError(error.messages)

    log.info(error.message)
    throw error
  }
}
