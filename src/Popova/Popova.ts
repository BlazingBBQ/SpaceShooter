export interface masterPiece {
    palette: string[],
    posX: number,
    posY: number,
    width: number,
    height: number,
    facing: number,
    strokes: (stroke|svgStroke)[],
    customRenderSize?: number,
    shadowHeight?: number,
}

export interface stroke {
    cellX: number,
    cellY: number,
    width: number,
    height: number,
    swatch: number,
    type?: StrokeTypes,
}

export interface svgStroke {
    type: StrokeTypes,
    path: string,
    params: object,
}

export enum StrokeTypes {
    RECT = "stroke-rect",
    CIRC = "stroke-circ",
    SVG = "stroke-svg",
}

export interface mousePosition {
    x: number,
    y: number,
    outOfBounds: boolean,
}

export class Popova {

    private canvas: any;
    private rcanvas: any;
    private ctx: any;
    private width: number;
    private height: number;
    private cubeSize: number = 12;
    private shadowColor: string = "#77777799";
    private shadowHeight: number;

    constructor() { }

    /**
     * Initializes Popova's canvas
     * @param canvasId Id of html canvas element
     * @param cubeSize Render size for each cube when drawing with cubes
     */
    init(canvasId: string, shadowHeight: number) {
        this.canvas = <any> document.getElementById(canvasId);
        // @ts-ignore   --   Ignores "Cannot find name 'rough'"
        this.rcanvas = <any> rough.canvas(this.canvas);
        this.width = this.canvas.offsetWidth - 4;
        this.height = this.canvas.offsetHeight - 4;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext("2d");
        this.shadowHeight = shadowHeight;
    }

    /**
     * Renders a grid on the canvas
     * @param spacing Number of pixels between grid lines
    */
    drawGrid(spacing: number, offsetX?: number, offsetY?: number) {
        this.ctx.beginPath();
        this.ctx.save();
        // Draw grid on background
        this.ctx.strokeStyle = "#f0e7db";
        for (var x = (!!offsetX) ? offsetX % spacing : 0; x <= this.width; x += spacing) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (var y = (!!offsetY) ? offsetY % spacing : 0; y <= this.height; y += spacing) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    /**
     * Draws a masterpiece to the canvas
     * @param masterPiece Definition for what to draw
     */
    draw(masterPiece: masterPiece) {
        if (this.shadowHeight > 0) {        // Render shadows  && (masterPiece.shadowHeight) ? masterPiece.shadowHeight > 0 : true
            this.ctx.save();

            this.prepCanvas(
                masterPiece.posX + ((masterPiece.shadowHeight) ? masterPiece.shadowHeight : this.shadowHeight),
                masterPiece.posY + ((masterPiece.shadowHeight) ? masterPiece.shadowHeight : this.shadowHeight),
                masterPiece.width,
                masterPiece.height,
                masterPiece.facing);
            masterPiece.strokes.forEach((stroke: any) => {
                this.renderShadow(stroke, this.shadowColor, masterPiece.customRenderSize);
            });

            this.ctx.restore();
        }

        this.ctx.save();

        this.prepCanvas(
            masterPiece.posX,
            masterPiece.posY,
            masterPiece.width,
            masterPiece.height,
            masterPiece.facing);
        masterPiece.strokes.forEach((stroke: any) => {
            this.renderStroke(stroke, masterPiece.palette, masterPiece.customRenderSize);
        });

        this.ctx.restore();
    }

    /**
     * Centers the canvas on position, and rotates to a certain facing
     * @param positionX The x position of what is being drawn
     * @param positionY The y position of what is being drawn
     * @param width The width of what is being drawn
     * @param height The height of what is being drawn
     * @param degrees Degrees to rotate the canvas by
     * @param customRenderSize Render the master piece with custom cube sizing
     */
    prepCanvas(positionX: number, positionY: number, width: number, height: number, degrees: number, customRenderSize?: number){
        const renderSize = customRenderSize ? customRenderSize : this.cubeSize;

        this.ctx.beginPath();
        this.ctx.translate(positionX, positionY);
        this.ctx.rotate(degrees * Math.PI / 180);
        this.ctx.translate(- width * renderSize / 2, - height * renderSize / 2);
    }

    /**
     * Renders masterpiece's strokes
     * @param stroke Stroke to render
     * @param palette Contains the master piece's color swatches
     * @param customRenderSize Render the master piece with custom cube sizing
     */
    renderStroke(stroke: any, palette: string[], customRenderSize?: number){
        if (stroke.type && stroke.type === StrokeTypes.CIRC) {
            this.ctx.fillStyle = palette[stroke.swatch];
            this.ctx.arc(
                stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize),
                Math.min(stroke.width, stroke.height) * (customRenderSize ? customRenderSize : this.cubeSize),
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        } else if (stroke.type && stroke.type === StrokeTypes.SVG) {
            this.rcanvas.path(stroke.path, stroke.params);
        } else {
            this.ctx.fillStyle = palette[stroke.swatch];
            this.ctx.fillRect(
                stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.width * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.height * (customRenderSize ? customRenderSize : this.cubeSize)
            );
        }
    }

    /**
     * Renders masterpiece shadow
     * @param stroke Stroke to render
     * @param shadowColor Shadow fill color
     * @param customRenderSize Render the master piece with custom cube sizing
     */
    renderShadow(stroke: any, shadowColor: string, customRenderSize?: number){
        if (stroke.type && stroke.type === StrokeTypes.CIRC) {
            this.ctx.fillStyle = shadowColor;
            this.ctx.arc(
                stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize),
                Math.min(stroke.width, stroke.height) * (customRenderSize ? customRenderSize : this.cubeSize),
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        } else if (stroke.type && stroke.type === StrokeTypes.SVG) {
            this.rcanvas.path(stroke.path, { fill: shadowColor, fillStyle: "solid", strokeWidth: 0.01 } );
        } else {
            this.ctx.fillStyle = shadowColor;
            this.ctx.fillRect(
                stroke.cellX * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.cellY * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.width * (customRenderSize ? customRenderSize : this.cubeSize),
                stroke.height * (customRenderSize ? customRenderSize : this.cubeSize)
            );
        }
    }

    /**
     * Erases everything on the canvas
     */
    wipeCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Returns the canvas' width and height
     */
    size(): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }

    /**
     * Returns Popova's cube render size
     */
    getCubeSize(): number {
        return this.cubeSize;
    }

    /**
     * Sets Popova's cube render size
     * @param size Value for cube render size
     */
    setCubeSize(size: number) {
        this.cubeSize = size;
    }

    /**
     * Returns mouse position and if mouse is inside canvas
     * @param evt Mouse movement event, containing position information
     */
    getMousePos(evt: any): mousePosition {
        var rect = this.canvas.getBoundingClientRect();
        var posX = evt.clientX - rect.left;
        var posY = evt.clientY - rect.top;
        var offCanvas = false;

        if (posX < 0) {
            posX = 0;
            offCanvas = true;
        }
        if (posY < 0) {
            posY = 0;
            offCanvas = true;
        }
        if (posX > this.width) {
            posX = this.width;
            offCanvas = true;
        }
        if (posY > this.height) {
            posY = this.height;
            offCanvas = true;
        }

        return {
          x: posX,
          y: posY,
          outOfBounds: offCanvas,
        };
    }

    /**
     * Draw text to the canvas
     * @param text The text to draw
     * @param posX The horizontal position to draw the text
     * @param posY The vertical position to draw the text
     * @param size The font size of the text
     * @param color The color to draw the text
     * @param facing The angle to render the text
     */
    drawText(text: string, posX: number, posY: number, size?: number, color?: string, facing?: number) {
        this.ctx.save();

        const actualSize = size ? size : 16;
        this.ctx.font = String(actualSize) + "px Arial";
        this.prepCanvas(posX, posY, this.ctx.measureText(text).width, 0, facing, 1);
        this.ctx.fillStyle = color ? color : "black";
        this.ctx.fillText(text, 0, 0);

        this.ctx.restore();
    }

}
