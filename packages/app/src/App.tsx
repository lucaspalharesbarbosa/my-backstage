import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import worldClockPlugin from '@internal/backstage-plugin-world-clock-plugin';
import { navModule } from './modules/nav';

export default createApp({
  features: [catalogPlugin, navModule, worldClockPlugin],
});
