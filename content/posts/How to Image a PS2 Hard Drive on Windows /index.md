---
date: 2026-02-10
title: How to Image a PS2 Hard Drive on Windows
weight: 10
tags:
  - PS2
  - HDD
  - Image
  - Digital Conservation
---
## What you need

- The PS2 hard drive (3.5" IDE/PATA drive from the PS2 Network Adapter)
- A **USB-to-IDE adapter** (also called USB-to-PATA). These are cheap ($10–15) and widely available — search "USB to IDE adapter" on Amazon. Many come as "USB to IDE/SATA" combo cables. You want one that supports 3.5" drives (with the Molex power connector or external power brick).
- A Windows PC with a USB port
- **HDD Raw Copy Tool** (free) — download from: https://hddguru.com/software/HDD-Raw-Copy-Tool/

## Step-by-step

### 1. Connect the PS2 

- Plug the IDE ribbon cable from the USB adapter into the PS2 hard drive's IDE connector (the wide 40-pin connector)
- Connect the power cable (Molex 4-pin) to the drive — most USB-to-IDE adapters include a power brick for this
- Plug the USB end into your PC
- **Do NOT format the drive** if Windows asks — click Cancel/No on any format prompts. Windows cannot read the PS2 filesystem and will think the driveis blank. It isn't.

### 2. Install HDD Raw Copy Tool

- Download from the link above (it's a small portable .exe, no real install needed)
- Run it as Administrator (right-click > Run as administrator)

### 3. Select the source PS2 drive

- In the first screen ("SOURCE"), you'll see a list of all connected drives
- The PS2 drive will show up as something like "ST340015A" or similar, usually with no partition info
- Select it and click "Continue"
- **Be very careful** to pick the right drive — do NOT pick your Windows boot drive!

### 4. Select the destination image file

- In the next screen ("TARGET"), double-click on "FILE" at the bottom of the list
- Choose a save location and filename, like PS2\_HDD.img
- Make sure you have enough free space — the image will be the full size of the PS2 drive (typically 40 GB)

- If you want to compress it, you can choose .imgc extension for built-in compression, which will shrink it significantly (empty space compresses well)

### 5. Start the copy

- Click "Continue", then "START"
- The copy will take a while depending on USB speed — expect 1–3 hours for a 40 GB drive over USB 2.0
- Let it finish completely — don't unplug anything during the copy

### 6. Verify and share

- Once done, you should have a .img file (or .imgc if compressed)
- If not compressed, you can compress it with 7-Zip before sharing (right-click > 7-Zip > Add to archive, choose .7z format with Ultracompression) — a 40 GB image typically compresses down to 1–3 GB
- Upload to Google Drive, Mega, or wherever is convenient for sharing

## Troubleshooting

- **Drive not detected:** Make sure the power cable is connected to the drive (3.5" IDE drives need external power, they can't be powered by USBalone)
- **Windows asks to format:** Always click Cancel. The drive has a PS2-specific partition table (APA format) that Windows doesn't understand
- **"Access denied" errors:** Make sure you're running HDD Raw Copy Tool as Administrator
- **Multiple drives showing up:** Look at the drive size to identify the PS2 drive — PS2 HDDs were typically 40 GB Maxtor or Seagate drives

## Comments
 {{< chat PostImagingPS2HDDs >}} 