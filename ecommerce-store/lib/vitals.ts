import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed(): string {
     // Type assertion for navigator.connection
     const connection = (navigator as Navigator & {
          connection?: {
               effectiveType?: string;
          };
     }).connection;

     return connection && connection.effectiveType ? connection.effectiveType : '';
}

export function sendToAnalytics(metric: CLSMetric | FCPMetric | FIDMetric | LCPMetric | TTFBMetric) {
     // Ensure dsn is a string with a fallback
     const dsn = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID || '';

     const body = {
          dsn,
          id: metric.id,
          page: window.location.pathname,
          href: window.location.href,
          event_name: metric.name,
          value: metric.value.toString(),
          speed: getConnectionSpeed(),
     };

     const blob = new Blob([new URLSearchParams(body as Record<string, string>).toString()], {
          type: 'application/x-www-form-urlencoded',
     });

     if (navigator.sendBeacon) {
          navigator.sendBeacon(vitalsUrl, blob);
     } else {
          fetch(vitalsUrl, {
               body: blob,
               method: 'POST',
               credentials: 'omit',
               keepalive: true,
          });
     }
}