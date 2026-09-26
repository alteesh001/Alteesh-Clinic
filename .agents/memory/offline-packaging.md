---
name: Offline wrapper packaging
description: Constraints for producing Android and Windows wrappers for this offline clinic app.
---

The web build is the source bundle for both Capacitor and Electron. Android sync can run in the workspace after adding the Android platform; Windows NSIS packaging needs a Windows host or Wine because electron-builder can create the unpacked executable but cannot finish the installer without Wine.

**Why:** The Replit build environment is Linux and does not include Wine, while the application itself remains fully buildable and testable as a local web app.

**How to apply:** Keep the wrapper scripts and configs in the clinic artifact, report wrapper build limitations honestly, and do not claim an EXE installer was produced unless the NSIS step succeeds.