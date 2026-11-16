---
description: >-
  One App speaks one language, a translated copy is another App, and every date a person reads follows the viewer's time zone.
---

# Languages and time zones

## One App, one language

An App speaks **one** language: its widgets, its texts and the App Player's own screens, such as the sign-in page and its notices. The browser's language never decides. There are no per-language settings and no switch at run time.

The language is part of the App's identity, set in its settings as a locale such as `de-DE`.

## An App in another language

An App in another language is **another App**: a copy derived from the first.

1. Take the list of every text people read in the reference App.
2. Translate that list, keeping the formatting and the placeholders.
3. Make the copy from the reference. It gets its own URL and counts as an App of its own.

Refresh the copy from the reference whenever the reference changes. **Never edit a copy by hand**: the next refresh would overwrite the change.

Text your logic produces, such as a message a modifier builds or a filled document, is code and is not in the list. It follows the App's language at run time, so one flow serves every copy.

Check the copy's pages afterwards: most languages run longer than English, and a label that fitted may not.

To let users move between the languages, put a button on a page that opens the other App's URL.

## Code is English

Whatever the App's language, the engineering surfaces stay English: table and column names, variable and endpoint names, instance names, executor comments and code. The user's language belongs to what people read as the product: widget labels and texts, page titles, the App's name and description, and the team's project notes.

## Time zones

The server does not sit where the user sits. An instant printed without a zone shows the wrong hour for somebody.

Three built-in values make this straightforward:

* `$LOCALE` is the App's language. It is the same in every scope, and a translated copy carries its own.
* `$TIMEZONE` is the time zone of that user's browser, such as `Europe/Berlin`.
* `$USER` is the user whose [scope](scopes.md) the run happens in.

`$TIMEZONE` and `$USER` are empty when no user is involved, such as at App start or in a poll. That is not a failure: there is no person there. Where such a path must print a time for people, either name a fallback zone, or take the user's zone once on a path a user starts and keep it in a [variable](variables-and-endpoints.md).

**Widgets need none of this.** A widget formats a date in the viewer's zone and the App's language by itself, as long as you hand it a [proper date](files-data-and-dates.md#dates) rather than ready-made text.

Where your logic writes text for people, format it with both: dates and numbers in the App's language, instants in the viewer's zone, words from a table keyed by the language. Documents filled from a template take the language and the zone as inputs.
