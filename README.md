# Simple Serverless iCal Filter Proxy

Currently designed to run on CloudFlare Workers.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Markcanfly/ical-filter)

## Usage

Deploy to CloudFlare Workers.

```bash
npx wrangler deploy
```

> Example: Filter for events with titles excluding specific strings
>
> ```bash
> curl https://${WORKER_URL}/?cal=${SOURCE_ICAL_FILE_URL}&titleDoesNotContain=birthday,Birthday
> ```

This URL can be provided to a calendar software supporting RFC 5545 calendar filer as a subscription.

## Development

See the [CloudFlare Workers guide](https://developers.cloudflare.com/workers/get-started/guide/)
to get started with development.
