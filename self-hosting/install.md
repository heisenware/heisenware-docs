# Install

How to download, install, run, update and back up Heisenware on your own server (see [Cloud or on-prem](README.md)).

The download is free. It is one package, `heisenware-onprem-<version>.tar.gz`, and it holds everything: the installer, the platform's start and stop scripts, the compose file and every Docker image the installation runs. Nothing else is downloaded, and the installation needs no internet afterwards. Without a licence it runs on Free, one App in one workspace, for as long as you like.

## Prerequisites

The host must be **x86-64 (amd64) Linux**: the platform's images are built for that architecture only. On an ARM processor, the chips of newer Macs included, they run emulated at best: slow, and for a look only. The host needs Docker Engine with the Compose plugin (`docker compose version` must answer), `bash` 4.4 or newer and `openssl`. For the size of the machine and the ports, see [Requirements](README.md#requirements).

Docker needs 8 GB of memory for the platform. With less, its services stall and restart when memory runs short. The installer warns when Docker has less, and says where to give it more: in Docker Desktop under **Settings** > **Resources** (Memory limit), under WSL 2 with `memory=8GB` under `[wsl2]` in `.wslconfig` in your Windows user folder, followed by `wsl --shutdown`.

{% tabs fullWidth="false" %}
{% tab title="Linux" %}
On a Linux distribution (Ubuntu, Debian, CentOS), install Docker Engine, which includes the Docker Compose plugin.

1. Follow the official Docker guide for your distribution:
   * [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
   * [Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
   * [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
2. Run everything below in your normal terminal, as the user who will run the platform. That user needs to be allowed to use Docker; the installer says how if not.
{% endtab %}

{% tab title="Windows" %}
Windows runs Docker through the Windows Subsystem for Linux (WSL), which gives you a Linux environment inside Windows. This is good for a trial; a production installation belongs on a Linux server.

#### Step 1: Install WSL and Ubuntu

1. Open **PowerShell** as an administrator (search for PowerShell in the Start menu, right-click, select **Run as administrator**).
2.  Run:

    ```powershell
    wsl --install
    ```
3. The command enables the required Windows features, downloads the Linux kernel and installs Ubuntu as the default distribution.
4. Restart the computer when prompted.

#### Step 2: Install Docker Desktop for Windows

1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
2. Run the installer. Check **Use WSL 2 instead of Hyper-V (recommended)** during setup.
3. Open Docker Desktop. It detects and integrates your WSL Ubuntu environment.

#### Step 3: Work inside the WSL terminal

Open the Start menu, search for **Ubuntu** and launch it. Run everything below in that terminal. It has to be a WSL 2 distribution: WSL 1 does not run Docker.

The installation goes into the Linux file system. Do not put it on a Windows drive (`/mnt/c`): from Linux those are slow and by default keep no Linux file permissions, so the installation's secrets cannot be kept private there.
{% endtab %}

{% tab title="macOS" %}
Only an Intel Mac runs the platform's images natively; on Apple Silicon Docker has to emulate them, which is slow and for a look only.

1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop).
2. Open the `.dmg` and drag the Docker icon to `Applications`.
3. Launch Docker Desktop and grant the system permissions it asks for.
4. Run everything below in **Terminal** (`/Applications/Utilities`). macOS ships bash 3.2; install a newer one (`brew install bash`) and make sure it comes first in `PATH`.

The installation goes to `/Users/Shared/heisenware`, a folder Docker Desktop shares with its containers. A folder of your own belongs under `/Users` too: Docker Desktop shares only some folders.
{% endtab %}
{% endtabs %}

## Install

{% stepper %}
{% step %}
#### Get the download

Open [heisenware.com/download](https://heisenware.com/download) and leave your email address. The page then shows the current version, its size (about 3 GB), its SHA-256 checksum and the commands below, ready to copy.

Run them on the server itself, over SSH if it stands elsewhere. The first one downloads the package there:

```bash
wget -c "https://downloads.heisenware.cloud/public/onprem/<version>/heisenware-onprem-<version>.tar.gz"
```

`-c` picks up a download that was cut off instead of starting over. The server needs outbound HTTPS to `downloads.heisenware.cloud` for this one download; allow it in your firewall. A server without internet takes the package any other way, for example from a USB stick.
{% endstep %}

{% step %}
#### Unpack it

```bash
tar -xzf heisenware-onprem-<version>.tar.gz
cd heisenware-onprem-<version>
```

The folder holds `install.sh`, `start.sh`, `stop.sh`, `docker-compose.yml`, the images in `docker-images.tar.gz`, and a `README.md` with the essentials of this page.
{% endstep %}

{% step %}
#### Run the installer

```bash
./install.sh
```

The installer first looks at the machine. It stops and says what to do where Docker, its Compose plugin or `openssl` is missing or `bash` is too old, and it warns about an ARM processor, a Docker with less than 8 GB of memory and a port another program holds. Then it says where it will install and asks once whether to go on.

On Linux it asks once to create `/opt/heisenware` with `sudo` and gives that folder to you; everything else runs as you. It then loads the Docker images (a few minutes), creates this machine's own TLS certificate (see [Certificates](#certificates)) and the installation's secrets (see [The `.env` file](#the-env-file)), and starts the platform.

It is done when it prints:

```
✅ Done. The platform is running. There is nothing else to run.
```
{% endstep %}

{% step %}
#### Create the first account

Open `https://localhost`, from another machine `https://<name or address of this machine>`. Port 80 redirects to 443. After the first start the page can take a few minutes to answer.

Your browser warns that the connection is not private. That is expected: the installation signed its own certificate, and no authority has. Choose to go on to the site (the words differ from browser to browser). [Your own certificate](#certificates) removes the warning.

The installation has no account yet. Create the first one on that page with an email address and a password. You become its owner.

{% hint style="info" %}
#### No Google sign-in on your own server

A self-hosted installation never offers Google sign-in. The sign-in page shows no Google button, and invites are taken up with a password.
{% endhint %}
{% endstep %}
{% endstepper %}

### Free, and a licence for more

Without a licence the installation runs on **Free**, with no time limit: one App in one workspace, and the App shows a small *powered by Heisenware* mark. A licence file adds Apps and workspaces and removes the mark. Upload it in the App Manager under **Plan & License**; the same screen asks for one with **Get license**. See [Plan and billing](../app-manager/plan-and-billing.md#on-your-own-server).

### Where the installation lives

The installation has a folder of its own, the same for every version:

| System | Folder |
| --- | --- |
| Linux, Windows (WSL 2) | `/opt/heisenware` |
| macOS | `/Users/Shared/heisenware` |

It holds the compose file, `install.sh`, `start.sh`, `stop.sh`, the README, the secrets in `.env`, the certificate in `certs/` and the backups in `backup/`. Every command on the rest of this page runs there:

```bash
cd /opt/heisenware
```

The package's folder is not needed after the install and may be deleted, together with the `.tar.gz`.

To install somewhere else, name the folder: `./install.sh --dir <folder>`. Every other command of the installer takes `--dir` as well.

### The `.env` file

The platform keeps every secret in a file named `.env` in the installation's folder, readable by its owner only. The installer creates it, `start.sh` completes it, and for a standard installation you never edit it.

Keep it safe and private. A backup without `.env` cannot be restored on another machine. The installer's own backups include it.

Values you may want to set yourself:

| Key | What it does |
| --- | --- |
| `HW_ANTHROPIC_API_KEY` | your own Anthropic API key. With it the installation runs the [assistant](../app-builder/assistant.md): **Planning** in the App Manager, the assistant in the App Builder, and [Ask](../app-manager/ask.md). Without it there is no assistant. |
| `HW_ALLOW_SIGN_UP` | `false` refuses new accounts on this installation. Invited members still join. Unset means sign-up is allowed. |
| `HW_EMAIL_USER`, `HW_EMAIL_HOST`, `HW_EMAIL_PORT`, `HW_EMAIL_PASSWORD` | the SMTP relay invitations and password resets go out through. An installation without one starts anyway, with a warning, and sends no email. |
| `HW_FILES_MAX_MB` | the largest file a workspace's file store takes, in MB. Default 250. |
| `HW_LOG_DRIVER` | the Docker log driver every container logs through (see [Logs](#logs)). |
| `HW_SUPPORT_*` | a [remote support](remote-support.md) session. |

After editing `.env`, run `./start.sh`: it recreates only the containers whose configuration changed. `docker compose restart` never re-reads `.env`.

### Certificates

The ingress serves exactly two files from the `certs` folder:

```
certs/heisenware-fullchain.pem
certs/heisenware-privkey.pem
```

The first install generates a self-signed pair there, valid ten years, for this machine alone. It names `localhost`, `127.0.0.1`, `::1`, `heisenware.local`, the machine's host names (with its domain and without) and the IPv4 addresses it has at the install; Docker's own bridges and link-local addresses are left out. A browser still warns, since no authority signed it, but a client that checks names accepts it once it trusts the file, as Claude Code does with `NODE_EXTRA_CA_CERTS` (see [AI clients](../app-manager/ai-clients.md#claude-code-on-premise)).

A later update keeps the pair it finds, with one exception: a pair an earlier installer made for `heisenware.local` alone is made anew with the names above, and the installer says so in one line. If the new pair cannot be made, the old one stays. A certificate of your own is never touched.

To install your own certificate, let the installer take it: it checks that both files parse, that the key carries no passphrase and that the two belong together before anything is copied, and restarts the ingress.

```bash
./install.sh certs fullchain.pem privkey.pem
```

A wrong pair stops the ingress and with it every port, which is why nothing is copied unproven. If you put the files in place by hand instead, keep the two names above and restart the proxy: `docker restart heisenware-ingress-1`.

## Start and stop

```bash
./start.sh         # start, or apply changes in .env
./start.sh status  # what the platform needs and what is set; changes nothing
./stop.sh          # stop and remove every container; the data stays
```

`start.sh` checks every value the platform needs, generates the internal secrets that are missing, refuses to start when a required value is absent, and runs the services in the background. The first start takes a few minutes while the services initialize.

`./start.sh status` prints one line per value: `ok` when it is set, `default` when the platform fills it, `would generate` for an internal secret it will mint, and `missing` for a value you have to supply.

`./stop.sh --now` kills the processes instead of stopping them, without a grace period.

{% hint style="warning" %}
#### Why `docker compose down` is not enough

The platform starts a container at run time for each workspace (its backend, media server, MCP server and databases) so that workspaces stay separated. Those belong to the `heisenware` Compose project as one-off containers, which a plain `docker compose down` skips by Compose's own rules. `./stop.sh` takes the services and the workspace containers down together, including containers a platform before v93 spawned, which carry no project labels yet.
{% endhint %}

{% hint style="info" %}
#### Data persistence

Databases, configuration and files live in Docker volumes. Power-cycling the host or restarting a container loses nothing. If the platform stops answering, restarting the containers is the first thing to try.
{% endhint %}

{% hint style="info" %}
#### Services that stop answering

The platform restarts some of its services by itself. A workspace's backend, and the backend of each deployed App, that does not answer its health check for a minute is restarted. The broker is restarted only after three failed health probes in a row, about three minutes, so a short stall of the machine costs no MQTT session.
{% endhint %}

### A forgotten password without email

Without a mail relay in `.env` the installation sends no email, also not the one **Forgot password?** promises. Print the link that email would carry instead:

```bash
./start.sh password-link <account> <email>
```

On that link the member sets a new password. It works once, and whoever opens it sets the password, so give it to that member alone. The present password stays good until the link is used.

## Update

Download and unpack the new package as for the install, open a terminal in its folder and run its installer:

```bash
tar -xzf heisenware-onprem-<new version>.tar.gz
cd heisenware-onprem-<new version>
./install.sh
```

It finds the installation, checks the package and the disk, asks before it stops the platform, writes a full backup into the installation's `backup/`, loads the new images and starts the new version. Afterwards the new package's folder may be deleted.

The images of the version before stay on the machine, so that you can [roll back](#roll-back) without its package. Once the new version runs, the update asks once whether to remove the images of versions older than that.

Before it stops anything, the update asks the disk for the room it will take, per file system:

* **Docker's data root**: twice what the new images take unpacked, since loading them holds them twice at its peak.
* **The installation's folder**: the backup, as large as the volumes it archives.

On top comes a margin of a tenth, at least 2 GB. With too little room the update says where, how much it needs, how much is free and what for, and the platform keeps running. Docker Desktop keeps its data root in a virtual machine, where an image already on the machine measures it; where nothing can measure, a warning names the room needed and the update goes on.

{% hint style="info" %}
#### A newer Postgres

A version with a newer Postgres moves each workspace's database at its first start, about half a minute per GB. A workspace is without its database until its own has moved. The old data stays in the workspace's volume beside the new. `docker compose logs docker` says how each move went.
{% endhint %}

### An installation in another folder

An installation made before the installation folder existed lives elsewhere, often in the folder of the package it came from. While it runs, the new installer finds it and offers to move it into `/opt/heisenware` (on a Mac `/Users/Shared/heisenware`): after the backup, its `.env`, `certs/`, `backup/` and `docker-compose.yml` are copied there. The old folder keeps its files, with a note, `INSTALLATION-MOVED.txt`, that says where the installation went.

To update it where it is instead, name its folder:

```bash
./install.sh --dir <its folder>
```

Coming from v92, the installer also moves your secrets out of the old `docker-compose.yml` into `.env`: see [Upgrading from v92](upgrading-from-v92.md).

## Back up and restore

Every update makes a backup first. To make one at any time:

```bash
./install.sh backup
```

A backup is one timestamped `.tar.gz` in `backup/`, readable by its owner only. It holds every volume of this installation, the platform's own and each workspace's, plus the `docker-compose.yml` and the `.env` of that moment: data, version and secrets roll back together.

To restore one, hand the archive to the installer, then start:

```bash
./install.sh backup/heisenware-backup-YYYY-MM-DD_HH-MM-SS.tar.gz
./start.sh
```

The installer enters restore mode and asks you to confirm before it stops the platform and overwrites the current data. Volumes in the archive that do not belong to this installation are left alone.

Backups and restores, the one an update makes included, run in a small helper image that every package carries, and pull nothing from the internet while they run. If the helper is missing from the machine, the installer pulls it before it stops anything. Where that fails, for example without internet, it says how to load it from any package, `docker load -i <the unpacked package>/docker-images.tar.gz`, and ends with nothing stopped or changed.

### Roll back

To go back to the version before an update, restore the backup that update wrote, as above. It brings back the data, `.env` and the compose file of that version, and needs neither its package nor internet access: its images are still on the machine.

A backup of an even older version may need images that are gone. The restore then names the package they come from: unpack it, load its images with `docker load -i <the unpacked package>/docker-images.tar.gz`, then run `./start.sh`.

### Send a backup to Heisenware

When support asks for a copy of your data, the installer uploads a backup straight from the machine. It needs nothing but `curl` and `openssl`.

```bash
./install.sh upload
```

Without a file name the newest archive in `backup/` is sent, and one is made first if there is none; name a file to send that one. The script asks for one secret, which support hands you. The key is upload-only: it can write into the bucket and nothing else, and the upload lands in a folder named after your machine.

To run it unattended, pass the secret in the environment:

```bash
HW_UPLOAD_SECRET_KEY=... ./install.sh upload backup/heisenware-backup-YYYY-MM-DD_HH-MM-SS.tar.gz
```

`HW_UPLOAD_PREFIX` (default: the host name), `HW_UPLOAD_ENDPOINT`, `HW_UPLOAD_ACCESS_KEY`, `HW_UPLOAD_BUCKET` and `HW_UPLOAD_REGION` override the folder, server, key name, bucket and region. You need them only when support says so.

## Logs

```bash
docker compose logs -f          # every service
docker logs -f <container_name> # one container
```

Every container of the platform, the workspace containers included, keeps its log in rotating files on the host: Docker's `local` driver, at most five compressed files of 20 MB each. A container's log goes with the container, for example on `./stop.sh` or an update.

To send the logs to your own system instead, name the driver in `.env` and give it its settings in the host's Docker configuration:

1.  Configure the driver in `/etc/docker/daemon.json` and restart Docker. Sending everything to a syslog server, for example:

    ```json
    {
      "log-driver": "syslog",
      "log-opts": { "syslog-address": "udp://logs.example.com:514" }
    }
    ```
2.  Name the same driver in `.env`:

    ```
    HW_LOG_DRIVER=syslog
    ```
3. Restart the platform with `./stop.sh` and `./start.sh`.

Any driver Docker supports works (`journald`, `syslog`, `gelf`, `fluentd`, `splunk`, …), and the options in `daemon.json` apply to every container of the platform. With `journald`, `local` and `json-file`, `docker logs` keeps working; with a remote driver, Docker keeps a local copy for it by default.

## Remote support

Heisenware can help with your installation through one outbound connection you switch on and off: see [Remote support](remote-support.md).
