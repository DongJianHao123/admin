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
  return {
    // title: {
    //   text: 'Referer of a Website',
    //   subtext: 'Fake Data',
    //   left: 'center'
    // },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'top',
      show: true
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '80%',
        label: {
          show: false,
          position: 'center'
        },
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

}
