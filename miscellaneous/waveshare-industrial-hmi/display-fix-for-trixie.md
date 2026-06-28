# Display Fix for Trixie

### Overview

When installing or upgrading to Debian 13 (Trixie) 64-bit on a Raspberry Pi 5 inside a Waveshare Industrial HMI enclosure, the built-in screen and touch interface may fail to initialize on boot.

While the external HDMI ports will continue to output a signal, the internal display remains blank. This occurs because Trixie's newer kernel and Wayland graphics stack do not automatically detect the internal MIPI DSI connection without explicitly defining the hardware overlay in the boot configuration.

### Prerequisites

* Raspberry Pi 5 mounted in the Waveshare HMI enclosure.
* An external HDMI monitor and keyboard (for configuration).
* Root / Sudo access to the device.

### Solution: Configuring the DSI Overlay

The Waveshare display interfaces with the Raspberry Pi via the internal DSI port. To wake up the screen, touch digitizer, and front-facing camera, you must add the proprietary device tree overlays (`dtoverlay`) to the Pi's boot configuration file.

#### Step 1: Access the Boot Configuration

Connect your external HDMI monitor and boot the device. Open a terminal and edit the firmware configuration file:

```bash
sudo nano /boot/firmware/config.txt
```

> Note: On older versions of Raspberry Pi OS, this file was located at `/boot/config.txt`. On Debian Bookworm and Trixie, it is strictly located in the `/boot/firmware/` directory.

#### Step 2: Add the Waveshare Overlays

Scroll to the bottom of the `config.txt` file and append the specific overlay for your screen size.

For the 8.0-inch Display:

```ini
# Enable Waveshare 8-inch DSI Panel
dtoverlay=vc4-kms-dsi-waveshare-panel,8_0_inch,dsi0
```

For the 10.1-inch Display:

```ini
# Enable Waveshare 10.1-inch DSI Panel
dtoverlay=vc4-kms-dsi-waveshare-panel,10_1_inch,dsi0
```

#### Step 3: Enable the Internal Camera (Optional)

If your HMI unit features the built-in 5MP front camera, add the following line just below your display overlay:

```ini
# Enable built-in front camera
dtoverlay=ov5647
```

#### Step 4: Save and Reboot

Save your changes (`Ctrl+O`, `Enter`) and exit the nano editor (`Ctrl+X`). Reboot the system to apply the new kernel mode settings:

```shellscript
sudo reboot
```

### Troubleshooting

"No such file or directory" for the `.dtbo` file: If the screen still does not turn on, verify that the Trixie image includes the necessary compiled overlay file by running:

```shellscript
ls /boot/firmware/overlays/vc4-kms-dsi-waveshare-panel.dtbo
```

If the file is missing (common in generic Debian arm64 images), you will need to manually download the `.dtbo` file from the Waveshare GitHub repository and place it in the `/boot/firmware/overlays/` directory before rebooting.
