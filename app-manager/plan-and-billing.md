---
description: >-
  What the account may use: the plan and its quotas, the credits the assistant
  spends, and how the plan's Apps divide among the workspaces.
---

# Plan & Billing

**Plan & Billing** holds what the account may use and what that costs. It belongs to the account, not to a workspace, so only owners of the account see the entry; the auth service refuses everyone else.

What the screen offers depends on where Heisenware runs: in the Heisenware cloud it manages a subscription, on your own server a licence file. Both show the workspaces and what the assistant used.

Prices are not in these pages. They are on [heisenware.com](https://heisenware.com), and the screen itself quotes what your plan costs before you change anything.

## In the cloud

### Subscription

One card with the plan and everything that follows from it:

* **Your plan**: its name, when it started and how long it is valid. **Upgrade plan** opens the plans side by side and takes you through Stripe's checkout.
* **Number of apps**: how many Apps of your plan are in use, over the whole account. **Add 1 app** buys one more slot; the dialog shows what it costs now, prorated to the rest of the billing period. Where you bought slots beyond the plan's own and one is free, the same row offers to give one back.
* **Number of workspaces**: the same for [workspaces](workspaces.md), while a subscription is running.
* **Active subscription**: the facts at a glance: status, billing interval, included Apps, Apps in use, start and end date, whether it renews, the next invoice amount, and the cancellation date if there is one.
* **Billing**: when the plan renews, and **Stripe customer portal** for invoices, receipts and the card on file.
* **Payment method**: card or manual invoice. On a manual invoice you cannot change the plan or buy Apps yourself; write to us instead.

**Cancel your subscription** sits at the foot of the page. A cancelled plan runs to the end of the period it was paid for, then stops; until it ends, **Reactivate** takes the cancellation back.

### What the quotas do

* **Apps** count over the whole account. An App beyond the quota cannot be opened by anyone: the platform refuses to register it, and the [Apps](apps.md) screen refuses to create another. A banner across the top of the Manager says so.
* **Workspaces** count the same way. A full plan turns **Add workspace** in the workspace switcher into **Ask for more**.
* **An expired plan** stops the Apps screen altogether, and the banner names the plan and the dates it ran. A failed payment keeps the plan running while Stripe tries again, with a banner for the account's owners.

## On your own server

A self-hosted installation runs on a licence file instead of a subscription:

* **Hosting** says that you host Heisenware yourself.
* **License Information** shows the licence: whom it is licensed to, the plan, its term and its start and end date, the Apps it includes and the Apps in use.
* **Upload license file** takes the `.jwt` file we send you; **Get license** leads to where you ask for one. A file not signed by Heisenware is refused, with the reason.

A licence that ends is a hard cut, announced by a banner some days ahead: the installation falls back to **Free**, where the first deployed App keeps running and the others are stopped. Nothing is deleted, and a new licence brings them back.

## Workspaces

The plan's Apps count for the whole account, and by default every workspace shares them. The **Workspaces** card lists each workspace with the Apps it holds and its **Allowance**, *Shared* or *N reserved*.

**Edit** on a row renames the workspace and sets **Apps reserved**: that many slots are kept for it, and the workspaces without a reservation share what is left. Leave the field empty to go back to sharing. A reservation cannot be below the Apps the workspace already holds, or above what the plan has left over.

The same dialog deletes a workspace, which cannot be undone. [Workspaces](workspaces.md#delete-a-workspace) says what goes with it.

## AI usage and credits

The assistant runs on **credits**: one credit is one euro, and the account pays for every run, whether it was made in the [planning seat](planning.md) or in the Console of the App Builder. Your own AI connected through the [MCP server](ai-clients.md) spends none, because it runs on your own subscription.

**Credits** shows what is left:

* **Balance**: what the assistant can still spend, with what a running assistant is holding back at this moment.
* **Included**: the credits that came with the plan. They are spent first and end with the billing period.
* **Packs**: the credits you bought. They last twelve months from the purchase.

The table under them lists the lots the balance is made of, in the order they are spent, with the date each one ends. Choose a **Pack** and **Buy credits** to add more. When nothing is left, the assistant says so and stops.

**AI usage** shows what was spent:

* The **charge**, the **tokens** and the number of **runs** of the current month.
* The monthly charge over the last six months.
* **By member**: who spent it, with their runs, tokens and charge.

The figures are the account's own, in euros, and they appear on a self-hosted installation too.

## Asking for something else

**Contact sales** names the address to write to for an offer, a plan cut to your needs, or anything the screen does not do by itself.
