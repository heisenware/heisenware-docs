# On-premise installation

Set up and run a private, on-premise instance of the Heisenware platform (see [Installation modes](../advanced/high-level-architecture/installation-modes.md)).

## Prerequisites: Docker installation

The Heisenware platform runs inside Docker containers. Before installing Heisenware, you must set up a working Docker environment on your server or local computer.

{% tabs fullWidth="false" %}
{% tab title="Linux" %}
If you run a Linux distribution (such as Ubuntu, Debian, or CentOS), install Docker Engine, which includes the Docker Compose plugin.

1. Follow the official Docker guides to install Docker Engine for your specific distribution:
   * [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
   * [Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)
   * [Install Docker Engine on CentOS](https://docs.docker.com/engine/install/centos/)
2. Run all subsequent commands inside your standard terminal window.
{% endtab %}

{% tab title="Windows" %}
Modern Windows systems use the Windows Subsystem for Linux (WSL) to run Docker. This provides a stable Linux environment directly inside Windows.

#### Step 1: Install WSL and Ubuntu

1. Open **PowerShell** as an administrator (search for PowerShell in the Start menu, right-click, and select **Run as administrator**).
2.  Run the following command:

    ```powershell
    wsl --install
    ```
3. This command enables the required Windows features, downloads the Linux kernel, and installs Ubuntu as your default distribution.
4. Restart your computer when prompted to complete the installation.

#### Step 2: Install Docker Desktop for Windows

1. Download Docker Desktop from the official website: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
2. Run the installer and follow the on-screen instructions. Ensure you check the **Use WSL 2 instead of Hyper-V (recommended)** option during setup.
3. Open Docker Desktop. It automatically detects and integrates with your WSL Ubuntu environment.

#### Step 3: Work inside the WSL terminal

Run all subsequent installation commands inside your WSL Ubuntu environment.

1. Open the Start menu, search for **Ubuntu**, and launch the terminal.
2. Use this terminal to copy your installation files and execute the installation script.
{% endtab %}

{% tab title="macOS" %}
1. Download Docker Desktop from the official website: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop).
2. Open the downloaded `.dmg` file and drag the Docker icon to your `Applications` folder.
3. Launch Docker Desktop from your applications and grant any requested system permissions.

Run all subsequent commands in the native **Terminal** app located in `/Applications/Utilities`.
{% endtab %}
{% endtabs %}

## Installing Heisenware

We will provide two files for your installation:

* `heisenware-onprem-vXX-Y.tar.gz` – The primary application package.
* `install.sh` – The installation script.

Place both files in an empty directory on your machine. If you are on Windows, ensure you place these files inside your WSL Ubuntu environment (for example, `/home/<username>/heisenware/`).

<details>

<summary>Optional: Direct download using the terminal</summary>

<figure><img src="../.gitbook/assets/hetzner-server-downloads.png" alt=""><figcaption></figcaption></figure>

Your server requires outbound internet access to `downloads.heisenware.cloud` (Germany, static IP: `128.140.88.150`) to retrieve the application bundles and installation scripts. Ensure your network firewall permits this traffic.

You can download the files directly to your server terminal using a time-bound bundle link. Download the package using `wget`:

{% hint style="warning" %}
#### Download link quotes

Always enclose the download URL in double quotes (`"`) when running the `wget` command.
{% endhint %}

```bash
wget -O heisenware.tar.gz "<provided_download_link>"
```

You can download the latest `install.sh` script at any time:

```bash
wget "https://downloads.heisenware.cloud/public/install.sh"
```

</details>

{% stepper %}
{% step %}
#### Open the terminal

Navigate to the directory containing your installation files.

* **Windows:** Open the **Ubuntu** application from your Start menu.
* **macOS and Linux:** Open your standard system terminal.

Change to your installation directory:

```bash
cd /home/<username>/heisenware/
```
{% endstep %}

{% step %}
#### Make the script executable

Grant execute permissions to the installation script:

```bash
chmod +x install.sh
```
{% endstep %}

{% step %}
#### Run the installer

Run the installer script and pass the application package as an argument:

```bash
./install.sh heisenware.tar.gz
```

The script guides you through the process with a series of prompts. It unpacks the necessary files, imports the Docker images, and configures your environment.
{% endstep %}

{% step %}
#### Start the platform

Start the platform services in the background:

```bash
docker compose up -d
```

It may take a few minutes for all system services to initialize during the first startup.

{% hint style="info" %}
#### Platform access and initial setup

* **Access:** The platform is available at `http://localhost` (or `http://localhost/manager`). Because the system uses self-signed certificates, your browser will display a security warning. You can safely proceed past this warning.
* **Certificates:** If you have custom domain certificates, place them in the `certs` folder. Maintain the default filenames, and restart the proxy service to apply them: `docker restart heisenware-ingress-1`.
* **Account creation:** You must register a new local administrator account on your fresh installation. Click the registration link on the login page to set up your email and password. External providers like Google do not function on local offline servers.
{% endhint %}
{% endstep %}
{% endstepper %}

## Updating your installation

The update process is safe and preserves your existing data. When a new version is released, download the latest application package and run the installer again.

1. Place the new package file in your active installation directory, overwriting the old package.
2.  Execute the installer script:

    ```bash
    ./install.sh heisenware.tar.gz
    ```

The script automatically detects your existing installation and runs in update mode.

#### Automatic backup

Before applying any changes, the script creates a full archive of your platform data and stores it as a timestamped `.tar.gz` file inside the `backup/` directory.

## Rollback and restoring a backup

If an update fails or causes unexpected issues, you can roll back your system to a previous backup state.

1. Locate your desired backup archive inside the `backup/` directory.
2.  Run the installation script and pass the path to your backup archive:

    ```bash
    ./install.sh backup/heisenware-backup-YYYY-MM-DD_HH-MM-SS.tar.gz
    ```
3. The script enters restore mode. Confirm the prompt to stop the platform and overwrite the current data with the backup contents.
4.  Restart the platform services:

    ```bash
    docker compose up -d
    ```

## Basic application management

{% hint style="info" %}
#### Data persistence

Your databases, configurations, and assets persist inside dedicated Docker volumes. Power-cycling your host machine or restarting individual containers will not cause data loss. If the platform becomes unresponsive, restarting the containers is the recommended troubleshooting step.
{% endhint %}

{% hint style="warning" %}
#### Dynamic container isolation

The platform spawns independent Docker containers at runtime for each active account to ensure process and command isolation. These dynamic containers are not managed by Docker Compose. Running `docker compose down` leaves these account containers running, which causes an inconsistent platform state. Use the shutdown commands listed below instead.
{% endhint %}

Execute these commands from your installation directory to manage your on-premise instance:

*   **Stop the platform:** Run the following command to force-stop and remove all active containers:

    ```bash
    docker rm -f $(docker ps -a -q)
    ```

    _Caution: This stops and removes all containers running on your host machine. Do not run this if you host other Docker-based applications alongside Heisenware._
*   **Start the platform:**

    ```bash
    docker compose up -d
    ```
*   **View live logs for all services:**

    ```bash
    docker compose logs -f
    ```
*   **View live logs for a specific service:**

    ```bash
    docker logs -f <container_name>
    ```
