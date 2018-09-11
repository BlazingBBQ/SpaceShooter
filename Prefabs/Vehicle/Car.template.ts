import { masterPiece } from "../../src/Popova/Popova";

export function carMasterPiece(object: any, renderOffsetX: number, renderOffsetY: number): masterPiece {
    var highlightR: number = parseInt("0x" + object.carColor.substring(1, 3), 16) + 0x33;
    var highlightG: number = parseInt("0x" + object.carColor.substring(3, 5), 16) + 0x33;
    var highlightB: number = parseInt("0x" + object.carColor.substring(5, 7), 16) + 0x33;
    return {
        palette: ["#333333"]
            .concat(object.carColor)
            .concat("#" +
                (highlightR > 0xFF ? 0xFF : highlightR).toString(16) +
                (highlightG > 0xFF ? 0xFF : highlightG).toString(16) +
                (highlightB > 0xFF ? 0xFF : highlightB).toString(16)
            ),
        posX: object.x - renderOffsetX,
        posY: object.y - renderOffsetY,
        width: object.width,
        height: object.height,
        facing: object.facing,
        strokes: [{
            cellX: 0,
            cellY: 1,
            width: object.width,
            height: 5,
            swatch: 1
        }, {
            cellX: 1,
            cellY: 0,
            width: object.width - 2,
            height: 5,
            swatch: 1
        }, {
            cellX: 1,
            cellY: 4,
            width: object.width - 2,
            height: 6,
            swatch: 1
        }, {
            cellX: 0,
            cellY: 9,
            width: object.width,
            height: 6,
            swatch: 1
        }, {
            cellX: 1,
            cellY: 9,
            width: object.width - 2,
            height: 7,
            swatch: 1
        }, {
            cellX: 1,
            cellY: 3,
            width: object.width - 2,
            height: 2,
            swatch: 0
        }, {
            cellX: 2,
            cellY: 2,
            width: object.width - 4,
            height: 3,
            swatch: 0
        }, {
            cellX: 1,
            cellY: 10,
            width: object.width - 2,
            height: 3,
            swatch: 0
        }, {
            cellX: 2,
            cellY: 10,
            width: object.width - 4,
            height: 4,
            swatch: 0
        }, {
            cellX: 3,
            cellY: 6,
            width: object.width - 6,
            height: 3,
            swatch: 2
        }, {
            cellX: -1,
            cellY: 6,
            width: 1,
            height: 1,
            swatch: 1
        }, {
            cellX: object.width,
            cellY: 6,
            width: 1,
            height: 1,
            swatch: 1
        },]
    };
}
