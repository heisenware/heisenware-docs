---
description: >-
  When one App is not enough: how several Apps of a workspace share data and call each other.
---

# Suites of Apps

A bigger setup is rarely one App. It is a **suite**: an overview for the office, one App per machine at the line, a settings App for the people who maintain it. Each is used by different people on different devices, and they work on the same data.

Three things tie a suite together.

## Named instances are the data bus

An instance belongs to its agent, not to an App. A `DataStore` named `productionOrders`, or a database connection named `internal-postgres`, is **the same object** for every App of the workspace that names it.

So Apps share state by naming the same instance, never by each keeping its own copy. The overview App reads the orders the line App writes, because both talk to `productionOrders`.

## Endpoints carry actions

When one App must make another App *do* something, the target App publishes an [endpoint](variables-and-endpoints.md#endpoints) and the caller calls it by name. Do not reach into another App's logic.

The endpoint is the contract: its name stays while the logic behind it is rebuilt. In production, a call is routed to the released version of that App.

## One rule, one place

Where several Apps write the same data under a rule, such as "an order may only be started when no other order is running on that line", put the rule in the database as a function and let every App call it. The database then enforces it in one transaction, and refuses with the rule's own message. A rule copied into three Apps is a rule that will differ in three Apps.

## Working on a suite

* **Look before you add.** Read what the workspace already has: its Apps, their pages and the tables they use. Extend a table before inventing a second one for the same thing.
* **Write the architecture down.** Which App does what, which instances carry what, which endpoints exist: that belongs in the workspace's project notes, where every member and the assistant can read it. Notes keep App ids, not links: a link names one host.
* **Checkpoint every App you touch** before a change that spans the suite, so a single rollback is possible everywhere.

## Planning a suite

A suite is worth planning before it is built. That is what the Manager's [planning](../app-manager/planning.md) seat is for: the documents and requirements go in, and what comes out is each App's identity, its devices, its language and its look, plus the notes that carry the decisions. Building then happens in each App's Builder.

What a plan cannot invent, and what you will be asked for: each App's name and its one-sentence role, the devices it runs on (they become its [screens](screens-and-layouts.md)), its language, its navigation, and the corporate design.
