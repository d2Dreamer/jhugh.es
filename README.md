# Joseph Hughes - Console Portfolio

An interactive terminal-style portfolio website built with Next.js, TypeScript, and React. This project transforms a traditional portfolio into a command-line interface experience with a retro-futuristic aesthetic.

**Version**: 1.1.3

## Features

- **Interactive Console Interface**: Navigate using terminal commands
- **Command History**: Use arrow keys (↑/↓) to navigate through previous commands
- **Tab Autocomplete**: Press Tab to autocomplete commands and filenames
- **Clickable Commands**: Click on commands and filenames in output to execute them
- **File System Simulation**: Browse portfolio content as if it were files
- **Help Button**: Quick access to all commands via the "?" button in the header
- **Mobile Optimized**: Fully responsive with mobile-friendly help formatting
- **Retro Terminal Aesthetics**: CRT monitor effects with glitch animations and scanlines
- **Animated Effects**: Matrix and hack animations for visual flair
- **Typing Animation**: Commands output with realistic typing effects

## Available Commands

### File Operations

- `ls` - List all available files
- `cat <filename>` - Display file contents
- `tree` - Show directory structure

### Navigation

- `pwd` - Show current directory
- `whoami` - Display current user
- `date` - Show current date and time
- `uptime` - Show system uptime

### Content

- `about` - Show about information
- `experience` - Show work experience
- `skills` - Show technical skills
- `projects` - List all projects
- `contact` - Show contact details

### Social Links

- `github` - Open GitHub profile
- `linkedin` - Open LinkedIn profile
- `email` - Show email address
- `resume/cv` - Download resume

### System

- `version` - Show version information
- `neofetch` - Display system information
- `status` - Show portfolio status
- `intro/welcome` - Show welcome message
- `clear` - Clear the console
- `help` - Show this help message

### Fun Commands

- `matrix` - Matrix-style animation effect
- `hack` - Simulated hacking animation

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage Tips

- **Quick Start**: Type `help` or click the "?" button in the header to see all available commands
- **File Navigation**: Use `ls` to list files, then click on any filename to view it
- **Command History**: Press ↑/↓ arrow keys to cycle through previous commands
- **Autocomplete**: Press Tab to autocomplete commands and filenames
- **Clickable Links**: Commands and filenames in output are clickable - just click to execute
- **Mobile Friendly**: The help command automatically formats better on mobile devices

## Technologies Used

- **Next.js 13.2.4** - React framework
- **TypeScript** - Type safety
- **React 18** - UI library
- **CSS3** - Styling with custom terminal theme and animations
- **Press Start 2P** - Pixelated monospace font for retro terminal feel

## Customization

To customize the portfolio content, edit the `fileSystem` object in `src/components/Console.tsx`. Each key represents a file that can be viewed with the `cat` command.

### Adding New Commands

1. Add your command case to the `executeCommand` function
2. Add the command to the `clickableItems` array in `renderTextWithClickableCommands` to make it clickable
3. Update `help.txt` in the `fileSystem` object to include your new command

### Styling

- Terminal effects and animations are defined in `src/styles/globals.css`
- Console component styling is inline in `src/components/Console.tsx`
- Mobile responsiveness is handled via the `isMobile` state and conditional styling

## Deployment

The application can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Heroku

## License

This project is open source and available under the [MIT License](LICENSE).
