# On-Premise Installation

Welcome to the Heisenware On-Premise Installation Guide! This document will walk you through setting up and running your own private instance of the Heisenware platform. The process is designed to be straightforward, even if you're not a system administrator.

### Prerequisites: Docker Installation

The entire Heisenware platform runs in a set of containers managed by Docker. Before you can install our software, you need to have a working Docker environment on your server or local machine.

The setup process is slightly different depending on your operating system. Please follow the guide for your specific OS.

{% tabs fullWidth="false" %}
{% tab title="Linux" %}
If you are running a Linux distribution (like Ubuntu, Debian, or CentOS), you will install Docker Engine, which now includes the Docker Compose plugin.

1. Follow the official Docker guide to install **Docker Engine** for your specific Linux distribution. The setup process will include all the necessary components, including the `docker compose` command.
   * [**Install Docker Engine on Ubuntu**](https://docs.docker.com/engine/install/ubuntu/)
   * [**Install Docker Engine on Debian**](https://docs.docker.com/engine/install/debian/)
   * [**Install Docker Engine on CentOS**](https://docs.docker.com/engine/install/centos/)
2. You will run all subsequent commands in your standard terminal window.
{% endtab %}

{% tab title="Windows" %}
Modern Windows systems use the **Windows Subsystem for Linux (WSL)** to run Docker efficiently. This gives you the power of a Linux environment directly inside Windows and is the most stable way to run Heisenware.

**Step 1: Install WSL and Ubuntu**

The easiest way to set up everything you need is with a single command.

1. Open the **PowerShell** application as an **Administrator**. You can do this by searching for "PowerShell" in the Start Menu, right-clicking it, and selecting "Run as administrator".
2.  In the blue PowerShell window, copy and paste the following command, then press Enter:

    ```
    wsl --install

    ```
3. This command will automatically enable the required Windows features, download the Linux kernel, and install **Ubuntu** as your default Linux distribution.
4. After it finishes, **reboot your computer** as prompted to complete the installation.

**Step 2: Install Docker Desktop for Windows**

1. Download Docker Desktop from the official website: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
2. Run the downloaded installer and follow the on-screen instructions. A crucial step is to **ensure the "Use WSL 2 instead of Hyper-V (recommended)" option is checked.**
3. Once installed, launch Docker Desktop. It will automatically detect and integrate with the Ubuntu environment you installed via WSL.

**Step 3: Work inside the WSL Terminal**

From now on, whenever you need to run a command for the installation, you will do it inside your new Ubuntu environment.

1. Open your Start Menu and search for **Ubuntu**.
2. Click to open it. This will launch a terminal window. This is where you will copy your Heisenware installation files and run the `install.sh` script.
{% endtab %}

{% tab title="MacOS" %}
1. Download Docker Desktop from the official website: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop).
2. Open the downloaded `.dmg` file and drag the Docker icon into your `Applications` folder.
3. Launch Docker Desktop from your Applications folder. It may ask for permissions to finish its installation.

You will run all subsequent commands in the standard **Terminal** application, which you can find in `Applications/Utilities`.
{% endtab %}
{% endtabs %}

### Installing Heisenware

You will receive two files from us:

* `heisenware-onprem-vXX-Y.tar.gz` - The main application package.
* `install.sh` - The installation script.

Place both of these files into a new, empty directory on your machine. For Windows users, make sure you do this **inside your Ubuntu (WSL) environment**. The file path will look something like `/home/yourusername/heisenware/`.

<details>

<summary>Optional: Direct download into the terminal</summary>

<figure><img src="../.gitbook/assets/hetzner-server-downloads.png" alt=""><figcaption><p>For downloading our application bundles and installation scripts you will need - at least temporary - an outgoing  connection to the Internet to reach our download server <code>downloads.heisenware.cloud</code> . This server is located in Germany and has a fixed IP address: <code>128.140.88.150</code>. Please make sure your IT sets the according firewall rules.</p></figcaption></figure>

To ease your installation we offer the possibility to receive the above mentioned files directly into the terminal in which you are going to run the platform.\
\
We will provide you a time-bound link to the application package which you download using  `wget` :

{% hint style="warning" %}
Make sure to put **quotes (")** around the link when downloading
{% endhint %}

```bash
wget -O heisenware.tar.gz "<the link from us>"
```

The `install.sh` can always freely be downloaded using:

```sh
wget "https://downloads.heisenware.cloud/public/install.sh"
```

</details>

{% stepper %}
{% step %}
**Open Your Terminal**

* **Windows:** Open the **Ubuntu** app from your start menu.
* **macOS/Linux:** Open your standard **Terminal** app.

Navigate to the directory where you saved the two files. For example:

```bash
cd /home/yourusername/heisenware/
```
{% endstep %}

{% step %}
**Make the Script Executable**

Run the following command to give your computer permission to run the installation script:

```bash
chmod +x install.sh
```
{% endstep %}

{% step %}
**Run the Installer**

Now, start the installation by running the script and providing the name of the application package:

```bash
./install.sh heisenware.tar.gz
```

The script will guide you through the process with a series of prompts. It will unpack all the necessary files, load the Docker images, and set up your environment.
{% endstep %}

{% step %}
**Start the Application**

Once the script finishes successfully, start the entire platform with one command:

```bash
docker compose up -d
```

It may take a few minutes for all services to start up for the first time. Congratulations, your Heisenware On-Premise instance is now running!

{% hint style="success" %}
**Access**

Your application should now be available under `http://localhost` . If this does not work try `http://localhost/manager` . Initially the system uses self-signed certificates created by us, which your browser will not and cannot verify. You hence must explicitly allow your browser to still continue (it's safe, you started it locally :smile:).
{% endhint %}

{% hint style="info" %}
**Certificates**

In case you are having own certificates for your premises, you can happily install them in the `certs` folder. Just keep the format and the name of the file, restart and everything is in shape.

You can use `docker restart heisenware-ingress-1` to apply new certificates easily.
{% endhint %}

{% hint style="warning" %}
**Account Creation**

The first thing you will have to do on this fresh system is creating an account (will stay local). For that click the respective link and use email + password to setup your credentials (Google will not work on your local server!)
{% endhint %}
{% endstep %}
{% endstepper %}

### Updating Your Installation

The update process is designed to be safe and simple. When a new version is available, you will receive a new link to download the application package.

1. Place the new file in the same directory as your existing installation, replacing the old one.
2.  Run the installer again, just like you did the first time:

    ```bash
    ./install.sh heisenware.tar.gz
    ```

The script will automatically detect an existing installation and switch to **update mode**.

**Automatic Backup:** Before making any changes, the script will automatically create a full backup of your existing application data. This backup will be saved as a timestamped `.tar.gz` file in a new `backup/` directory. This is your safety net in case anything goes wrong.

The script will then guide you through stopping the old version and installing the new one.

### Rollback & Restoring a Backup

If an update causes an issue, you can easily roll back your data to the state it was in before the update.

1. Find the backup file you want to restore in the `backup/` directory.
2.  Run the **same `install.sh` script**, but this time, give it the path to the backup file:

    ```bash
    ./install.sh backup/heisenware-backup-YYYY-MM-DD_HH-MM-SS.tar.gz
    ```
3. The script will recognize the backup file and enter **Restore Mode**. It will ask for confirmation, stop the application, and overwrite the current data with the contents of your backup.
4. Once it's finished, you can restart the application with `docker compose up -d` to run on the restored data.

### Basic Application Management

{% hint style="success" %}
**Rest Assured**

As long as you don't delete or manually mess with the docker volumes created by our platform, your data is always persisted and safe. This means you can power-cycle your host system or restart individual or all containers without ever fearing to loose data.

Indeed, we recommend restarting the platform in case things hung up or seem not to work as expected.
{% endhint %}

{% hint style="warning" %}
**Important**

Our platform uses regular LInux-based Docker containers as execution engine. This implies that the regular tooling provided by and around Docker will work. \
However, when creating accounts the **platform spawns new containers in runtime** for full data and command isolation. Those containers will currently not be trapped by the `docker compose` commands. So a `docker compose down` will leave account containers intact and result in a undefined platform state.
{% endhint %}

Here are a few basic commands you can run in your terminal (from your installation directory) to manage the platform:

* **Stop the application:** `docker rm -f $(docker ps -a -q)` \
  &#xNAN;_&#x4E;ote: Please make sure you are not running any other docker-based applications next to Heisenware if you use this command._
* **Start the application again:** `docker compose up -d`
* **View live logs from all services:** `docker compose logs -f`&#x20;
* **View live logs from an individual service**: `docker logs -f <containerName>`
