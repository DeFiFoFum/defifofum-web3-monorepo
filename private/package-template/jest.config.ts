import type { Config } from '@jest/types';
import jestConfig from '../../jest.config';

const config: Config.InitialOptions = {
    ...jestConfig,
}

export default config;
