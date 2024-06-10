# Session System Spec

- Goals:

  - create a session system that can be managed via a single events table as opposed to a specialied session table. The reason for this is to avoid the complication of cross-query and keeping things in sync.
  - Minimize the amount of unnecessary stored data as it could become a bottleneck as big data volumes
  - Track information about page-by-page behavior, such as the time on that page, the number of clicks, etc.
  - Allow for accurate real-time analytics by saving event data as it occurs, with a summary event at the end

- Only 3 types of events are needed for sessions and view-based analytics:
  - `view`: associated with what happens on a single interface
  - `init`: event created when a new session starts, includes all available info about client
  - `session`: a summary event created at the end of session, includes compiled info like exit page, total views, etc. Most compliled information is attainable via aggregation so stored info should be focused on what is difficult to attain using that method.
- Two phantom events are needed to help with creating rich stored `view` events that include useful insights about what happens on specific pages:

  - `stat` - These are timed update events to let the server know what happens on a page occassionally. These are not stored in the database.
  - `exit` - Any page exit events can be tracked and used to create `view` with info like how they exited and so on.

- On first event with name of `view` or `stat` we start a redis session in memory as well is a page entry from compiling all stat info until either the next `view` or the expiration of the session.
- The `init` event is saved immediately to be used for real-time analytics
- `view` events are created and added to redis, this expires the previous redis `view` event which can be compliled to final and stored in the db.
