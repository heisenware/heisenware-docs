# Kiosk on a Waveshare HMI

The Waveshare Industrial HMI is an all-in-one touch display for industrial environments: a Raspberry Pi 5 behind a DSI panel. It makes a good terminal for an [App](README.md) at a machine, for worker guidance or for counting.

This page is field experience: how to get the built-in display working on Debian 13, and how to turn the device into a kiosk that runs for months without a keyboard.

{% hint style="info" %}
#### There is a script

Heisenware has a provisioning script, `setup-kiosk.sh` with a `kiosk.conf`, that does the whole kiosk part below in one pass: host name, Wi-Fi, time zone, autologin, screen blanking, the kiosk script and the autostart. Ask support for it. The steps below are what it does, and what to fall back on when something goes wrong.
{% endhint %}

## Display fix for Debian 13 (Trixie)

If you install or upgrade to Debian 13 (Trixie) 64-bit on a Raspberry Pi 5 inside a Waveshare Industrial HMI enclosure, the built-in screen and touch interface may fail to initialize during boot. The internal display stays blank while the external HDMI ports keep a signal.

The newer kernel and Wayland stack in Trixie do not detect the internal MIPI DSI connection without a hardware overlay in the boot configuration.

### Prerequisites

* A Raspberry Pi 5 mounted in the Waveshare HMI enclosure.
* An external HDMI monitor and a keyboard, to do the configuration.
* Root or `sudo` access on the device.

### Configure the DSI overlay

The display hangs on the internal DSI port. To bring up the screen, the touch digitizer and the front camera, add the vendor's device tree overlays (`dtoverlay`) to the boot configuration.

#### Step 1: Open the boot configuration

Connect the HDMI monitor, boot the device, open a terminal and edit the firmware configuration:

```bash
sudo nano /boot/firmware/config.txt
```

{% hint style="info" %}
#### Older path

Older versions of Raspberry Pi OS kept this file at `/boot/config.txt`. Debian Bookworm and Trixie keep it in `/boot/firmware/` only.
{% endhint %}

#### Step 2: Add the overlay for your panel

Append the line that matches your screen size at the end of the file.

For the 8.0-inch display:

```ini
dtoverlay=vc4-kms-dsi-waveshare-panel,8_0_inch,dsi0
```

For the 10.1-inch display:

```ini
dtoverlay=vc4-kms-dsi-waveshare-panel,10_1_inch,dsi0
```

#### Step 3: Enable the internal camera (optional)

If your unit has the built-in 5 MP front camera, add this line directly below the display overlay:

```ini
dtoverlay=ov5647
```

#### Step 4: Save and reboot

Save (`Ctrl+O`, `Enter`), leave nano (`Ctrl+X`) and reboot:

```bash
sudo reboot
```

### When the screen stays dark

Check that the Trixie image carries the compiled overlay:

```bash
ls /boot/firmware/overlays/vc4-kms-dsi-waveshare-panel.dtbo
```

On "No such file or directory", download the `.dtbo` from the Waveshare GitHub repository, put it in `/boot/firmware/overlays/` and reboot.

## Kiosk setup

A kiosk shows one App full screen, keeps its local storage, hides the cursor, never blanks, and comes back by itself. Five steps, on a device with a 10-point touch screen and a Wayland display server.

### Phase 1: System and power

1.  **Autologin and no screen blanking**:

    ```bash
    sudo raspi-config
    ```

    * **System options** > **Boot / auto login** > **Desktop autologin**.
    * **Display options** > **Screen blanking** > **No**.
    * Leave the tool without rebooting.

    Non-interactively, which is what a fleet wants:

    ```bash
    sudo raspi-config nonint do_boot_behaviour B4
    sudo raspi-config nonint do_blanking 1
    ```
2.  **Stop the kernel blanking the console**:

    ```bash
    sudo nano /boot/firmware/cmdline.txt
    ```

    Append a space and `consoleblank=0` to the end of the existing line. Do not start a new line. Save (`Ctrl+O`, `Enter`) and leave (`Ctrl+X`).

### Phase 2: Hide the cursor

Wayland ignores the old X11 cursor utilities. Install a transparent cursor theme instead.

1.  **Install the theme**:

    ```bash
    wget "https://github.com/ebe-forks/xcursor-transparent-theme/archive/refs/heads/master.zip"
    unzip master.zip
    mkdir -p ~/.local/share/icons
    mv xcursor-transparent-theme-master/xcursor-transparent ~/.local/share/icons/
    rm -rf master.zip xcursor-transparent-theme-master
    ```
2.  **Make it the default**:

    ```bash
    mkdir -p ~/.local/share/icons/default
    nano ~/.local/share/icons/default/index.theme
    ```

    Put these lines in, save and leave:

    ```ini
    [Icon Theme]
    Inherits=xcursor-transparent
    ```
3.  **Tell the compositor**:

    ```bash
    mkdir -p ~/.config/labwc
    echo "XCURSOR_THEME=xcursor-transparent" >> ~/.config/labwc/environment
    ```

    <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><h4>Older desktops</h4><p>On older Bookworm builds, which use Wayfire, also run:</p><pre class="language-bash"><code class="lang-bash">echo "export XCURSOR_THEME=xcursor-transparent" >> ~/.profile
    </code></pre></div>

### Phase 3: The kiosk script

The script waits for the network and the App, launches the browser, keeps the crash-recovery bubble away without throwing the local storage away, and restarts the browser when it exits or when the App never booted.

1.  **Create the file**:

    ```bash
    nano ~/kiosk.sh
    ```
2.  **Put this in**, with the URL of your [App](README.md) in place of the placeholder. You find it in the Builder's version dialog and on the App's page in the App Manager: `https://<host>/app/<domain>/<appId>`.

    ```bash
    #!/bin/bash

    APP_URL="https://acme.heisenware.cloud/app/acme.default/pkg2-line"

    exec > "$HOME/kiosk-debug.log" 2>&1
    set -x

    # give the desktop and the network a moment
    sleep 5

    # rotate the panel inside the Wayland session: normal, 90, 180, 270
    ROTATION=normal
    if command -v wlr-randr >/dev/null 2>&1 && [ "$ROTATION" != "normal" ]; then
      OUTPUT=$(wlr-randr | head -n 1 | awk '{print $1}')
      [ -n "$OUTPUT" ] && wlr-randr --output "$OUTPUT" --transform "$ROTATION"
    fi

    while true; do
      # the app must answer before the browser opens it: a first load over a
      # network that is not up yet leaves a white page that never recovers
      until curl -fsS -o /dev/null --max-time 10 "$APP_URL"; do sleep 3; done

      # clear the crash flags and the lock files, keep the local storage
      sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' ~/.config/chromium/Default/Preferences 2>/dev/null
      sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' ~/.config/chromium/Default/Preferences 2>/dev/null
      rm -f ~/.config/chromium/Singleton* 2>/dev/null

      # the executable is called differently on Bookworm and Trixie
      if command -v chromium-browser >/dev/null 2>&1; then
        BROWSER=chromium-browser
      else
        BROWSER=chromium
      fi

      $BROWSER \
        --kiosk \
        --no-first-run \
        --touch-events=enabled \
        --noerrdialogs \
        --disable-infobars \
        --password-store=basic \
        --disable-sync \
        --disable-features=Translate,CalculateNativeWinOcclusion \
        --disable-background-timer-throttling \
        --disable-renderer-backgrounding \
        --disable-dev-shm-usage \
        "$APP_URL"

      sleep 2
    done
    ```
3.  **Make it executable**:

    ```bash
    chmod +x ~/kiosk.sh
    ```

{% hint style="warning" %}
#### Changing the URL needs clean storage

A device that pointed at another App or another server keeps that Player's service worker, which serves the old Player out of its cache. When the server then refuses its login, the device reloads forever on a white page. Before you change the URL, stop the browser and clear its storage:

```bash
pkill -f kiosk.sh; pkill -f chromium; sleep 2
rm -rf ~/.config/chromium/Default/"Service Worker" \
       ~/.config/chromium/Default/"Local Storage" \
       ~/.config/chromium/Default/"Session Storage" \
       ~/.config/chromium/Default/IndexedDB ~/.cache/chromium
```
{% endhint %}

### Phase 4: Autostart

Hook the script into the Wayland compositor the device runs.

1.  **labwc (Trixie and newer Bookworm)**:

    ```bash
    mkdir -p ~/.config/labwc
    echo "$HOME/kiosk.sh" >> ~/.config/labwc/autostart
    chmod +x ~/.config/labwc/autostart
    ```
2.  **Wayfire (older Bookworm)**: edit its configuration file:

    ```bash
    nano ~/.config/wayfire.ini
    ```

    Find the `[autostart]` section and append the script:

    ```ini
    kiosk = /home/pi/kiosk.sh
    ```

    <div data-gb-custom-block data-tag="hint" data-style="info" class="hint hint-info"><h4>User directory</h4><p>Make <code>/home/pi/</code> match your actual user directory if you changed the default Raspberry Pi user name.</p></div>

Writing both costs nothing and makes one image work on either release.

### Phase 5: Reboot

```bash
sudo reboot
```

## Who the device is

A kiosk has no person signing in, so give the device an identity instead: a login of its own, named after the machine it stands at. `$USER` then holds that name in every run, and a query can filter by it, so one App serves every terminal and each shows its own machine. See [Users and access](../app-manager/users-and-access.md).

Deploy the App before the first device opens its URL: that URL serves the deployed release and nothing else.
