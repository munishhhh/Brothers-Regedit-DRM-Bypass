<p align="center">
  <img src="icon.png" width="120" alt="Brothers Regedit DRM Bypass Logo">
</p>

<h1 align="center">Brothers Regedit DRM Bypass</h1>

<p align="center">
  <strong>High-performance Chromium Extension for Discord & OBS ScreenShare Black Screen Elimination</strong>
</p>

<p align="center">
  <a href="https://github.com/munishhhh/Brothers-Regedit-DRM-Bypass">GitHub</a> &bull;
  <a href="https://discord.gg/Qtj8wHjF6Z">Discord Server</a> &bull;
  <a href="https://instagram.com/brothersregedit">Instagram</a>
</p>

---

## Overview

**Brothers Regedit DRM Bypass** is a Manifest V3 browser extension engineered to eliminate black screen issues when screen sharing protected streaming media on Discord, OBS Studio, Zoom, and other streaming software.

When streaming OTT platforms (such as JioHotstar, Netflix, Prime Video, Apple TV+, Zee5, Crunchyroll, and Disney+), web browsers render protected video streams on a separate hardware-accelerated overlay plane (DirectComposition / DirectX). Screen-capturing applications capture Chrome's standard window frame buffer, resulting in a blank black box where the video should appear.

This extension intercepts HTML5 `<video>` elements across all frames and Shadow DOM boundaries, applying micro-compositing directives that force Chrome to render video streams inside the captured window buffer without interrupting HD/4K playback or DRM key negotiation.

---

## Key Features

- **Universal OTT Platform Support:** Operates seamlessly across all websites (`<all_urls>`), including JioHotstar, Netflix, Prime Video, Apple TV+, Zee5, Crunchyroll, Disney+, AHA, FanCode, HBO Max, Spotify, and YouTube Movies.
- **Shadow DOM Video Detection:** Dynamically detects `<video>` elements rendered inside isolated Web Components and closed Shadow Roots via continuous MutationObserver tracking.
- **Zero Resolution Impact:** Composites video frames with near-zero overhead, retaining native 1080p, 4K HDR, and 60 FPS playback quality.
- **Interactive Quick Launch Dashboard:** Built-in glassmorphic popup popup interface with 1-click launch tiles for major streaming platforms.
- **Custom Platform Launcher:** Integrated search bar with instant URL navigation and quick platform tags for niche OTT portals.
- **Dynamic Protection Toggle:** Toggle bypass protection on demand with real-time UI state feedback (Green for Active, Red for Paused) and auto-tab refresh.

---

## How It Works

1. **Overlay Layer Interception:** When protected media loads, Chrome routes the decoded video stream to an hardware overlay plane.
2. **CSS Hardware Composition Bypass:** The extension injects non-destructive compositing hints:
   ```css
   video {
       filter: sepia(0.0001%) opacity(99.99%) !important;
       opacity: 0.9999 !important;
       mix-blend-mode: normal !important;
       transform: translateZ(0) !important;
       will-change: filter, opacity, transform !important;
   }
   ```
3. **Frame Buffer Integration:** Forcing sub-pixel opacity and Z-axis translation forces the Chromium graphics pipeline to merge the video layer back into the main document surface, enabling Discord and OBS window capture to record the video content cleanly.

---

## Supported Platforms

| Platform | Web Domain | Status |
| :--- | :--- | :--- |
| **JioHotstar** | `jiohotstar.com` | Supported |
| **Netflix** | `netflix.com` | Supported |
| **Prime Video** | `primevideo.com` | Supported |
| **Apple TV+** | `tv.apple.com` | Supported |
| **Zee5** | `zee5.com` | Supported |
| **Crunchyroll** | `crunchyroll.com` | Supported |
| **Disney+** | `hotstar.com` / `disneyplus.com` | Supported |
| **Universal / Others** | Custom URLs & Web Media Players | Supported |

---

## Installation Guide

1. Download or clone this repository to your local machine:
   ```bash
   git clone https://github.com/munishhhh/Brothers-Regedit-DRM-Bypass
   ```
2. Open Google Chrome or any Chromium-based browser (Brave, Edge, Opera).
3. Navigate to `chrome://extensions` in your address bar.
4. Enable **Developer mode** using the toggle in the upper right corner.
5. Click **Load unpacked** in the top left toolbar.
6. Select the `Brothers Regedit DRM Bypass` project directory.
7. Open any streaming site or click a quick launch tile in the extension popup to start screen sharing without black screen issues.

---

## Project Structure

```
Brothers Regedit DRM Bypass/
├── manifest.json              # Extension Manifest V3 configuration
├── background.js              # Background service worker & declarativeNetRequest rules
├── injected.js                # Core DOM & Shadow DOM video compositing engine
├── popup.html                 # 8-Tile Quick Launch & Search Bar Dashboard UI
├── popup.css                  # Ultra-HD glassmorphic dark theme stylesheet
├── popup.js                   # Interactive tab launcher & dynamic theme controller
├── icon.png                   # Transparent 3D main header logo
└── *.png                      # 1000x1000 Ultra-HD 3D platform brand icons
```

---

## Community & Support

For technical support, feature requests, or community updates:

- **Discord Community:** [Join Official Discord Server](https://discord.gg/Qtj8wHjF6Z)
- **Instagram:** [@brothersregedit](https://instagram.com/brothersregedit)
- **GitHub Repository:** [Brothers Regedit DRM Bypass](https://github.com/npapoutsakis/netflix-screenshare-fix)

