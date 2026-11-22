---
description: >-
  Creating a Heisenware account, logging in to it, and taking up an invitation
  as a member.
---

# Sign up and sign in

Everything you build belongs to an [account](../app-manager/account.md): your organization on Heisenware. You either create one, or someone invites you into theirs.

## Create an account

Sign up at [heisenware.cloud](https://heisenware.cloud/manager/authentication/sign-up). It is one screen:

{% stepper %}
{% step %}
### Choose the account name

**Account name** is your organization's name on Heisenware, and on the cloud also its address: `acme` becomes `acme.heisenware.cloud`. It takes lower-case letters, digits and dashes, 3 to 63 characters; what you type is folded to that as you type. The screen says at once whether the name is still free, and the name never changes afterwards.
{% endstep %}

{% step %}
### Say who you are

**Continue with Google**, or an **Email** and a **Password** of at least 8 characters with a letter and a digit. Agree to the terms, then create the account.
{% endstep %}

{% step %}
### Verify your email

You get an email with a link. Following it marks your address as verified, which is what the **Verified** column on the [Members](../app-manager/members.md) screen shows.
{% endstep %}
{% endstepper %}

The account starts with one [workspace](../app-manager/workspaces.md), `default`, and you are the owner of the account. What a new account gets is written on the sign-up screen: on the Heisenware cloud a trial of the Pro plan with credits for the assistant, on your own server the Free plan until a licence is uploaded.

## Log in

Go to your account's address, `acme.heisenware.cloud`, or to [heisenware.cloud](https://heisenware.cloud/manager/authentication/sign-in) and name the account there.

1. Enter the **Account name**.
2. **Log in with Google**, or your **Email** and **Password**.

Forgotten your password? Fill in the account name and the email, then click **Forgot password?**. The email that arrives leads to a screen where you choose a new password.

The screen answers the same whether or not the address belongs to a member of the account. One address gets at most one such email a minute and five an hour per account; a request beyond that gets the same answer and sends nothing.

When Heisenware is still starting up or briefly unavailable, the screens say so: *Heisenware is still starting up or briefly unavailable. Please try again in a minute.*

## Accept an invitation

A member of an account invites you by email. The link opens **You're invited**, which asks for your first and last name and a password, or for Google. Google works only under the address you were invited as. The email's button works once; the line under it, *Already set up? Log in at … with the account name …*, is your way back afterwards.

Taking up the invitation ends on **You're in**: it shows the **Log-in address** and the **Account name** to keep for next time, and stays until you press the button with your account's name, **Go to acme** for example, which takes you into the App Manager, in the workspaces the invitation granted. Pressed after a minute, the button leads to the log-in with the account filled in. A link that was replaced by a newer invitation, or that someone already used, says so: ask for a fresh one, or log in if you set a password with it.

A password the installation's rules refuse leaves the link as it is: the screen says *This password was not accepted. Please choose another one.* and keeps the form. Where the password is set but the log-in after it fails, the screen says so and leads to the log-in.

{% hint style="info" %}
An invitation to use an App is something else: it makes you an App user, not a member, and it leads into the App rather than into the App Manager. See [App users and access](../app-manager/users-and-access.md).
{% endhint %}

## On your own server

A [self-hosted](../self-hosting/README.md) installation differs in two ways:

* **No Google**: the sign-in and sign-up screens offer email and password only, unless the installation was given a Google client of its own.
* **Sign-up may be off**: then the sign-up page says so, and the way in is an invitation from a member of an existing account.

The account name is a name there, not an address: the installation has one address, the one your IT gave it.

## Where to go next

* Let the assistant plan and scaffold your Apps: [Your first App with the assistant](first-app-with-the-assistant.md).
* Or build one yourself, step by step: [Your first App by hand](first-app-by-hand.md).
