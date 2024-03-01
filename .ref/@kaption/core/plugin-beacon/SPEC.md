## Module: KaptionEventOps

This module will add additional functionality for operations related to tracked events. For example, notifications and usage tracking

## Notifications

- all events should be batched, grouped by project and parsed for custom events or others that have associated notifications
- notifications should be added to a table in clickhouse and possible postgres to add a baseline in later use.
- pull project using cache once per batch, this minimizes performance issues

## Usage

- usage must be used to establish limits for operations like replays, emails, daily sessions,
- if 24 hour usage is exceeded, a check usage function will return false and disable additional tracking
- should be extendible (via hook?) and allow for other modules to set limits and callbacks whenever a specific event name is encountered

### throttling

- usage should have a throttling functionality that prevents something happening more than X times in a specific time frame.

## Limit

- add a limit function that calls a hook to determine what happens when a limit is reached within a specific timeframe. Potentially this could use same functionality as throttle

- track daily based on settings timezone

## cases

- no more than 1 replay recording in a 20 minute time frame.
- limit recordings to a total amount per day depending on organization plan
- limit email notifications to a specific amount per day depending on organization plan
- track usage of items (i.e. replays, sessions, emails, etc) and report to stripe on an hourly basis
