import { pullFrames, displayFrame } from "./utils";
import { detectFaces, isAFaceDetected, markFaces } from "./detectFaces";
import { adjustBrightness, getBrightness } from "./adjustBrightness";

/**
 * Monitors a webcam stream for the presence of a face and displays it.
 * 
 * @param onFaceDetected Callback function for when a face is detected.
 */
export function monitorFacePresence(
    onFaceDetected: () => void,
    onFaceNotDetected: () => void
) {
    // Indicates primary webcam.
    const CAPTURE_SOURCE = 0;

    // Use a 50ms debounce speed
    const PULL_DELAY = 50;

    pullFrames(CAPTURE_SOURCE, PULL_DELAY, async frame => {
        const rects = detectFaces(frame);
        
        if (isAFaceDetected(rects)) {
            markFaces(frame, rects);
            onFaceDetected();
        } else {
            onFaceNotDetected();
        }

        displayFrame(frame, 'Face Detection')
    });
}

/**
 * Entry point
 */
export async function main() {
    const startingBrightness = await getBrightness();
    let lastFrameNoFaceWasDetected = false;

    console.log('Started detection.');

    monitorFacePresence(
        () => {
            if (lastFrameNoFaceWasDetected) {
                console.log(`Adjusting to ${startingBrightness}%`);
                adjustBrightness(startingBrightness);
            }

            lastFrameNoFaceWasDetected = false;
        },
        () => {
            if (!lastFrameNoFaceWasDetected) {
                console.log('Adjusting to 10%');
                adjustBrightness(10);
            }

            lastFrameNoFaceWasDetected = true;
        }
    );
}

main();