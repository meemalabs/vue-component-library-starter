import { defineBuildConfig } from 'unbuild'
import { buildComposables as stacks } from '..'

export default defineBuildConfig(stacks(['../../../composables/index']))
