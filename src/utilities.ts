export function arrayFind<T>(array:T[], predicate:(element:T, position:number, array:T[]) => boolean, thisArg?:any):T {
    if((<any>array).find) {
        return (<any>array).find(predicate, thisArg);
    }
    if (array === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
    }
    var list = Object(array);
    var length = list.length >>> 0;
    var value;

    for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
            return value;
        }
    }
    return undefined;
}
export function arrayMergeSortUniq<T>(arrays:T[][], property:(element:T) => any):T[] {
    return arrays
        .reduce((res, arr) => res.concat(arr), [])
        .sort((a, b) => property(a) < property(b) ? -1 : 1)
        .reduce((res, v) => !res.length || property(res[res.length-1]) !== property(v) ? res.concat([v]) : res, []);
}
export function timeToString(date:Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes;
}
export function dateToString(date:Date) {
    const day = date.getDate();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    return (day < 10 ? '0' : '') + day + "/" +
        (month < 10 ? '0' : '') + month + "/" +
        year;
}

// This is made so starting at size `baseResolution`, every time we double the screen size
// we double the area of the canvas. For smaller screens than `baseResolution`
// the size decrease will be linear, because we don't want to underscale (weird antialising then)
export function calculateCanvasSize(
    aspectRatio,
    windowSize,
    baseResolution
) {
    const canvasWidth = windowSize < baseResolution ? windowSize :
        Math.sqrt(baseResolution * windowSize);
    const canvasHeight = canvasWidth / aspectRatio;
    return {
        width: canvasWidth,
        height: canvasHeight
    };
}