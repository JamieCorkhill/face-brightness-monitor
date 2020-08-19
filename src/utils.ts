import * as cv from 'opencv4nodejs';

/**
 * Enumeration of available color options
 */
export const Colors = Object.freeze({
    BLUE: new cv.Vec3(255, 0, 0),
    GREEN: new cv.Vec3(0, 255, 0),
    RED: new cv.Vec3(0, 0, 255)
});

/**
 * Creates a custom color.
 * 
 * @param r Red RGB Value
 * @param g Green RGB Value
 * @param b Blue RGB Value
 */
export const makeColor = (r: number, g: number, b: number) => {
    const isInbounds = (val: number, upper: number, lower: number) => val <= upper && val >= lower;
    const isInColorSpace = (val: number) => isInbounds(val, 0, 255);

    [r, g, b].forEach(colorValue => {
        if (!isInColorSpace(colorValue)) {
            throw new Error(`Error: Value ${colorValue} is not within RGB color space bounds.`)
        }
    });

    // This order is correct. OpenCV uses BGR not RGB.
    return new cv.Vec3(b, g, r);
}

/**
 * Pulls individual frames from a capture source.
 * 
 * @param src 
 * The video capture source.
 * 
 * @param pullDelay 
 * The delay between subsequent pulling of frames.
 * 
 * @param onFrameRecieved 
 * A callback invoked for each new frame.
 */
export function pullFrames(
    src: string | number,
    pullDelay: number,
    onFrameRecieved: (frame: cv.Mat) => void,
): void {
    // Capture a stream from the specified src.
    const capture = new cv.VideoCapture(src as string);
    
    // Pull a new frame on an interval.
    const interval = setInterval(() => {
        // An individual frame from the capture source.
        let frame = capture.read();

        // Callback invocation for frame RX.
        onFrameRecieved(frame);

        // Watching for interrupt signal.
        watchToTerminate(interval);
    }, pullDelay);
}

/**
 * Draws a rect for an ROI on a Matrix.
 * 
 * @param targetImage 
 * The target matrix.
 * 
 * @param rect 
 * The rect to draw.
 * 
 * @param color 
 * The color to use.
 * 
 * @param thickness 
 * The ROI line thickness to use.
 */
export function drawRect(
    targetImage: cv.Mat,
    rect: cv.Rect,
    color: cv.Vec3,
    thickness: number = 2
) {
    return targetImage.drawRectangle(
        rect,
        color, thickness,
        cv.LINE_8
    );
}

/**
 * Watches for an appropriate key press that signals a SIGTERM.
 * @param intervalID The interval ID to terminate.
 */
export function watchToTerminate(intervalID: NodeJS.Timeout) {
    const key = cv.waitKey(1);

    if (key !== -1 && key !== 255) {
        clearInterval(intervalID);
        console.log('Detected key press, now exiting.')
    }
}

/**
 * Displays a frame in a window of the specified name.
 * 
 * @param frame 
 * The frame matrix to display.
 * 
 * @param name 
 * Window name
 */
export function displayFrame(frame: cv.Mat, name: string) {
    cv.imshow(name, frame);
}