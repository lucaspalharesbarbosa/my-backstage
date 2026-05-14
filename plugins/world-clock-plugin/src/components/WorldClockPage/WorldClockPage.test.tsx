import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { WorldClockPage, DISPLAY_CITIES } from './WorldClockPage';

describe('WorldClockPage', () => {
  it('renders title and all configured cities', async () => {
    await renderInTestApp(<WorldClockPage />);

    expect(screen.getByText('World clock')).toBeInTheDocument();
    expect(screen.getByText('Local times in three cities')).toBeInTheDocument();

    for (const city of DISPLAY_CITIES) {
      expect(screen.getByRole('heading', { name: city.label })).toBeInTheDocument();
      expect(screen.getByText(city.timeZone)).toBeInTheDocument();
    }
  });
});
