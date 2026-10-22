<div align="center">

<img src="public/deki.png" width="250" alt="DeckMe Mascot" />

# DeckMe!

*"It was for personal use but meh why not share it?"*

DeckMe is an AnkiDeck inspired Application for both Desktop and Mobile Devices. Its main use is to help students and others alike to read quick notes and memorize information for upcoming tests and such.

[![Release](https://img.shields.io/github/v/release/novakamiii/DeckMe?color=344E41&labelColor=DAD7CD&style=flat-square)](https://github.com/novakamiii/DeckMe/releases)
[![License](https://img.shields.io/github/license/novakamiii/DeckMe?color=344E41&labelColor=DAD7CD&style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/novakamiii/DeckMe?color=344E41&labelColor=DAD7CD&style=flat-square)](https://github.com/novakamiii/DeckMe/stargazers)

[English](README.md) · [Changelog](CHANGELOG.md) · [Report Bug](https://github.com/novakamiii/DeckMe/issues)

</div>

<p align="center">
  <a href="https://deck-me.vercel.app/">
    <img alt="Try DeckMe on the Web — no install required" src="https://img.shields.io/badge/%F0%9F%8C%90_Try_DeckMe_on_the_Web-No_install_required-344E41?style=for-the-badge&logo=googlechrome&logoColor=white">
  </a>
</p>

---

## ✨ Features

- **🤖 AI-Powered Conversion**: Simply copy our optimized AI prompt, paste it into your favorite LLM (Claude recommended), and get perfectly structured flashcard JSONs.
- **📱 Cross-Platform**: Study anywhere. Native builds available for Windows, Linux, Android, and iOS (coming soon?).
- **🧘 Zen Mode**: A distraction-free interface designed for deep focus and active recall.
- **⏱️ Pomodoro Integration**: Built-in timer to keep your study sessions structured and productive.
- **📊 Performance Analytics**: Track your progress with detailed charts and time-tracking statistics.
- **🌿 Aesthetic Design**: Premium "Brunswick Green" palette with a modern, responsive UX.

---

### 📥 Download

<div align="center">

<a href="https://github.com/novakamiii/DeckMe/releases/latest">
  <img src="https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white" alt="Windows" height="40" />
</a>
<a href="https://github.com/novakamiii/DeckMe/releases/latest">
  <img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Linux" height="40" />
</a>
<a href="https://github.com/novakamiii/DeckMe/releases/latest">
  <img src="https://img.shields.io/badge/macOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="macOS" height="40" />
</a>
<a href="https://github.com/novakamiii/DeckMe/releases/latest">
  <img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android" height="40" />
</a>

</div>

---

### 🐧 Arch Linux

Download the `.pkg.tar.zst` from the [Releases](https://github.com/novakamiii/DeckMe/releases) page, then install it with:

```sh
sudo pacman -U deckme-1.0.9-1-x86_64.pkg.tar.zst
```

(Replace the version number for other releases, or use `deckme-*.pkg.tar.zst`.)

> **Note:** This app is not yet available on the AUR, as account registration is currently closed. A proper AUR package will be published in the near future.

---

## 📸 Snapshots

<div align="center">

### **Desktop**

| ![Welcome Screen](public/previews/1.png) | ![Study Session](public/previews/2.png) |
| :---: | :---: |
| **Smart Onboarding** | **Active Recall Deck** |
| ![Statistics](public/previews/3.png) | ![Notes View](public/previews/4.png) |
| **Progress Tracking** | **Structured Notes** |

</div>

<div align="center">

### **Mobile**

| <img src="public/previews/1m.jpg" width="200" /> | <img src="public/previews/2m.jpg" width="200" /> |
| :---: | :---: |
| **Smart Onboarding** | **Active Recall Deck** |
| <img src="public/previews/3m.jpg" width="200" /> | <img src="public/previews/4m.jpg" width="200" /> |
| **Progress Tracking** | **Structured Notes** |

</div>

---

## 🚀 Getting Started

### 1. Installation
Download the latest version for your platform from the [Releases](https://github.com/novakamiii/DeckMe/releases) page.

### 2. Prepare Your Decks
1. Copy the **AI Prompt** from the Welcome screen.
2. Paste it into an AI (like Claude) along with your notes or files.
3. Upload the generated JSON back into DeckMe!

### 3. Start Studying
Select your subject from the sidebar and choose between **Notes View** for review or **Deck View** for active recall.

---

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Native**: [Tauri](https://tauri.app/) (Desktop) & [Capacitor](https://capacitorjs.com/) (Mobile)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Charts & Icons**: [Recharts](https://recharts.org/) & [Lucide React](https://lucide.dev/)

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the Apache License 2.0. See `LICENSE` for more information.
