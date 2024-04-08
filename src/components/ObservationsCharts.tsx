import ReactECharts from 'echarts-for-react'

import { Observation } from '../types.ts'
import { useGetObservationsQuery } from '../services/observation.ts'

export function ObservationsCharts() {
  const { data } = useGetObservationsQuery()
  const tempSeriesOption = getTempSeriesOption(data ?? [])
  const average7daysTempOption = getAverage7daysTempOption(data ?? [])

  return (
    <div className='flex flex-col gap3'>
      <ReactECharts option={tempSeriesOption} />
      <ReactECharts option={average7daysTempOption} />
    </div>
  )
}

function getTempSeriesOption(data: Observation[]) {
  const seriesData = data?.map((item) => ({
    name: item.timestamp,
    value: [item.timestamp, item.temp],
  }))

  const option = {
    title: {
      text: 'Температура',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      splitLine: {
        show: false,
      },
      scale: true,
      axisLabel: {
        formatter: '{value} °C',
      },
    },
    series: [
      {
        name: 'Температура',
        type: 'line',
        showSymbol: false,
        data: seriesData,
      },
    ],
  }

  return option
}

function getAverage7daysTempOption(data: Observation[]) {
  const preparedData = data.reduce(
    (acc, { timestamp, temp }) => {
      const date = timestamp.split('T')[0]
      if (!acc[date]) {
        acc[date] = { sum: 0, count: 0 }
      }
      acc[date].sum += temp
      acc[date].count += 1
      return acc
    },
    {} as Record<string, { sum: number; count: number }>,
  )

  const averages = Object.entries(preparedData)
    .map(([date, { sum, count }]) => ({
      date,
      averageTemp: sum / count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const last7Days = averages.slice(-7)

  const option = {
    title: {
      text: 'Средняя температура за 7 дней',
    },
    xAxis: {
      type: 'category',
      data: last7Days.map((day) => day.date),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: last7Days.map((day) => day.averageTemp),
        type: 'bar',
      },
    ],
  }

  return option
}
