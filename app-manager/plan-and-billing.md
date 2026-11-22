---
description: >-
  What the account may use: the plan and its quotas, the credits the assistant
  spends, and how the plan's Apps divide among the workspaces.
---

# Plan & Billing

**Plan & Billing** holds what the account may use and what that costs. It belongs to the account, not to a workspace, so only owners of the account see the entry; the auth service refuses everyone else.

What the screen offers depends on where Heisenware runs: in the Heisenware cloud it manages a subscription. On your own server, and on a dedicated server Heisenware runs for you, the plan comes from a licence file and nothing is billed in the App Manager, so the menu entry and the screen are called **Plan & License**. Both show the workspaces, and where the installation runs the assistant, what it used.

Prices are not in these pages. They are on [heisenware.com](https://heisenware.com), and the screen itself quotes what your plan costs before you change anything.

## In the cloud

### Subscription

One card with the plan and everything that follows from it:

* **Your plan**: its name, when it started and how long it is valid. **Upgrade plan** opens the plans side by side and takes you through Stripe's checkout.
* **Number of apps**: how many Apps of your plan are in use, over the whole account. **Add 1 app** buys one more slot; the dialog shows what it costs now, prorated to the rest of the billing period. Where you bought slots beyond the plan's own and one is free, the same row offers to give one back.
* **Number of workspaces**: the same for [workspaces](workspaces.md), while a subscription is running.
* **Credits a month**: how much of this month's [credits](#ai-usage-and-credits) the assistant and Ask have used, and the day they renew. **Change credits** books another amount a month, from 10 to 500; the dialog shows what it costs. More is charged at once for the rest of the billing period, and the extra credits arrive with the payment. Fewer costs nothing now and applies from the next month.
* **Active subscription**: the facts at a glance: status, billing interval, start and end date, whether it renews, the next invoice amount, and the cancellation date if there is one.
* **Billing**: when the plan renews, and **Stripe customer portal** for invoices, receipts and the card on file.
* **Payment method**: card or manual invoice. On a manual invoice you cannot change the plan, its Apps or its credits yourself; write to us instead.

**Cancel your subscription** sits at the foot of the page. A cancelled plan runs to the end of the period it was paid for, then stops; until it ends, **Reactivate** takes the cancellation back.

### What the quotas do

* **Apps** count over the whole account. An App beyond the quota cannot be opened by anyone: the platform refuses to register it, and the [Apps](apps.md) screen refuses to create another. A banner across the top of the Manager says so, as information rather than a warning: *All apps of your plan are in use* where the plan's number is reached, *All apps of this workspace are in use* where the workspace holds all the Apps reserved for it. It tells an owner of the account the plan, its number and where to add Apps, and every other member that an owner can change it.
* **Workspaces** count the same way. A full plan turns **Add workspace** in the workspace switcher into **Ask for more**.
* **An expired plan** stops the Apps screen altogether, and the banner names the plan and the dates it ran. No App starts until it is renewed: a start is refused with *The plan '<name>' has expired: no app starts until it is renewed*. A failed payment keeps the plan running while Stripe tries again, with a banner for the account's owners.

## On your own server

A self-hosted installation runs on a licence file instead of a subscription, and so does a dedicated server Heisenware runs for you. The screen is **Plan & License**, and its **License** card holds:

* **Hosting**: who hosts the installation, you or Heisenware. Without a licence it runs on **Free**, and the row says what Free holds in the plan's own numbers, one App in one workspace, that the App shows a small *powered by Heisenware* mark, and that a licence file unlocks more Apps and removes the mark. With a licence it says what the file carries: the plan, the number of Apps and how long it runs.
* **License Information** shows the licence: whom it is licensed to, the plan, its term and its start and end date, the Apps it includes and the Apps used.
* **Upload license file** takes the `.jwt` file we send you. A file not signed by Heisenware is refused, with the reason. **Get license** opens an email to Heisenware asking for one; beside it stands the address, upgrade@heisenware.com, for a computer without a mail program.

On Free, once its App is in use, the banner across the Manager tells an owner of the account the same: *You're on Free: one app in one workspace.*, the mark, and what a licence adds, with **Get license**. The App Builder offers the owners **Get license** in its top bar too.

A licence that ends is a hard cut, announced by a banner some days ahead: the installation falls back to **Free**, where the first deployed App keeps running and the others are stopped. Nothing is deleted, and a new licence brings them back.

## Workspaces

The plan's Apps count for the whole account, and by default every workspace shares them. The **Workspaces** card lists each workspace with the Apps it holds. Where the plan holds more than one workspace, it also shows each one's **Allowance**, *Shared* or *N reserved*. That is a fact of the plan, not of how many workspaces the account has now.

**Edit** on a row renames the workspace, and where the plan holds more than one workspace, sets **Apps reserved**: that many slots are kept for it, and the workspaces without a reservation share what is left. Leave the field empty to go back to sharing. A reservation cannot be below the Apps the workspace already holds, or above what the plan has left over.

The same dialog deletes a workspace, which cannot be undone. [Workspaces](workspaces.md#delete-a-workspace) says what goes with it.

## AI usage and credits

The assistant runs on **credits**: one credit is one euro, and the account pays for every run, whether it was made in the [planning seat](planning.md) or in the Console of the App Builder. Your own AI connected through the [MCP server](ai-clients.md) spends none, because it runs on your own subscription.

In the cloud, Pro brings ten credits a month, on a yearly plan too. They arrive with each calendar month and end with it; unused ones do not carry over. More are booked under **Credits a month** in the **Subscription** card. When nothing is left, the assistant says so and stops.

**AI usage** shows what was spent:

* The **charge**, the **tokens** and the number of **runs** of the current month.
* The monthly charge over the last six months.
* **By member**: who spent it, with their runs, tokens and charge.

The figures are the account's own, in euros. The card shows only where the installation runs the assistant. A self-hosted installation that runs it does so on its own Anthropic key and counts no credits: there the card shows what the assistant and Ask cost on that key, in euros at the provider's price, with **Cost** where the cloud says **Credits**. Your own AI clients through the MCP server are not counted.

## Asking for something else

**Contact sales** names the address to write to for an offer, a plan cut to your needs, or anything the screen does not do by itself.
