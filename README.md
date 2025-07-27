# 📸 Screeny - Beautiful Screenshot Editor

<div align="center">
  
  [![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Powered by React](https://img.shields.io/badge/Powered%20by-React%2019-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  
  **Transform your screenshots into stunning visuals with beautiful backgrounds, shadows, and effects.**
  
  [✨ Try Live Demo](https://screeny.dev) • [🐛 Report Bug](https://github.com/okwasniewski/screeny.dev/issues) • [💡 Request Feature](https://github.com/okwasniewski/screeny.dev/issues)

</div>

<img src="https://github.com/user-attachments/assets/1d21f483-9765-457f-956b-bbee36907885" width="100%" />

---

## 🌟 Features

- **🎨 Beautiful Backgrounds**: Choose from 15+ stunning gradient and solid backgrounds
- **⚡ Instant Preview**: Real-time preview as you customize your screenshot
- **🖼️ Smart Framing**: Adjustable padding, border radius, and shadow effects
- **📋 Easy Sharing**: Download as PNG or copy directly to clipboard
- **🎯 Drag & Drop**: Simply drag your screenshot or paste with Cmd/Ctrl+V
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **🌙 Dark Mode**: Built-in dark/light theme support
- **⚡ Fast & Lightweight**: Optimized performance with Zustand state management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/screeny.git
   cd screeny
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see your app running! 🎉

## 📖 How to Use

1. **Upload Your Screenshot**

   - Drag and drop an image file
   - Click to browse and select a file
   - Paste an image from clipboard (Cmd/Ctrl+V)

2. **Customize Your Design**

   - Choose from beautiful gradient backgrounds
   - Adjust border radius for rounded corners
   - Set padding for perfect spacing
   - Fine-tune shadow effects (offset, blur, opacity)

3. **Export Your Creation**
   - Download as high-quality PNG
   - Copy directly to clipboard for instant sharing

## 🛠️ Tech Stack

| Technology       | Purpose               | Version |
| ---------------- | --------------------- | ------- |
| **Next.js**      | React Framework       | 15.2.4  |
| **React**        | UI Library            | 19.x    |
| **TypeScript**   | Type Safety           | 5.x     |
| **Tailwind CSS** | Styling               | 4.x     |
| **Zustand**      | State Management      | 5.x     |
| **Radix UI**     | Accessible Components | Latest  |
| **Lucide React** | Beautiful Icons       | Latest  |

## 📁 Project Structure

```
screeny/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # App header
│   ├── footer.tsx        # App footer
│   ├── image-uploader.tsx # Drag & drop uploader
│   ├── screenshot-controls.tsx # Control panel
│   └── screenshot-preview.tsx  # Canvas preview
├── store/                # Zustand state management
│   └── screenshot-store.ts # Global app state
├── lib/                  # Utility functions
│   ├── constants.ts      # App constants
│   ├── renderer.ts       # Canvas rendering logic
│   └── utils.ts          # Helper utilities
└── public/               # Static assets
```

## 🎨 Available Backgrounds

Screeny comes with 15+ carefully crafted backgrounds:

- **Gradients**: Blue, Purple, Green, Orange, Sunset, Forest, Aurora, Mint, Lavender
- **Multi-color**: Rainbow, Tropical, Northern Lights
- **Solids**: Dark, Light, White

## 🔧 Configuration

### Adding Custom Backgrounds

Edit `lib/constants.ts` to add your own background options:

```typescript
export const BACKGROUND_OPTIONS = [
  // Add your custom background
  {
    name: "Custom Gradient",
    value: "linear-gradient(135deg, #your-colors-here)",
  },
  // ... existing backgrounds
];
```

### Environment Variables

Create a `.env.local` file for any environment-specific configurations:

```bash
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

We love contributions! Here's how you can help make Screeny even better:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test them thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add TypeScript types for new features
- Test your changes across different browsers
- Update documentation if needed

## 📝 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Clipboard functionality not working**

- Ensure you're using HTTPS in production
- Check browser permissions for clipboard access

**Images not uploading**

- Verify file size is under 10MB
- Ensure file format is supported (PNG, JPG, GIF)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide](https://lucide.dev/) for the icon set
- [Vercel](https://vercel.com/) for hosting and deployment

---

<div align="center">
  
  **Made with ❤️ by developers, for developers**
  
  If Screeny helped you create beautiful screenshots, consider giving it a ⭐!
  
</div>
