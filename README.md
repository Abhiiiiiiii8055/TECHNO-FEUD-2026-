# Techno Feud 2026 🚀

A premium, interactive web-based game show experience inspired by "Family Feud". This project features strict ID-based question ordering, dynamic UI scaling for any number of options, and a sleek glassmorphism aesthetic.

## ✨ Features

- **Dynamic Question Board**: Automatically adjusts its layout based on the number of options in the JSON data.
- **Glassmorphism Design**: Modern, premium UI with smooth 3D flip animations and blurred backgrounds.
- **Difficulty Settings**: Toggle between "Easy" and "Hard" modes, each loading from its own JSON dataset.
- **Strict Ordering**: Questions are sorted and displayed precisely by their unique ID.
- **Interactive Controls**: 
    - Previous/Next navigation.
    - "Flip All" toggle.
    - Keyboard support (Arrow keys).
- **Responsive**: Works perfectly on mobile, tablet, and desktop.

## 🛠️ Technology Stack

- **HTML5**: Semantic structure.
- **Vanilla CSS3**: Custom properties, Flexbox/Grid, and 3D transforms.
- **Vanilla JavaScript**: Fetch API, DOM manipulation, and state management.

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/itz-dev-tasavvuf/TECHNO-FEUD-2026-.git
   ```

2. **Run it locally:**
   Since the app uses the `Fetch API` to load JSON files, it needs to be served via a web server.
   - Using Python: `python3 -m http.server`
   - Using Node.js: `npx serve .`
   - Or use VS Code's **Live Server** extension.

## 📂 Project Structure

- `index.html`: The main skeletal structure.
- `style.css`: Premium styling, glassmorphism, and animations.
- `script.js`: Core game logic and dynamic rendering.
- `easyqustion.json`: Dataset for easy difficulty.
- `hardqustion.json`: Dataset for hard difficulty.

## 📝 License

This project is open-source and free to use.
