import * as cp from 'child_process';

/**
 * Adjusts screen brightness to the desired value.
 * 
 * @param newBrightness The new brightness to set for the screen.
 */
export function adjustBrightness(newBrightness: number): Promise<void> {
    return new Promise((resolve, reject) => {
        if (newBrightness < 0 || newBrightness > 100) {
            throw new Error(`Brightness out of bounds. Stay within [0, 100]`)
        }
    
        const makeCommand = (brightness: number) => 
            `(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,${brightness})`;
    
        cp.exec(makeCommand(newBrightness), { shell: 'powershell.exe' }, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            return resolve();
        });
    })
}

/**
 * Gets the current screen brightness.
 */
export function getBrightness(): Promise<number> {
    return new Promise((resolve, reject) => {
        const command = `Get-Ciminstance -Namespace root/WMI -ClassName WmiMonitorBrightness`;

        cp.exec(command, { shell: 'powershell.exe' }, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            const brightness = stdout.split('CurrentBrightness : ')[1].slice(0, 2);
            return resolve(parseInt(brightness));
        })
    })
}