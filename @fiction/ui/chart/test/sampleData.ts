import { dayjs } from '@fiction/core'
import type { DataCompared, DataPointChart } from '../dataStructure'
import type DateChart from '../DateChart.vue'

type ChartProps = InstanceType<typeof DateChart>['$props']

export const data: ChartProps = {
  title: 'User Activity',
  valueKey: 'users',
  valueFormat: 'number',
  changeFormat: 'normal',
  dateFormat: 'YYYY-MM-DD',
  interval: 'day',
  comparePeriod: 'period',
  loading: false,
  data: {

    main: [
      { date: '2023-06-01', users: 150, count: 200, tense: 'past' },
      { date: '2023-06-02', users: 170, count: 220, tense: 'past' },
      { date: '2023-06-03', users: 180, count: 240, tense: 'past' },
      { date: '2023-06-04', users: 190, count: 260, tense: 'past' },
      { date: '2023-06-05', users: 200, count: 280, tense: 'past' },
      { date: '2023-06-06', users: 210, count: 300, tense: 'past' },
      { date: '2023-06-07', users: 220, count: 320, tense: 'present' },
    ],
    compare: [
      { date: '2023-05-25', users: 120, count: 180, tense: 'past' },
      { date: '2023-05-26', users: 130, count: 200, tense: 'past' },
      { date: '2023-05-27', users: 140, count: 220, tense: 'past' },
      { date: '2023-05-28', users: 150, count: 240, tense: 'past' },
      { date: '2023-05-29', users: 160, count: 260, tense: 'past' },
      { date: '2023-05-30', users: 170, count: 280, tense: 'past' },
      { date: '2023-05-31', users: 180, count: 300, tense: 'past' },
    ],
    mainTotals: {
      date: '2023-06-07',
      users: 1220,
      count: 1820,
    },
    compareTotals: {
      date: '2023-05-31',
      users: 1050,
      count: 1580,
    },
    columns: [
      { name: 'Users', value: 'users', format: 'number' },
      { name: 'Count', value: 'count', format: 'number' },
    ],
    meta: {
      total: 7,
      start: 1685596800,
      end: 1686201600,
      pages: 1,
    },
    params: {
      timeZone: 'UTC',
      orgId: '12345',
      timeEndAt: dayjs('2023-06-07T23:59:59Z'),
      timeStartAt: dayjs('2023-06-01T00:00:00Z'),
      compareEndAt: dayjs('2023-05-31T23:59:59Z'),
      compareStartAt: dayjs('2023-05-25T00:00:00Z'),
      interval: 'day',
    },
  },

}
