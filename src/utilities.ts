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