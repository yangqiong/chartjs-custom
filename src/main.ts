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
    hoverRadius: 0,
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
  },
  onClick(_: ChartEvent, chartElements: ActiveElement[], chart: Chart) {
    if (chartElements.length == 1) {
      chart.config.options.plugins["selected"] = {
        datasetIndex: chartElements[0].datasetIndex,
        index: chartElements[0].index,
      }
      chart.update();
    }
  },
  plugins: {
    "selected": {
      datasetIndex: 0,
      index: 0,
    }
  }
}

const plugin = {
  id: "selected",
  afterDraw: (chart: Chart, _, options: options) => {
    if (options.datasetIndex >= 0 && options.index >= 0) {
      chart.data.datasets.forEach(function (_, i) {
        const meta = chart.getDatasetMeta(i);
        if (i === options.datasetIndex) {
          const data = meta.data[options.index];
          const { x, y } = data;
          const radius = data.options.radius + 1;

          const ctx = chart.ctx;
          const { chartArea } = chart;

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.strokeStyle = "#7DDDB5";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.setLineDash([5, 2]);
          ctx.moveTo(x, y + radius + 2);
          ctx.lineTo(x, chartArea.bottom);
          ctx.stroke();

          ctx.beginPath();
          ctx.setLineDash([5, 2]);
          ctx.moveTo(chartArea.left, y);
          ctx.lineTo(x - radius - 2, y);
          ctx.stroke();

          ctx.restore();
        }
      });
    }
  }
}

const config: ChartConfiguration = {
  type: 'bubble',
  data,
  options,
  plugins: [plugin]
};

const $myChart = document.getElementById('myChart') as HTMLCanvasElement;
if ($myChart) {
  new Chart($myChart, config);
}
