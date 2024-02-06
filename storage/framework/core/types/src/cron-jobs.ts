/**
 * Cron Job Options.
 */
export interface JobOptions {
  /**
   * The name of the job.
   */
  name?: string

  handle?: string | Function
  action?: string
  description?: string
  queue?: string
  timezone?: string
  tries?: number
  backoff?: number | number[]
  rate?: string | Every
  enabled?: boolean
}

export type JobConfig = JobOptions
export type Job = JobOptions
export type Jobs = Job[]
export type CronJob = Job
export type CronJobs = Jobs

// export type Job = JobOptions
// export type Jobs = Job[]
// export type CronJob = Job
// export type CronJobs = Jobs

export enum Every {
  // Second = '* * * * * *',
  // FiveSeconds = '*/5 * * * * *',
  // TenSeconds = '*/10 * * * * *',
  // ThirtySeconds = '*/30 * * * * *',
  Minute = '* * * * *',
  Hour = '0 * * * *',
  HalfHour = '0,30 * * * *',
  Day = '0 0 * * *',
  Month = '0 0 1 * *',
  Week = '0 0 * * 0',
  Year = '0 0 1 1 *',
  FifthMinute = '*/5 * * * *',
  TenthMinute = '*/10 * * * *',
}
