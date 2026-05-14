import { useEffect, useState } from 'react';
import PlaceOutlined from '@material-ui/icons/PlaceOutlined';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Flex,
  FullPage,
  Header,
  Text,
} from '@backstage/ui';

export type CityClockConfig = {
  /** Display name in English */
  label: string;
  /** IANA time zone identifier */
  timeZone: string;
};

/** Three office-friendly zones; adjust as needed */
export const DISPLAY_CITIES: CityClockConfig[] = [
  { label: 'New York', timeZone: 'America/New_York' },
  { label: 'London', timeZone: 'Europe/London' },
  { label: 'Tokyo', timeZone: 'Asia/Tokyo' },
];

function formatTime(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(now);
}

function formatDate(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

function formatUtc(now: Date) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);
}

function CityClockCard({
  city,
  now,
}: {
  city: CityClockConfig;
  now: Date;
}) {
  const headingId = `world-clock-heading-${city.timeZone.replace(/\//g, '-')}`;

  return (
    <Card aria-labelledby={headingId}>
      <CardHeader>
        <Flex align="center" gap="3">
          <PlaceOutlined
            aria-hidden
            style={{ fontSize: '1.35rem', opacity: 0.72, flexShrink: 0 }}
          />
          <Text
            id={headingId}
            as="h3"
            variant="title-medium"
            weight="bold"
            style={{ margin: 0 }}
          >
            {city.label}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" gap="4" align="start">
          <Text
            as="p"
            variant="title-large"
            weight="bold"
            style={{
              margin: 0,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            {formatTime(now, city.timeZone)}
          </Text>
          <Text
            as="p"
            variant="body-medium"
            color="secondary"
            style={{ margin: 0, lineHeight: 1.45 }}
          >
            {formatDate(now, city.timeZone)}
          </Text>
        </Flex>
      </CardBody>
      <CardFooter>
        <Text
          as="p"
          variant="body-x-small"
          color="secondary"
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            wordBreak: 'break-all',
          }}
        >
          {city.timeZone}
        </Text>
      </CardFooter>
    </Card>
  );
}

export const WorldClockPage = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <Header title="World clock" />
      <FullPage>
        <Container style={{ maxWidth: 1120 }}>
          <Flex direction="column" gap="6" py="8">
            <Flex direction="column" gap="3">
              <Text as="p" variant="title-small" color="secondary" style={{ margin: 0 }}>
                Local times in three cities
              </Text>
              <Text
                as="p"
                variant="body-medium"
                color="secondary"
                style={{ margin: 0, maxWidth: '40rem', lineHeight: 1.5 }}
              >
                {
                  "Live clocks use your browser's IANA time zone database (including daylight saving rules). Times refresh every second."
                }
              </Text>
            </Flex>

            <Box
              style={{
                display: 'grid',
                gap: '1.25rem',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              }}
            >
              {DISPLAY_CITIES.map(city => (
                <CityClockCard key={city.timeZone} city={city} now={now} />
              ))}
            </Box>

            <Flex
              justify="center"
              pt="6"
              mt="2"
              style={{
                borderTop: '1px solid color-mix(in srgb, var(--bui-fg-primary) 12%, transparent)',
              }}
            >
              <Text as="p" variant="body-small" color="secondary" style={{ margin: 0 }}>
                UTC reference: {formatUtc(now)}
              </Text>
            </Flex>
          </Flex>
        </Container>
      </FullPage>
    </>
  );
};
