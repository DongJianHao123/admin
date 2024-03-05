import U from "@/common/U";
import { TimeStatic, ValueName } from "..";

export const getTimeChartData = (rawData: any) => {
  const list: Array<any> = (rawData?.daySummaryList || []).toReversed();
  return {
    title: {
      text: `近15天消费时长: ${U.date.remainingHour(rawData?.totalTimeLong)}`,
    },
    tooltip: {
      formatter: ``,
      //  trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: list.map((item: any) => item.sumDay),
    },
    yAxis: {
      type: 'value',
      interval: rawData?.totalTimeLong / 20,
      axisLabel: {
        formatter: (seconds: any) => Math.floor(seconds / 3600) + "时",
      },
    },
    series: [
      {
        data: list.map((item: any) => item.timeLong),
        type: 'bar',
        smooth: true,
        label: {
          show: true,
          position: 'top',
          formatter: (e: any) => (Math.floor(e.data / 3600) > 0 ? Math.floor(e.data / 3600) : (e.data / 3600).toFixed(1)) + "时"
        },
        tooltip: {
          valueFormatter: (seconds: any) => Math.floor(seconds / 3600) + "小时",
        },
      },
    ],
  };
};

export const getRegisterChartOption = (data: TimeStatic[]) => {
  return {
    xAxis: {
      type: 'category',
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '10%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      formatter: ``,
    },
    series: [
      {
        data: data.map(item => item.num),
        type: 'line',
        radius: '60%',
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
}

export const getAgeChartOption = (data: ValueName[]) => {
  let _data = data.sort((a, b) => a.value - b.value)
  let allNum = data.reduce((a, b) => a + b.value, 0)
  return _data.length > 0 ? {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      valueFormatter: (num: number) => ((num / allNum) * 100).toFixed(2) + "%",
    },
    legend: {},
    grid: {
      left:'1%',
      right: '8%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: (val: number) => val + "人",
      },
    },
    yAxis: {
      type: 'category',
      data: _data.map(item => item.name)
    },
    visualMap: {
      max: _data[(_data.length - 1)].value,
      min: _data[0].value,
      dimension: 0,
      show: false,
      inRange: {
        color: ['#67BDF9', '#4F6DEE']
      }
    },
    series: [
      {
        type: 'bar',
        data: _data.map(item => item.value),
        radius: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: (val: ValueName) => val.value + '人'
        },
      }
    ]
  } : {};

}



//   tooltip: {
//     trigger: 'item'
//   },
//   legend: {
//     orient: 'vertical',
//     left: 'right',
//     top: 'top',
//     show: true
//   },
//   series: [
//     {
//       name: 'Access From',
//       type: 'pie',
//       radius: '80%',
//       label: {
//         show: false,
//         position: 'center'
//       },
//       data: data,
//       emphasis: {
//         itemStyle: {
//           shadowBlur: 10,
//           shadowOffsetX: 0,
//           shadowColor: 'rgba(0, 0, 0, 0.5)'
//         }
//       }
//     }
//   ]
// };
