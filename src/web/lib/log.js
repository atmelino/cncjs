import { detect } from 'detect-browser';
import logger from 'universal-logger';
import { styleable } from 'universal-logger-browser';
//import { DEBUG } from 'universal-logger/lib/constants';

const browser = detect();
const colorized = browser && (['ie', 'edge'].indexOf(browser.name) < 0);
const log = logger()
    .use(styleable({
        colorized: colorized,
        showSource: true,
        showTimestamp: true
    }));

log.enableStackTrace();

//atmelino
//log.setLevel(DEBUG);

export default log;
