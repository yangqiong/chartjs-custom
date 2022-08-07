import Utils from './Utils';
import { Chart, ChartConfiguration, BubbleDataPoint, ChartData, LineElement, BubbleController, CategoryScale, LinearScale, PointElement } from 'chart.js'
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
