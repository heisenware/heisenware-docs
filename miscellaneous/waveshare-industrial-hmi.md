# Waveshare Industrial HMI

The Waveshare Industrial HMI is an all-in-one touch display designed for industrial environments. You can use it as a dedicated terminal to run your Heisenware Apps as Progressive Web Apps (PWAs).

This guide explains how to resolve display issues on newer Debian versions and how to configure a resilient 24/7 kiosk terminal.

### Display fix for Debian 13 (Trixie)

If you install or upgrade to Debian 13 (Trixie) 64-bit on a Raspberry Pi 5 inside a Waveshare Industrial HMI enclosure, the built-in screen and touch interface might fail to initialize during boot. The internal display remains blank while the external HDMI ports continue to output a signal.

This happens because the newer kernel and Wayland graphics stack in Trixie do not automatically detect the internal MIPI DSI connection without a defined hardware overlay in the boot configuration.

#### Prerequisites

Ensure you have:

* A Raspberry Pi 5 mounted in the Waveshare HMI enclosure.
* An external HDMI monitor and a keyboard to complete the configuration.
* Root or `sudo` access to the device.

#### Configure the DSI overlay

The Waveshare display connects to the Raspberry Pi through the internal DSI port. To activate the screen, touch digitizer, and front-facing camera, add the proprietary device tree overlays (`dtoverlay`) to the boot configuration file.

**Step 1: Access the boot configuration**

Connect an external HDMI monitor and boot the device. Open a terminal and edit the firmware configuration file:

```bash
sudo nano /boot/firmware/config.txt
```

{% hint style="info" %}
**Legacy configuration path**

Older versions of Raspberry Pi OS located this file at `/boot/config.txt`. Debian Bookworm and Trixie store it strictly in the `/boot/firmware/` directory.
{% endhint %}

**Step 2: Add the Waveshare overlays**

Scroll to the bottom of the `config.txt` file and append the specific overlay that matches your screen size.

For the 8.0-inch display:

```ini
# Enable Waveshare 8-inch DSI Panel
dtoverlay=vc4-kms-dsi-waveshare-panel,8_0_inch,dsi0
```

For the 10.1-inch display:

```ini
# Enable Waveshare 10.1-inch DSI Panel
dtoverlay=vc4-kms-dsi-waveshare-panel,10_1_inch,dsi0
```

**Step 3: Enable the internal camera (optional)**

If your HMI unit features a built-in 5MP front camera, add the following line directly below your display overlay:

```ini
# Enable built-in front camera
dtoverlay=ov5647
```

**Step 4: Save and reboot**

Save your changes (`Ctrl+O`, `Enter`) and exit the nano editor (`Ctrl+X`). Reboot the system to apply the new kernel settings:

```bash
sudo reboot
```

#### Troubleshoot the display

If the screen does not turn on after a reboot, verify that the Trixie image includes the necessary compiled overlay file by running:

```bash
ls /boot/firmware/overlays/vc4-kms-dsi-waveshare-panel.dtbo
```

If the terminal outputs a "No such file or directory" error, download the `.dtbo` file manually from the Waveshare GitHub repository, place it in the `/boot/firmware/overlays/` directory, and reboot the system.

### Kiosk setup

Configure your Industrial HMI All-in-one Touch Display (featuring a 10-point touch screen and Wayland display server) to run a resilient, 24/7 fullscreen Progressive Web App (PWA). This setup ensures persistent local storage, hides the mouse cursor for touch optimization, and disables system power-saving features.

#### Phase 1: Configure system and power settings

Configure the operating system to log in automatically and prevent the display from turning off.

1.  **Enable desktop autologin and disable screen blanking**: Open the system configuration tool:

    ```bash
    sudo raspi-config
    ```

    * Navigate to **System options** > **Boot / auto login** > **Desktop autologin**.
    * Navigate to **Display options** > **Screen blanking** > **No**.
    * Exit the tool without rebooting.
2.  **Disable hardware console blanking**: Prevent the Linux kernel from turning off the display output by editing the command-line configuration:

    ```bash
    sudo nano /boot/firmware/cmdline.txt
    ```

    Append a single space followed by `consoleblank=0` to the very end of the existing line of text. Do not create a new line. Save your changes (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`).

#### Phase 2: Optimize the touch interface

Wayland ignores legacy X11 cursor utilities. To hide the mouse cursor for a touch-only user interface, install a transparent cursor theme.

1.  **Download and install the theme**:

    ```bash
    wget [https://github.com/ebe-forks/xcursor-transparent-theme/archive/refs/heads/master.zip](https://github.com/ebe-forks/xcursor-transparent-theme/archive/refs/heads/master.zip)
    unzip master.zip
    mkdir -p ~/.local/share/icons
    mv xcursor-transparent-theme-master/xcursor-transparent ~/.local/share/icons/
    rm -rf master.zip xcursor-transparent-theme-master
    ```
2.  **Set the theme as default**:

    ```bash
    mkdir -p ~/.local/share/icons/default
    nano ~/.local/share/icons/default/index.theme
    ```

    Add the following lines, then save and exit:

    ```ini
    [Icon Theme]
    Inherits=xcursor-transparent
    ```
3.  **Force Wayland compositor recognition**:

    ```bash
    mkdir -p ~/.config/labwc
    echo "XCURSOR_THEME=xcursor-transparent" >> ~/.config/labwc/environment
    ```

    <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><p><strong>Legacy desktop environments</strong></p><p>If you run older Bookworm builds that use Wayfire, also execute:</p><pre class="language-bash"><code class="lang-bash">echo "export XCURSOR_THEME=xcursor-transparent" >> ~/.profile
    </code></pre></div>

#### Phase 3: Create the self-healing kiosk script

This script launches the browser, prevents crash-recovery popups while preserving local storage, and restarts the browser automatically if the process exits.

1.  **Create the script file**:

    ```bash
    nano ~/kiosk.sh
    ```
2.  **Add the execution logic**: Replace `https://your-specific-url.com` with the actual URL of your App.

    ```bash
    #!/bin/bash

    # Give the desktop environment and network time to initialize
    sleep 5

    # Infinite loop ensures the browser restarts automatically if it crashes
    while true; do
      # Clear crash flags to prevent the Chromium "Restore Session" bubble
      sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/Default/Preferences
      sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

      # Launch Chromium in touch-kiosk mode
      chromium-browser \
        --kiosk \
        --touch-events=enabled \
        --noerrdialogs \
        --disable-infobars \
        --disable-features=Translate \
        "[https://your-specific-url.com](https://your-specific-url.com)"

      # Wait 2 seconds before restarting if Chromium exits
      sleep 2
    done
    ```
3.  **Make the script executable**:

    ```bash
    chmod +x ~/kiosk.sh
    ```

#### Phase 4: Configure autostart

Hook the script into the Wayland display manager to launch it automatically on boot.

1.  **For labwc (Trixie and newer Bookworm)**:

    ```bash
    mkdir -p ~/.config/labwc
    echo "/home/$(whoami)/kiosk.sh" >> ~/.config/labwc/autostart
    ```
2.  **For Wayfire (older Bookworm)**: If your device runs Wayfire, edit its configuration file:

    ```bash
    nano ~/.config/wayfire.ini
    ```

    Find the `[autostart]` section and append the kiosk script path:

    ```ini
    kiosk = /home/pi/kiosk.sh
    ```

    <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><p><strong>User directory path</strong></p><p>Ensure <code>/home/pi/</code> matches your actual user directory if you changed the default Raspberry Pi username.</p></div>

#### Phase 5: Reboot the system

Reboot the system to apply all changes:

```bash
sudo reboot
```
