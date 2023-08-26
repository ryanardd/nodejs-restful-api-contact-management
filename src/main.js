import { logger } from "../src/application/logging";
import { web } from "../src/application/web";

web.listen(300, () => {
    logger.info('App Start')
});