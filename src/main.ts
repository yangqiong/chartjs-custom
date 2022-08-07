import Utils from './Utils';
import { Chart, ChartConfiguration, BubbleDataPoint, ChartData, LineElement, BubbleController, CategoryScale, LinearScale, PointElement, ChartEvent, ActiveElement } from 'chart.js'
Chart.register(BubbleController, CategoryScale, LinearScale, PointElement, LineElement)

const DATA_COUNT = 7;
const NUMBER_CFG = { count: DATA_COUNT, rmin: 5, rmax: 15, min: 0, max: 100 }

const points = Utils.bubbles(NUMBER_CFG) as BubbleDataPoint[];
const data: ChartData = {
  labels: Utils.months({ count: 7 }),
  datasets: [{
    type: 'bubble',
    data: points.map(point => { point.r = 10; return point; }),
    backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
  }]
};

const options = {
  scales: {
    x: {
      grid: {
        display: false,
      }
    },
    y: {
      grid: {
        display: false,
        drawBorder: false,
      }
    }
  },
  onHover: (event: ChartEvent, chartElements: ActiveElement[]) => {
    const target = event.native?.target as HTMLCanvasElement;
    if (chartElements.length == 1) {
      target.style.cursor = "pointer";
    }
    if (chartElements.length == 0) {
      target.style.cursor = "default";
    }
  }
}

const config: ChartConfiguration = {
  type: 'bubble',
  data,
  options
};

const $myChart = document.getElementById('myChart') as HTMLCanvasElement;
if ($myChart) {
  new Chart($myChart, config);
}
