import {h, Component} from 'preact';
import * as fetch from 'isomorphic-fetch';
import {arrayFind, timeToString} from '../utilities';
import StationData from '../services/stationData';
import './windPlot.css';

interface WindPlotProps {
    canvasWidth: number,
    canvasHeight: number,
    startTime: number,
    endTime: number,
    data: StationData[],
    onClick?: () => void
}
interface Scale {
    yValueToY: (y:number) => number;
    xValueToX: (x:number) => number;
}
const minMaxWind = 8;
const fontSize = 14;
const tickSize = 7;
const tickMargin = 5;

export default class WindPlot extends Component<WindPlotProps,{}> {
    private _canvasElement:HTMLCanvasElement;

    componentDidMount() {
        this.updateAndPaint();
    }

    async updateAndPaint() {
        const context = this._canvasElement.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        const dataToDraw = this.props.data.filter(d => d.timestamp >= this.props.startTime && d.timestamp <= this.props.endTime);
        const maxWind = Math.ceil(dataToDraw.reduce((max, d) => Math.max(max, d.wind || 0, d.gust || 0), minMaxWind));

        const scale = drawAxis(context, maxWind, this.props);

        context.strokeStyle = '#4151E1';
        drawPlotPath(context, dataToDraw, 'wind', scale);

        context.strokeStyle = '#E14141';
        drawPlotPath(context, dataToDraw, 'gust', scale);

        context.strokeStyle = '#33B033';
        drawPolarPath(context, dataToDraw, 'direction', scale.xValueToX, scale.yValueToY(maxWind));
    }

    render(props:WindPlotProps) {
        if(this._canvasElement) {
            this.updateAndPaint();
        }
        return <canvas
            className='windplot'
            width={props.canvasWidth}
            height={props.canvasHeight}
            ref={(r:HTMLCanvasElement) => this._canvasElement = r}
            onClick={props.onClick} />
    }
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

    const timezoneOffset = (new Date()).getTimezoneOffset() * 60;
    const xValueStart =
        Math.floor(
            (props.startTime - timezoneOffset)
            / (60*60*24)
        ) * (60*60*24) + timezoneOffset;

    context.strokeStyle = 'black';
    context.beginPath();
    context.font = `${fontSize}px Arial`;

    // Axis
    context.save();
    context.translate(yAxisMargin, height-xAxisMargin);
    const yValueToTransY = drawYAxis(context, numberWidth, numberHeight, ySpace, maxY, xAxisMargin - marginBottom);
    const {xValueToTransX, xTicks} = drawXAxis(context, numberWidth, numberHeight, xSpace, yAxisMargin - marginLeft, xValueStart, props.startTime, props.endTime);
    context.restore();
    context.stroke();

    const yValueToY = (yValue:number) => yValueToTransY(yValue) + (height-xAxisMargin);
    const xValueToX = (xValue:number) => xValueToTransX(xValue) + yAxisMargin;
    
    context.strokeStyle = 'gray';
    context.font = `${fontSize*3/4}px Arial`;
    xTicks.forEach(x => {
        if(x < 4*numberWidth) return;
        context.save();
        context.translate(yAxisMargin + x, height-xAxisMargin);
        drawYAxis(context, numberWidth*3/4, numberHeight*3/4, ySpace, maxY, xAxisMargin - marginBottom);
        context.restore();
    });
    context.stroke();

    return {
        yValueToY,
        xValueToX
    };
}
function drawYAxis(
    context:CanvasRenderingContext2D,
    numberWidth:number,
    numberHeight:number,
    axisSize:number,
    maxYValue:number,
    overflow:number
) {
    const minPxPerTick = 40;
    const pixelsPerYValue = axisSize / maxYValue;
    const minYValuePerTick = minPxPerTick / pixelsPerYValue; // Asuming ticks are minimum distance, what's the distance between two ticks in y-value?
    const yStep = Math.ceil(minYValuePerTick / 2) * 2; // Qualsevol nombre parell
    const yValueToY = (yValue:number) => -axisSize * yValue / maxYValue;

    // Axis
    context.moveTo(0, -axisSize);
    context.lineTo(0, overflow);

    // Y-ticks
    for(let yValue=yStep; yValue<=maxYValue; yValue+=yStep) {
        const y = yValueToY(yValue);
        context.moveTo(tickSize/2, y);
        context.lineTo(-tickSize/2, y);
        const value = `${yValue}`;
        context.strokeText(value, -(numberWidth*value.length+tickSize), y+numberHeight/2);
    }
    return yValueToY;
}
function drawXAxis(
    context:CanvasRenderingContext2D,
    numberWidth:number,
    numberHeight:number,
    axisSize:number,
    overflow:number,
    startValue:number,
    startVisibleValue:number,
    endValue:number
) {
    const minPxPerTick = 65;
    const xDivisions = [60*4,60*6,60*8,60*12,60*24]
        .map(minutes => minutes*60);
    const pixelsPerXValue = axisSize / (endValue - startVisibleValue);
    const minXValuePerTick = minPxPerTick / pixelsPerXValue;
    const xStep = arrayFind(xDivisions, div => minXValuePerTick < div) ||
        xDivisions[xDivisions.length - 1];
    const xValueToX = (xValue:number) => axisSize * (xValue - startVisibleValue) / (endValue - startVisibleValue);

    context.moveTo(-overflow, 0);
    context.lineTo(axisSize, 0);

    // X-ticks
    let ticks = [];
    for(let xValue=startValue; xValue<=endValue; xValue += xStep) {
        const x = xValueToX(xValue);
        if(x < 0) continue;
        ticks.push(x);
        context.moveTo(x, -tickSize/2);
        context.lineTo(x, tickSize/2);
        context.strokeText(timeToString(new Date(xValue*1000)), x-numberWidth*2, tickSize + numberHeight);
    }

    return {
        xValueToTransX: xValueToX,
        xTicks: ticks
    };
}

function suavise(data:StationData[], iData:number, property:string, preserveMax:boolean) {
    const suavisationFactor = 2;
    const startTS = data[iData].timestamp-suavisationFactor*5*60;
    const endTS = data[iData].timestamp+suavisationFactor*5*60;
    let start, end;
    for(start=iData; start >= 0; start--) {
        if(data[start].timestamp <= startTS) {
            start = Math.min(start, iData);
            break;
        }
    }
    for(end=iData; end < data.length; end++) {
        if(data[end].timestamp >= endTS) {
            end = Math.max(end, iData);
            break;
        }
    }
    const dataGroup = data.slice(start, end+1)
        .map(d => d[property]);

    const iMax = dataGroup
        .reduce((t, v, i) => ({
            iMax: v > t.max ? i : t.iMax,
            max: Math.max(t.max, v)
        }), {iMax:null, max:0})
        .iMax;
    if(preserveMax && iMax === iData-start) {
        return data[iData][property];
    }
    const result = dataGroup
        .reduce((t, v, i) => {
            const factor = (preserveMax && i === iMax) ? (dataGroup.length/2) / Math.abs(iMax-(iData-start)) : 1;
            return {
                n: t.n + factor,
                v: t.v + v*factor
            }
        }, {n:0, v:0});
    return result.v / result.n;
}
function drawPlotPath(context:CanvasRenderingContext2D, data:StationData[], property:string, scale:Scale) {
    data = data.filter(d => d[property] != undefined);
    if(data.length < 2) return;
    
    const connectDistance = 2.5 * (scale.xValueToX(data[1].timestamp) - scale.xValueToX(data[0].timestamp));
    
    context.beginPath();
    let prevX = scale.xValueToX(data[0].timestamp);
    context.moveTo(prevX, scale.yValueToY(data[0][property]));
    for(let i=1; i<data.length; i++) {
        const x = scale.xValueToX(data[i].timestamp);

        const preserveMax = property === 'gust' ? true : false;
        const suavised = suavise(data, i, property, preserveMax);
        const y = scale.yValueToY(suavised);
        if(x-prevX > connectDistance) {
            context.moveTo(x, y);
        }else {
            context.lineTo(x, y);
        }
        prevX = x;
    }
    context.stroke();
}

function drawPolarPath(context:CanvasRenderingContext2D, data:StationData[], property:string, scaleX:(x:number) => number, yCoord) {
    const arrowSize = 3;
    const arrowLength = 5*arrowSize;

    const drawArrowPath = () => {
        context.moveTo(0, 0);
        context.lineTo(0, 3*arrowSize);
        context.lineTo(-arrowSize, 3*arrowSize);
        context.lineTo(0, arrowLength);
        context.lineTo(arrowSize, 3*arrowSize);
        context.lineTo(0, 3*arrowSize);
    }

    const valuesToDraw = data.reduce((vtd, d) => {
        if(typeof d[property] == null) return vtd;

        const currentValue = {
            x: scaleX(d.timestamp),
            v: Math.PI * d[property] / 180
        };
        if(vtd.length == 0) return [currentValue];

        const previousX = vtd[vtd.length-1].x;
        if(previousX + 3*arrowLength/4 < currentValue.x) {
            return [...vtd, currentValue];
        }

        return vtd;
    }, []);
    
    context.beginPath();
    valuesToDraw.forEach(vtd => {
        context.save();
            context.translate(vtd.x, yCoord);
            context.rotate(vtd.v);
            drawArrowPath();
        context.restore();
    });
    context.stroke();
}