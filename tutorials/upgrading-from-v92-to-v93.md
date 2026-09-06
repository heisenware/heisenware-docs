# Upgrading from v92 to v93

How an on-premise installation moves from v92 to v93, what changes underneath, and what to check afterwards. The upgrade itself is the usual "run the installer again"; this page explains what happens so nothing surprises you.

## What changes

Up to v92, the `docker-compose.yml` of a release package carried every secret of your installation as a literal value: the database passwords, the FusionAuth API key, the platform's tokens. From v93 on, the compose file carries references only, and the values live in a file named `.env` next to it, readable by its owner. Two things come with that:

* **`start.sh`**, the platform's front door, ships inside every release package. It knows which values the platform needs, generates the internal ones that are missing, refuses to start when a required value is absent, and runs the services. Starting the platform is `./start.sh` from now on.
* **`install.sh` stays the one installer for every version.** It recognizes what it is handed and what is installed, and when it updates a v92 installation it moves the secrets out of the old compose file into `.env` before anything else, so your data keeps the credentials it was created with.

## Upgrading

1. Download the latest `install.sh` and the v93 release package into your installation directory, overwriting the old package.
2.  Run the installer:

    ```bash
    ./install.sh heisenware.tar.gz
    ```
3. Confirm the prompts. The installer stops the platform, writes a full backup into `backup/`, loads the new images, migrates your secrets into `.env`, and starts the new version through `start.sh`.

That is all. The platform comes up with your existing data, users, and Apps.

## What the installer does on the way

* **Backup first.** Every platform and account volume, the old `docker-compose.yml`, and (from v93 on) `.env` go into one archive under `backup/`. A restore rolls back data, version, and secrets together.
* **Secrets are carried over, never regenerated.** The installer reads every value the new version needs out of the old compose file and writes it into `.env`. Values the old version did not have, such as the broker's API key, are generated. Nothing that your databases or FusionAuth were created with changes.
* **Renamed settings are mapped.** The platform's publishable client key changed its name between the versions, and its client identity its username; the installer carries the old key over under the new name and declares the new username, which the platform applies on its first start.
* **Your volumes keep their names.** A v92 installation ran under the name of its directory; the installer records that name in `.env` so the new version keeps using the same volumes.
* **Certificates stay where they are.** The `certs` folder is preserved, and `.env` points the platform at it.

## After the upgrade

*   Check the platform's view of its configuration:

    ```bash
    ./start.sh status
    ```

    Every line should read `ok` or `default`. A line marked `missing` names a value you have to add to `.env` before running `./start.sh` again. On an on-premise installation a missing mail password or Google login secret only warns: the platform starts without them.
* Sign in with your existing administrator account; your Apps and connected devices are where you left them.
*   Optionally renew the platform's internal secrets, now that rotating them is a one-liner. The command writes fresh values into `.env` and restarts the affected services:

    ```bash
    ./start.sh rotate
    ```
* Keep `.env` with your backups. The installer includes it from now on; if you copy an installation to another machine, copy `.env` too.

## Rolling back

Restore the backup the installer wrote before the upgrade, exactly as described in [Rollback and restoring a backup](on-premise-installation.md#rollback-and-restoring-a-backup). The backup carries the v92 compose file with its values, so the restored installation starts as it did before, with `docker compose up -d`.
