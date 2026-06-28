# Kiosk Setup

Target Hardware: Industrial HMI All-in-one Touch Display (10-point touch, Wayland Display Server) Objective: Run a resilient 24/7 fullscreen web application (PWA) with persistent local storage, an invisible cursor for touch optimization, and disabled power-saving features.

#### Phase 1: System & Power Configuration

First, configure the OS to automatically log in and prevent the display from ever turning off.

1.  Enable Desktop Autologin & Disable OS Blanking: Open the configuration tool:

    Bash

    ```shellscript
    sudo raspi-config
    ```

    * Navigate to System Options > Boot / Auto Login > Desktop Autologin.
    * Navigate to Display Options > Screen Blanking > No.
    * Exit the tool (do not reboot yet).
2.  Disable Hardware Console Blanking: Prevent the Linux kernel from turning off the display output.

    Bash

    ```bash
    sudo nano /boot/firmware/cmdline.txt
    ```

    Append a single space followed by `consoleblank=0` to the very end of the _existing_ line of text. Do not create a new line. Save (`Ctrl+O`, `Enter`) and exit (`Ctrl+X`).

***

#### Phase 2: Touch Interface Optimization (Invisible Cursor)

Wayland ignores legacy X11 cursor utilities. The most reliable method to hide the mouse cursor for a touch-only UI is using a transparent cursor theme.

1.  Download and Install the Theme:

    Bash

    ```bash
    wget https://github.com/ebe-forks/xcursor-transparent-theme/archive/refs/heads/master.zip
    unzip master.zip
    mkdir -p ~/.local/share/icons
    mv xcursor-transparent-theme-master/xcursor-transparent ~/.local/share/icons/
    rm -rf master.zip xcursor-transparent-theme-master
    ```
2.  Set as Default Theme:

    Bash

    ```bash
    mkdir -p ~/.local/share/icons/default
    nano ~/.local/share/icons/default/index.theme
    ```

    Add the following contents, then save and exit:

    Ini, TOML

    ```ini
    [Icon Theme]
    Inherits=xcursor-transparent
    ```
3.  Force Wayland Compositor Recognition:

    Bash

    ```bash
    mkdir -p ~/.config/labwc
    echo "XCURSOR_THEME=xcursor-transparent" >> ~/.config/labwc/environment
    ```

    _(Note: For older Bookworm builds still using Wayfire, also run: `echo "export XCURSOR_THEME=xcursor-transparent" >> ~/.profile`)_

***

#### Phase 3: The Self-Healing Kiosk Script

This script launches the browser, prevents crash-recovery popups (while maintaining local storage), and automatically restarts the browser if the process dies.

1.  Create the Script:

    Bash

    ```bash
    nano ~/kiosk.sh
    ```
2.  Add the following logic: _(Replace `https://your-specific-url.com` with your HMI's actual URL)_

    Bash

    ```bash
    #!/bin/bash

    # Give the desktop environment and network time to initialize
    sleep 5

    # Infinite loop ensures the browser restarts automatically if it crashes
    while true; do
      # Clear crash flags to prevent the Chromium "Restore Session" bubble
      sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/Default/Preferences
      sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences

      # Launch Chromium in Touch-Kiosk Mode
      chromium-browser \
        --kiosk \
        --touch-events=enabled \
        --noerrdialogs \
        --disable-infobars \
        --disable-features=Translate \
        "https://your-specific-url.com"

      # If Chromium crashes/exits, wait 2 seconds before restarting
      sleep 2
    done
    ```
3.  Make the Script Executable:

    Bash

    ```bash
    chmod +x ~/kiosk.sh
    ```

***

#### Phase 4: Autostart Configuration

Hook the script into the Wayland display manager so it launches automatically on boot.

1.  For labwc (Trixie and newer Bookworm):

    Bash

    ```bash
    mkdir -p ~/.config/labwc
    echo "/home/$(whoami)/kiosk.sh" >> ~/.config/labwc/autostart
    ```
2.  For Wayfire (Older Bookworm): If a device runs Wayfire, edit the config:

    Bash

    ```bash
    nano ~/.config/wayfire.ini
    ```

    Find the `[autostart]` section and add:

    Ini, TOML

    ```ini
    kiosk = /home/pi/kiosk.sh
    ```

    _(Ensure `/home/pi/` matches your actual user directory if you changed the default username)._

#### Phase 5: Finalization

Reboot the system to apply all changes:

Bash

```bash
sudo reboot
```
