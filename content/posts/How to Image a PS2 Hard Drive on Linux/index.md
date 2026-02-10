---
date: 2026-02-10
title: How to Image a PS2 Hard Drive on Linux
weight: 10
tags:
  - PS2
  - HDD
  - Image
  - Digital Conservation
  - Linux
---
## What you need

- The PS2 hard drive (3.5" IDE/PATA drive from the PS2 Network Adapter)
- A **USB-to-IDE adapter** (also called USB-to-PATA). These are cheap ($10–15) and widely available — search "USB to IDE adapter" on Amazon. Many come as "USB to IDE/SATA" combo cables. You want one that supports 3.5" drives (with the Molex power connector or external power brick).
- A Linux PC with a USB port (any distro works — Ubuntu, Fedora, Arch, whatever you've got)
- **No extra software needed** — everything is built in (`dd`, `lsblk`, `gzip`/`7z`)

## Step-by-step

### 1. Connect the PS2 drive

- Plug the IDE ribbon cable from the USB adapter into the PS2 hard drive's IDE connector (the wide 40-pin connector)
- Connect the power cable (Molex 4-pin) to the drive — most USB-to-IDE adapters include a power brick for this
- Plug the USB end into your PC
- Linux won't try to auto-format the drive, but if your desktop environment pops up a "mount" prompt, just dismiss it. **Do NOT attempt to mount or format the drive.** Linux can't read the PS2 filesystem (APA partition format) and that's fine — you're imaging the raw bytes.

### 2. Identify the PS2 drive

Open a terminal and run:

```bash
lsblk -o NAME,SIZE,MODEL,TRAN
```

You'll see output like:

```
NAME   SIZE MODEL            TRAN
sda    500G Samsung SSD 870  sata
├─sda1 512M
├─sda2 499.5G
sdb     40G ST340015A        usb    <-- this is your PS2 drive
```

The PS2 drive will typically be:
- Connected via `usb` (shown in the TRAN column)
- Around 40 GB in size
- A Maxtor or Seagate model (common PS2 HDD brands)
- Have **no partitions** listed under it (or unrecognized ones)

You can also run `sudo fdisk -l /dev/sdb` to confirm — it will likely say the disk doesn't contain a recognized partition table. That's expected.

**Be absolutely sure you have the right device.** Double-check the size and model. If you're unsure, run `lsblk` *before* plugging in the PS2 drive, then again *after* — the new entry is your PS2 drive.

### 3. Image the drive with dd

```bash
sudo dd if=/dev/sdb of=~/PS2_HDD.img bs=4M status=progress
```

Breaking that down:
- `if=/dev/sdb` — input file (source: the PS2 drive). Change `sdb` to whatever yours actually is.
- `of=~/PS2_HDD.img` — output file (destination: the image file in your home directory)
- `bs=4M` — read/write 4 MB at a time (much faster than the default 512 bytes)
- `status=progress` — shows a live progress readout so you're not staring at a blank screen for 2 hours

Make sure you have enough free space — the image will be the full size of the PS2 drive (typically 40 GB).

This will take a while depending on USB speed — expect 1–3 hours for a 40 GB drive over USB 2.0. Let it finish completely. **Don't unplug anything.**

When it's done you'll see something like:

```
40020664320 bytes (40 GB, 37 GiB) copied, 3845.12 s, 10.4 MB/s
```

### 4. Verify the image

Generate a checksum so others can verify the image isn't corrupted:

```bash
sha256sum ~/PS2_HDD.img > ~/PS2_HDD.img.sha256
```

### 5. Compress before uploading

A raw 40 GB image is mostly empty space and compresses extremely well. Use `7z` for best compression:

```bash
7z a -mx=9 ~/PS2_HDD.7z ~/PS2_HDD.img
```

If you don't have `7z` installed:
- **Debian/Ubuntu:** `sudo apt install p7zip-full`
- **Fedora:** `sudo dnf install p7zip p7zip-plugins`
- **Arch:** `sudo pacman -S p7zip`

A 40 GB image typically compresses down to 1–3 GB. This will take a while and use a good amount of RAM at max compression. If that's a problem, drop `-mx=9` to `-mx=7`, or just use gzip instead:

```bash
gzip -k ~/PS2_HDD.img
```

gzip is faster but produces larger files — expect ~3–6 GB instead of 1–3 GB.

### 6. Upload to Internet Archive

Head to [archive.org](https://archive.org) and create a free account if you don't have one. Then:

- Click **Upload** in the top right
- Drag in your `.7z` file (and the `.sha256` file)
- For metadata:
  - **Title:** something like "PS2 Hard Drive Image — FFXI (Dec 2006)"
  - **Description:** describe what's on the drive — game title, region, approximate era/patch level, any notes about completeness
  - **Subject tags:** `PS2`, `FFXI`, `Final Fantasy XI`, `HDD image`, `preservation`
  - **Collection:** "Community Software" or "Community Data"
- Hit **Upload** and let it finish

Internet Archive is free, permanent, and designed for exactly this kind of preservation.

## Troubleshooting

- **Drive not detected (`lsblk` doesn't show it):** Make sure the power cable is connected — 3.5" IDE drives need external power, USB alone won't do it. Check `dmesg | tail -20` right after plugging in to see if the kernel recognized the device.
- **"Permission denied" on dd:** Use `sudo`. Raw disk access requires root.
- **dd is painfully slow:** Make sure you're using `bs=4M` (not the default 512 bytes). USB 2.0 tops out around 30 MB/s regardless. If your adapter and PC both support USB 3.0, use a USB 3.0 port.
- **Not sure which drive is which:** Run `lsblk` before plugging in the PS2 drive, then again after. The new entry is your PS2 drive. Or check `dmesg | tail` to see what device name the kernel assigned.
- **Not enough disk space for the full image:** You can pipe `dd` directly into compression to skip the uncompressed intermediate file: `sudo dd if=/dev/sdb bs=4M status=progress | 7z a -si ~/PS2_HDD.7z` — but this is slower and you can't easily verify the raw image afterward.

## Comments
 {{< chat PostImagingPS2HDDsLinux >}}
