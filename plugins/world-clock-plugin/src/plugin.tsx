import { jsx } from 'react/jsx-runtime';
import ScheduleIcon from '@material-ui/icons/Schedule';
import {
  createFrontendPlugin,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';

import { rootRouteRef } from './routes';

export const page = PageBlueprint.make({
  params: {
    path: '/world-clock-plugin',
    routeRef: rootRouteRef,
    loader: () =>
      import('./components/WorldClockPage').then(m => <m.WorldClockPage />),
  },
});

export const worldClockPlugin = createFrontendPlugin({
  pluginId: 'world-clock-plugin',
  /** Shown in the sidebar and page chrome (nav is auto-built from page extensions). */
  title: 'World clock',
  icon: jsx(ScheduleIcon, { fontSize: 'inherit' }),
  extensions: [page],
  routes: {
    root: rootRouteRef,
  },
});
