# Upgrading from v92

How an on-premise installation moves from v92 to v93, what changes underneath, and what to check afterwards. The upgrade itself is the usual "run the installer again"; this page explains what happens so nothing surprises you.

## What changes

Up to v92, the `docker-compose.yml` of a release package carried every secret of your installation as a literal value: the database passwords, the FusionAuth API key, the platform's tokens. From v93 on, the compose file carries references only, and the values live in a file named `.env` next to it, readable by its owner. Several things come with that:

* **`start.sh`**, the platform's front door, ships inside every package. It knows which values the platform needs, generates the internal ones that are missing, refuses to start when a required value is absent, and runs the services. Starting the platform is `./start.sh` from now on.
* **Members become owners of the account.** At its first start, v93 gives every member who held the v92 `admin` role the [owner](../app-manager/members.md) role and deletes the v92 roles. Check your members afterwards.
* **Google sign-in is gone on-premise.** v92 passed a Google client to an on-premise installation; v93 never does, connected or not. Members who signed in with Google sign in with their email address and a password from now on, setting one through **Forgot password** if they have none. That needs the mail relay in `.env`.
* **The installer travels in the package.** There is no separate `install.sh` to download any more: every package brings its own, and you run it from the unpacked package's folder. When it updates a v92 installation it moves the secrets out of the old compose file into `.env` before anything else, so your data keeps the credentials it was created with.
* **The installation gets a folder of its own.** A v92 installation lives where you unpacked its package. From v93 on an installation lives in `/opt/heisenware` (on a Mac `/Users/Shared/heisenware`), the same folder for every version, and the installer offers to move yours there (see [Install](install.md#where-the-installation-lives)).

## Upgrading

1. Leave the v92 platform running: the installer finds it through its containers.
2. Download the v93 package from [heisenware.com/download](https://heisenware.com/download) (see [Install](install.md#install)) .
3.  Run the installer from the unpacked package's folder:

    ```bash
    tar -xzf heisenware-onprem-<version>.tar.gz
    cd heisenware-onprem-<version>
    ./install.sh
    ```
4. Confirm the prompts. The installer stops the platform, writes a full backup, moves the installation into its new folder, loads the new images, migrates your secrets into `.env`, and starts the new version through `start.sh`.

The old folder keeps its files, with a note, `INSTALLATION-MOVED.txt`, that says where the installation went. To keep the installation where it is instead, run `./install.sh --dir <the v92 folder>`.

That is all. The platform comes up with your existing data, users, and Apps.

## What the installer does on the way

* **Backup first.** Every platform and account volume, the old `docker-compose.yml`, and (from v93 on) `.env` go into one archive under `backup/`. A restore rolls back data, version, and secrets together.
* **Secrets are carried over, never regenerated.** The installer reads every value the new version needs out of the old compose file and writes it into `.env`. Values the old version did not have, such as the broker's API key, are generated. Nothing that your databases or FusionAuth were created with changes.
* **Renamed settings are mapped.** The platform's publishable client key changed its name between the versions, and its client identity its username; the installer carries the old key over under the new name and declares the new username, which the platform applies on its first start.
* **Your volumes keep their names.** A v92 installation ran under the name of its directory; the installer records that name in `.env` so the new version keeps using the same volumes.
* **Certificates come along.** The `certs` folder moves with the installation, and `.env` points the platform at it.

## After the upgrade

Run these in the installation's new folder (`cd /opt/heisenware`).

*   Check the platform's view of its configuration:

    ```bash
    ./start.sh status
    ```

    Every line should read `ok` or `default`. A line marked `missing` names a value you have to add to `.env` before running `./start.sh` again. On an on-premise installation a missing mail password only warns: the platform starts without it, and sends no mail.
* Sign in with your existing administrator account; your Apps and connected devices are where you left them.
*   Optionally renew the platform's internal secrets, now that rotating them is a one-liner. The command writes fresh values into `.env` and restarts the affected services:

    ```bash
    ./start.sh rotate
    ```
* Keep `.env` with your backups. The installer includes it from now on; if you copy an installation to another machine, copy `.env` too.

## Rolling back

The first start of v93 changes the member roles for good, so an installation that has run v93 returns to v92 only through a backup.

Restore the backup the installer wrote before the upgrade, as described in [Back up and restore](install.md#back-up-and-restore). The backup carries the v92 compose file with its values, so the restored installation starts as it did before, with `docker compose up -d`.
