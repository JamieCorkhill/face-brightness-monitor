import * as cv from 'opencv4nodejs';

import { drawRect, Colors } from "./utils";

/**
 * Attempts to detect faces in a frame.
 * 
 * @param frame
 * The frame in which to attmpt to detect a face.
 */
export function detectFaces(frame: cv.Mat): cv.Rect[] {
    // Image Prymarid scale factor.
    const SCALE_FACTOR = 1.1;

    // Haarcascade neighbours method.
    const MINIMUM_NEIGHBORS = 10;

    const classifer = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
    const processedFrame = frame.bgrToGray();
    return classifer.detectMultiScale(processedFrame, SCALE_FACTOR, MINIMUM_NEIGHBORS).objects;
}

/**
 * Marks faces with a rect on a frame.
 * 
 * @param frame 
 * The matrix upon which to draw the rect.
 * 
 * @param rects 
 * The rect array to draw.
 * 
 * @param color 
 * A Vector 3 color.
 * 
 * @param thickness 
 * Line thickness for each rect.
 */
export function markFaces(
    frame: cv.Mat, 
    rects: cv.Rect[],
    color: cv.Vec3 = Colors.BLUE,
    thickness?: number
) {
    rects.forEach(rect => drawRect(
        frame,
        rect,
        color,
        thickness
    ));
}

/**
 * Detects whether there is a face in the capture source.
 * 
 * @param rects A list of found rects, if any
 */
export function isAFaceDetected(rects: cv.Rect[]) {
    return rects.length > 0;
}