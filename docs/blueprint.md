# NumberBot — Bot specification

**Archetype:** custom

**Voice:** playful and concise — write every user-facing message, button label, error, and empty state in this voice.

Generates random integers or decimals on demand via commands, buttons, and inline mode. Targets casual users needing quick numbers for games, decisions, or testing with presets and custom ranges.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- casual Telegram users
- gamers
- teachers
- small-group organizers

## Success criteria

- 99% accurate number generation within specified ranges
- Sub-1s response time for 95% of requests
- 1000+ daily active users in first 3 months

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with presets
- **/rand** (command, actor: user, command: /rand) — Open custom number request prompt
- **/random** (command, actor: user, command: /random) — Alias for /rand
- **🎲 1-6 Dice** (button, actor: user, callback: preset:1-6) — Generate dice roll
- **1-100** (button, actor: user, callback: preset:1-100) — Generate number between 1-100
- **0-1 Decimal** (button, actor: user, callback: preset:0-1) — Generate decimal between 0-1
- **@NumberBot 1-10 3** (button, actor: user) — Inline mode: generate 3 numbers between 1-10

## Flows

### preset_flow
_Trigger:_ button_click

1. Display selected preset range
2. Generate numbers based on preset
3. Show results with replay button

_Data touched:_ Request, Result

### custom_flow
_Trigger:_ /rand

1. Prompt for min/max values
2. Request count (1-20)
3. Choose integer/decimal type
4. Toggle uniqueness
5. Generate and display results

_Data touched:_ Request, Result

### inline_flow
_Trigger:_ inline_query

1. Parse range and count from query
2. Generate numbers
3. Return as inline result

_Data touched:_ Result

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **Request** _(retention: persistent)_ — User input parameters for number generation
  - fields: min, max, count, type, unique, preset_name
- **Result** _(retention: persistent)_ — Generated numbers and metadata
  - fields: numbers, timestamp, request_id
- **Preset** _(retention: session)_ — Named range configurations
  - fields: name, min, max, type, unique

## Integrations

- **Telegram** (required) — Bot API messaging and inline queries
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Add/edit presets
- View analytics dashboard
- Access abuse monitoring logs

## Notifications

- Critical error alerts to owner's Telegram account
- Daily usage spike notifications (>1000 requests/day)

## Permissions & privacy

- Store last 1000 requests per user for replay/analytics
- Collect basic usage stats (count, time, range)
- No personal data stored beyond Telegram user IDs

## Edge cases

- Invalid range inputs (max < min)
- Count exceeding 20 numbers
- Decimal precision beyond 3 places in custom flow
- Rate limiting for users generating >50 requests/hour

## Required tests

- Verify all preset buttons generate correct ranges
- Test uniqueness toggle prevents duplicates
- Validate inline mode handles edge cases like '10-1' ranges
- Confirm public replies in groups vs private DMs

## Assumptions

- Default decimal precision is 3 places
- Max count of 20 numbers per request
- Uniqueness toggle defaults to OFF
- Presets include 1-6, 1-100, 0-1 decimal, 1-10, 0-100%
