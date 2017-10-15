import {h, Component} from 'preact';
import * as fetch from 'isomorphic-fetch';
import {arrayFind, timeToString} from '../utilities';
import './windPlot.css';

interface WindPlotProps {
    stationId: string,
    startTime: number,
    endTime: number,
    timeDiv: number
}
interface Data {
    direction: number,
    gust: number,
    timestamp: number,
    wind: number
}
interface Scale {
    yValueToY: (y:number) => number;
    xValueToX: (x:number) => number;
}
const minMaxWind = 8;
const fontSize = 14;
const tickSize = 7;
const tickMargin = 5;
const aspectRatio = 6/5;
const baseResolution = 400;
const scaledSizeVP = 0.95; // real width that will take the plot, in % to viewport width

// This is made so starting at width `baseResolution`, every time we double the screen width
// we double the area of the canvas (not the width). For smaller screens than `baseResolution`
// it will be linear.
const windowWidth = window.innerWidth * scaledSizeVP;
const canvasWidth = windowWidth < baseResolution ? windowWidth :
    Math.sqrt(baseResolution * windowWidth);
const canvasHeight = canvasWidth / aspectRatio;

export default class WindPlot extends Component<WindPlotProps,{}> {
    private _canvasElement:HTMLCanvasElement;

    async componentDidMount() {
        this.updateAndPaint();
    }

    async updateAndPaint() {
        const context = this._canvasElement.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        const data = await fetchData(this.props.stationId, this.props.startTime, this.props.endTime);
        const maxWind = Math.ceil(data.reduce((max, d) => Math.max(max, d.wind || 0, d.gust || 0), minMaxWind));
        context.strokeStyle = 'black';
        const scale = drawAxis(context, maxWind, this.props);
        context.strokeStyle = 'blue';
        drawPlotPath(context, data, 'wind', scale);
        context.strokeStyle = 'red';
        drawPlotPath(context, data, 'gust', scale);
    }

    render(props:WindPlotProps) {
        return <canvas className='windplot' width={canvasWidth} height={canvasHeight} ref={(r:HTMLCanvasElement) => this._canvasElement = r} />
    }
}

function fetchData(stationId:string, startTime:number, endTime:number):Data[] {
    return fetch(`https://livewind.freemyip.com/api/query?version=1&windData=${stationId};${startTime};${endTime}`)
        .then(res => res.json())
        .then(data => {
            const windData:any[] = data.windData;
            const header = windData[0];
            return windData.slice(1).map(d => {
                const obj = {};
                header.forEach((h,i) => obj[h] = d[i]);
                return obj;
            });
        });
}

function drawAxis(context:CanvasRenderingContext2D, maxY:number, props:WindPlotProps):Scale {
    const {width, height} = context.canvas;
    const numberWidth = context.measureText('0').width+1;
    const numberHeight = fontSize * 2/3;
    const semicolonWidth = context.measureText(':').width+1;

    const yAxisMargin = 2*numberWidth + tickSize/2 + tickMargin;
    const xAxisMargin = numberWidth + numberHeight + tickSize/2 + tickMargin;
    const marginTop = numberHeight / 2 + 10;
    const marginBottom = numberHeight + tickMargin;
    const marginLeft = numberWidth + tickMargin;
    const marginRight = semicolonWidth / 2 + 2*numberWidth;
    const ySpace = height - xAxisMargin - marginTop;
    const xSpace = width - yAxisMargin - marginRight;
    const yStep = getYStep(maxY, ySpace);
    const xStep = getXStep(props.endTime - props.startTime, xSpace);
    const yValueToY = (yValue:number) => marginTop + ySpace * (1 - yValue / maxY);
    const xValueToX = (xValue:number) => yAxisMargin + xSpace * (xValue - props.startTime) / (props.endTime - props.startTime);

    context.font = `${fontSize}px Arial`;
    // Axis
    context.beginPath();
    context.moveTo(yAxisMargin, marginTop);
    context.lineTo(yAxisMargin, height-marginBottom);
    context.moveTo(marginLeft, height-xAxisMargin);
    context.lineTo(width-marginRight, height-xAxisMargin);

    // Y-ticks
    for(let yValue=0; yValue<=maxY; yValue+=yStep) {
        const y = yValueToY(yValue);
        context.moveTo(yAxisMargin-tickSize/2, y);
        context.lineTo(yAxisMargin+tickSize/2, y);
        context.strokeText(`${yValue}`, 0, y+numberHeight/2);
    }

    // X-ticks
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60;
    const xValueStart =
        Math.floor(
            (props.startTime - timezoneOffset)
            / (60*60*24)
        ) * (60*60*24) + timezoneOffset;

    for(let xValue=xValueStart; xValue<=props.endTime; xValue+=xStep) {
        const x = xValueToX(xValue);
        if(x < yAxisMargin) continue;
        context.moveTo(x, height - xAxisMargin - tickSize/2);
        context.lineTo(x, height - xAxisMargin + tickSize/2);
        context.strokeText(timeToString(new Date(xValue*1000)), x-marginRight, height-1);
    }
    context.stroke();
    
    return {
        yValueToY,
        xValueToX
    };
}
function drawPlotPath(context:CanvasRenderingContext2D, data:Data[], property:string, scale:Scale) {
    data = data.filter(d => d[property] != undefined);
    if(!data.length) return;

    const connectDistance = scale.xValueToX(60*60) - scale.xValueToX(0);
    
    context.beginPath();
    let prevX = scale.xValueToX(data[0].timestamp);
    context.moveTo(prevX, scale.yValueToY(data[0][property]));
    for(let i=1; i<data.length; i++) {
        const x = scale.xValueToX(data[i].timestamp);
        const y = scale.yValueToY(data[i][property]);
        if(x-prevX > connectDistance) {
            context.moveTo(x, y);
        }else {
            context.lineTo(x, y);
        }
        prevX = x;
    }
    context.stroke();
}

const minPxPerTick = {
    x: 60,
    y: 40
};
function getYStep(maxY, space) {
    const pixelsPerYValue = space / maxY;
    const minYValuePerTick = minPxPerTick.y / pixelsPerYValue; // Asuming ticks are minimum distance, what's the distance between two ticks in y-value?
    return Math.ceil(minYValuePerTick / 2) * 2; // Qualsevol nombre parell
}
const xDivisions = [15,30,60,60*2,60*3,60*4,60*6,60*8,60*12,60*24]
    .map(minutes => minutes*60);
function getXStep(maxX, space) {
    const pixelsPerXValue = space / maxX;
    const minXValuePerTick = minPxPerTick.x / pixelsPerXValue;

    return arrayFind(xDivisions, div => minXValuePerTick < div) ||
        xDivisions[xDivisions.length - 1];
}