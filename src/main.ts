import { pullFrames, displayFrame } from "./utils";
import { detectFaces, isAFaceDetected, markFaces } from "./detectFaces";

monitorFacePresence(() => console.log('Detected'));

/**
 * Monitors a webcam stream for the presence of a face and displays it.
 * 
 * @param onFaceDetected Callback function for when a face is detected.
 */
export function monitorFacePresence(onFaceDetected: () => void) {
    // Indicates primary webcam.
    const CAPTURE_SOURCE = 0;

    // Use fastest speed.
    const PULL_DELAY = 0;

    pullFrames(CAPTURE_SOURCE, PULL_DELAY, frame => {
        const rects = detectFaces(frame);
        
        if (isAFaceDetected(rects)) {
            markFaces(frame, rects);
            onFaceDetected();
        }

        displayFrame(frame, 'Face Detection')
    });
}