import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Command {
  input: string;
  output: string;
  timestamp: Date;
  isTyping?: boolean;
  typingSpeed?: number;
}

interface ConsoleProps {
  initialCommands?: string[];
}

// Animation components defined outside Console to prevent recreation on each render
const hackAnimationLines = new Map<string, string[]>();

const MatrixAnimation: React.FC<{ onScroll?: () => void }> = React.memo(({ onScroll }) => {
  const [columns, setColumns] = useState<Array<{ chars: string[]; speed: number; delay: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;
    
    if (!containerRef.current) return;
    
    const width = containerRef.current.offsetWidth || 800;
    const columnCount = Math.floor(width / 20);
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()[]{}|\\/<>?~`';
    
    const newColumns = Array.from({ length: columnCount }, (_, i) => {
      const columnLength = Math.floor(Math.random() * 20) + 15;
      const columnChars = Array.from({ length: columnLength }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      return { 
        chars: columnChars, 
        speed: Math.random() * 2000 + 1000,
        delay: i * 100
      };
    });
    
    setColumns(newColumns);
    if (onScroll) {
      setTimeout(() => onScroll(), 100);
    }
  }, [onScroll]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: '14px',
        lineHeight: '1.2',
      }}
    >
      {columns.map((column, colIndex) => (
        <div
          key={colIndex}
          style={{
            position: 'absolute',
            left: `${colIndex * 20}px`,
            top: '-100%',
            color: '#00ff00',
            textShadow: '0 0 5px #00ff00',
            animation: `matrix-fall ${column.speed}ms linear infinite`,
            animationDelay: `${column.delay}ms`,
          }}
        >
          {column.chars.map((char, charIndex) => (
            <div
              key={charIndex}
              style={{
                opacity: charIndex === 0 ? 1 : Math.max(0.2, 1 - (charIndex / column.chars.length) * 0.8),
                color: charIndex === 0 ? '#ffffff' : '#00ff00',
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes matrix-fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(400px);
          }
        }
      `}} />
    </div>
  );
});
MatrixAnimation.displayName = 'MatrixAnimation';

const HackAnimation: React.FC<{ animationKey: string; onScroll?: () => void }> = React.memo(({ animationKey, onScroll }) => {
  const [lines, setLines] = useState<string[]>(() => hackAnimationLines.get(animationKey) || []);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current || lines.length > 0) {
      return;
    }
    
    hasStartedRef.current = true;
    let currentLines = lines;

    const hackLines = [
      '[>] Initializing hack sequence...',
      '[>] Bypassing security protocols...',
      '[>] Accessing mainframe...',
      '[>] Decrypting data streams...',
      '[>] Injecting payload...',
      '[>] Establishing connection...',
      '[>] Scanning for vulnerabilities...',
      '[>] Exploiting buffer overflow...',
      '[>] Gaining root access...',
      '[>] Extracting sensitive data...',
      '[>] Covering tracks...',
      '[>] Mission complete.',
      '',
      'Just kidding! 😄',
      'This is a harmless animation.',
      'I\'m a legitimate developer, not a hacker!',
      '',
      'But I do know cybersecurity and can help secure your systems. 💻'
    ];

    let currentLine = 0;
    
    const addNextLine = () => {
      if (currentLine < hackLines.length) {
        const delay = Math.random() * 400 + 400;
        
        const timeout = setTimeout(() => {
          const newLines = [...currentLines, hackLines[currentLine]];
          currentLines = newLines;
          setLines(newLines);
          hackAnimationLines.set(animationKey, newLines);
          currentLine++;
          
          if (onScroll) {
            setTimeout(() => onScroll(), 100);
          }
          
          if (currentLine < hackLines.length) {
            addNextLine();
          }
        }, delay);
        
        timeoutRefs.current.push(timeout);
      }
    };

    setTimeout(() => addNextLine(), 100);
    
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationKey, onScroll]);

  return (
    <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.4' }}>
      {lines.map((line, index) => {
        if (!line) return null;
        return (
          <div
            key={index}
            style={{
              color: '#00ff00',
              textShadow: '0 0 5px #00ff00',
              marginBottom: '1px',
              opacity: 1,
              animation: line.includes('Just kidding') ? 'none' : 'fadeIn 0.2s ease-in',
            }}
          >
            {line}
          </div>
        );
      })}
      {lines.length > 0 && lines.length < 18 && (
        <span
          style={{
            animation: 'blink 0.8s infinite',
            color: '#00ff00',
            textShadow: '0 0 5px #00ff00',
          }}
        >
          █
        </span>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
});
HackAnimation.displayName = 'HackAnimation';

const Console: React.FC<ConsoleProps> = ({ initialCommands = [] }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [autocompleteSuggestion, setAutocompleteSuggestion] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(80);
  const [formHeight, setFormHeight] = useState(0);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialCommandsRun = useRef(false);
  const [typingCommands, setTypingCommands] = useState<Command[]>([]);
  const typingCancelledRef = useRef(false);
  const currentTypingCommandRef = useRef<{ input: string; fullOutput: string } | null>(null);

  const fileSystem = {
    'about.txt': `JOSEPH HUGHES - SENIOR SOFTWARE ENGINEER
===========================================

Hello! I'm Joseph Hughes, a UK-based Senior Software Engineer and Blockchain Specialist with 11+ years of experience in blockchain technologies.

EXPERIENCE:
- 11+ years in blockchain and Web3 development
- Specialized in smart contracts, DeFi protocols, and Web3 applications
- Led technical teams and delivered solutions with 140,000+ monthly active users
- Secured $650,000 in pre-seed funding for TowneSquare
- Involved in the Cryptosphere since 2013

CURRENT PROJECTS:
- Alpaca Network - Web3 Dex & Token Launcher with AI Inference platform
- InvestInsight - Track Web3, Stocks & Shares and property assets all in one place
- Decentratech - Various Web3 dApps
- Utmost Utopia - Car Dealership
- TM-Hub - Personal project for Trackmania community stats tracking

PASSION:
I love building innovative blockchain solutions and creating elegant systems that solve complex problems. 
When I'm not coding, you'll find me snowboarding or engaging with the gaming community.

TECHNICAL FOCUS:
- Blockchain and Web3 technologies (Solidity, Smart Contracts, DeFi)
- Full-stack development (React, Node.js, TypeScript, Python)
- Cloud infrastructure (AWS, Firebase)
- NFT marketplaces and tokenization
- Trading bots and automation

EDUCATION:
- Diploma of Higher Education Computer Science - Leeds Trinity University (2019-2023)
- BTEC Level 3 Extended Diploma Computer Science - Runshaw College (2017-2019)
- GCSE Computer Science - Leyland St Marys Catholic Technology College (2011-2017)

CERTIFICATIONS:
- Foundational Cloud Practitioner - Amazon Web Services

AWARDS:
- Social Media Chief Technology Officer of the Year 2024 - CEO Monthly`,

    'experience.txt': `PROFESSIONAL EXPERIENCE
====================

CURRENT PROJECTS:
-----------------

Tech Lead - Alpaca Network
Remote | Web3 Dex & Token Launcher with AI Inference Platform
- Building decentralized exchange and token launching platform
- Integrating AI inference capabilities for enhanced trading features
- Developing Web3 infrastructure for token launches and trading
- Status: Active Development

FOUNDER & CTO - InvestInsight
Remote | Multi-Asset Tracking Platform
- Building unified platform to track Web3, Stocks & Shares, and property assets
- Implementing social features for community engagement
- Developing portfolio management and analytics tools
- Status: Active Development

Web Developer - Utmost Utopia
Remote | Car Dealership Platform
- Building car dealership management and sales platform
- Developing inventory management and customer relationship systems
- Status: Active Development

FOUNDER & DEVELOPER - TM-Hub
Remote | Gaming Community Platform
- Personal project for Trackmania community
- Building player statistics and campaign tracking system
- Developing community features for Trackmania players
- Status: Active Development

CO-FOUNDER & CTO - Decentratech
Leeds, UK | Web3 Development Firm
- Launched Web3 development firm delivering cutting-edge blockchain solutions
- Led creation of innovative projects including trust-based games and Web3 dating app
- Designed and deployed cross-chain solutions for casinos and other dApps
- Built various Web3 dApps and blockchain integrations

PAST EXPERIENCE:
---------------

CHIEF TECHNOLOGY OFFICER (CTO) - Strike
Remote | Web3 Futures Exchange
- Promoted from Chief Blockchain Officer to CTO to oversee technical leadership
- Designed and implemented smart contracts managing all financial transactions
- Developed and maintained APIs supporting seamless data flow
- Spearheaded technology roadmap for football performance-based pricing platform
- Specialized in Web3 futures exchange for football performance trading

CHIEF TECHNOLOGY OFFICER (CTO) - TowneSquare Ltd
Remote | Web3 Social Media Platform
- Built Web3 social media platform and associated dApps
- Directed team of developers, achieving 140,000 monthly active users
- Delivered key features including NFT marketplace, loyalty tracker, and composable NFT collections
- Secured $650,000 in pre-seed funding
- Built on Aptos blockchain

DIRECTOR & FOUNDER - Decadent Blockchain Solutions
Remote | Web3 Mobile Gaming
- Brought Web3 Mobile Gaming to WAXP Network, based on EOS
- Developed mobile gaming platform with blockchain integration
- Implemented NFT and token mechanics for gaming experience

BLOCKCHAIN ENGINEER - NextColony
Remote | Web3 Space Resource Game
- Developed Web3 space resource game on STEEM blockchain
- Leveraged NFT technology for gameplay mechanics
- Designed blockchain integrations to enhance user engagement

DIRECTOR & FOUNDER - Mining Central
Leeds, UK | Cryptocurrency Mining Company
- Founded cryptocurrency mining company offering cloud-based mining solutions
- Negotiated hardware acquisitions and optimized mining processes
- Developed software platform enabling easy customer participation in cryptocurrency mining
- Brought mining to cloud for people to enter the industry without hardware

DIRECTOR & FOUNDER - Crypos
Remote | Masternode Platform
- Built platform bringing Masternodes to the masses through collaborative collateral funding
- Implemented auto-reinvesting of funds earned
- Enabled collaborative funding for masternode participation

TECHNICAL ANALYST & BOT DEVELOPER - SippyCupTrading
Remote | Trading Community Platform
- Provided technical analysis for community of 20,000 Discord members
- Built trading bots to automate investment strategies for crypto and forex
- Supported community by delivering insights and automated solutions
- Platform where users pay monthly subscription for premium investment advice

DEVELOPER - Personal Trading Bots
Remote | Automated Trading Systems
- Developed personal trading bots for use on Binance using Python
- Implemented automated trading strategies for cryptocurrency markets
- Built risk management and portfolio optimization features

DIRECTOR & FOUNDER - CSGO Gambling Platforms
Remote | Gaming Gambling Sites
- Founded and developed three successful CS:GO skins gambling platforms
- CSGORoyale: Roulette-based gambling platform
- CSGO-Pixels: Roulette, coinflip & jackpot platform
- CSGOBucks: Roulette & jackpot platform
- Implemented CS:GO skins as currency with various gambling mechanics

WRITER - UseHODL
Remote | Cryptocurrency Blog
- Wrote educational and informational blog posts surrounding cryptocurrency
- Covered blockchain technology, trading strategies, and market analysis
- Provided content for cryptocurrency community

INTERN - TriTech Ltd
Remote | Web Development
- Sole developer for Suicide Prevention UK website
- Project dedicated to mental health awareness and support
- Designed and built full-stack website ensuring user-friendly interface and robust backend

INTERN - Shoo Social Media
Leeds, UK | Marketing & SEO
- Gained hands-on experience in SEO and web development
- Enhanced website performance and traffic through technical optimisations
- Marketing company offering services to businesses across the UK

INTERN - ElbowSpace
Leeds, UK | Site Building Platform
- Worked on easy-to-use site-building tool tailored for student unions
- Developed Vue-based templates for accessible website creation
- Contributed to front-end and back-end integration
- Platform making site building easy for Student Unions across the UK`,

    'skills.txt': `TECHNICAL SKILLS
===============

PROGRAMMING LANGUAGES:
- Python (11+ years) - Trading bots, automation, backend services
- JavaScript/TypeScript (11+ years) - Full-stack development
- Solidity - Smart contract development
- C++ - System-level programming
- SQL - Database queries and optimization

FRONTEND DEVELOPMENT:
- React - Modern UI development
- Vue.js - Component-based frameworks
- Next.js - Server-side rendering and static generation
- React Native - Mobile application development
- HTML5, CSS3, JavaScript (ES6+)

BACKEND DEVELOPMENT:
- Node.js - Server-side JavaScript runtime
- Express.js - Web application framework
- RESTful APIs - API design and development
- Microservices architecture - Scalable system design

BLOCKCHAIN & WEB3:
- Solidity, Move - Smart contract development and auditing (low level)
- Web3.js, Ethers.js - Blockchain interactions
- SolanaSDK, MoveSDK - Solana & Aptosblockchain development
- Cross-chain solutions - Multi-blockchain integrations
- NFT marketplaces and tokenization
- DeFi protocols and yield farming
- IPFS integration and decentralized storage

DATABASES & STORAGE:
- MongoDB - NoSQL database
- Firebase - Real-time database and backend services
- SQL databases - Relational database management

DEVOPS & CLOUD:
- AWS - Cloud infrastructure (EC2, S3, Lambda, RDS)
- Firebase - Backend-as-a-Service
- DevOps - CI/CD pipelines, automation
- GitHub - Version control, actions, and collaboration
- Linux server administration

SOFT SKILLS:
- Agile methodologies - Scrum, Kanban
- Project management - Team leadership and coordination
- Problem-solving - Complex technical challenges
- Technical writing - Documentation and communication
- Team leadership - Managing development teams

PERSONAL INTERESTS:
- Hardware knowledge - System architecture and optimization
- Snowboarding - Active outdoor enthusiast
- Ex-professional gamer - Competitive gaming background`,

    'projects.txt': `FEATURED PROJECTS
===============

CURRENT PROJECTS:
-----------------

ALPACA NETWORK
- Type: Web3 Dex & Token Launcher with AI Inference platform
- Description: Decentralized exchange and token launching platform with integrated AI capabilities
- Status: Active Development

INVESTINSIGHT
- Type: Multi-Asset Tracking Platform
- Description: Track Web3, Stocks & Shares and property assets all in one place, with social features
- Features: Unified asset tracking, social community, portfolio management
- Status: Active Development

DECENTRATECH
- Type: Web3 dApps Development
- Description: Various Web3 decentralized applications
- Status: Active Development

UTMOST UTOPIA
- Type: Car Dealership Platform
- Description: Car dealership management and sales platform
- Status: Active Development

TM-HUB
- Type: Gaming Community Platform
- Description: Personal project for Trackmania community tracking player and campaign stats
- Features: Player statistics, campaign tracking, community features
- Status: Active Development

PAST PROJECTS:
-------------

STRIKE
- Type: Web3 Futures Exchange
- Description: Web3 futures exchange specializing in football performance-based pricing
- Role: CTO (promoted from Chief Blockchain Officer)
- Tech: Smart contracts, APIs, blockchain integration
- Impact: Managed all financial transactions via smart contracts

MINING CENTRAL
- Type: Cryptocurrency Mining Company
- Description: Cloud-based mining solutions bringing mining to the cloud
- Role: Director & Founder
- Features: Software platform for easy customer participation
- Impact: Enabled people to enter mining industry without hardware

TOWNESQUARE
- Type: Web3 Social Media Platform
- Description: Web3 social media platform built on Aptos blockchain
- Role: CTO & Co-Founder
- Tech: React, Next.js, TypeScript, Solidity, Aptos
- Features: NFT marketplace, loyalty tracker, composable NFT collections
- Impact: 140,000 monthly active users, $650,000 pre-seed funding secured

DECADENT BLOCKCHAIN SOLUTIONS
- Type: Web3 Mobile Gaming
- Description: Bringing Web3 Mobile Gaming to WAXP Network, based on EOS
- Role: Director & <Founder></Founder>
- Features: Mobile gaming with blockchain integration

NEXTCOLONY
- Type: NFT Space Game
- Description: NFT Space Game based on STEEM blockchain
- Role: Blockchain Engineer
- Features: Web3 gameplay mechanics, NFT technology

CRYPOS
- Type: Masternode Platform
- Description: Bringing Masternodes to the masses through collaborative collateral funding
- Role: Director & Founder
- Features: Auto-reinvesting of funds earned, collaborative funding

SIPPYCUPTRADING
- Type: Investment Platform
- Description: Platform where users pay monthly subscription for premium investment advice
- Role: Technical Analyst & Bot Developer
- Features: Trading bots, technical analysis, 20,000+ Discord community

USEHODL
- Type: Cryptocurrency Blog
- Description: Blog posts surrounding cryptocurrency
- Role: Writer
- Content: Educational and informational articles

PERSONAL TRADING BOTS
- Type: Automated Trading
- Description: Personal trading bots for use on Binance using Python
- Features: Automated trading strategies, crypto trading

ELBOWSPACE
- Type: Site Building Platform
- Description: Platform making site building easy for Student Unions across the UK
- Role: Intern
- Tech: Vue.js
- Features: Easy-to-use templates for student unions

SHOO SOCIAL MEDIA
- Type: Marketing Platform
- Description: Marketing company offering services to businesses across the UK
- Role: Intern
- Features: SEO, web development, marketing services

TRITECH
- Type: Mental Health Website
- Description: Suicide Prevention UK site for charity
- Role: Intern & Sole Developer
- Features: Full-stack website, mental health awareness and support

CSGO GAMBLING PLATFORMS
- Type: Gaming Gambling Sites
- Description: Three successful CS:GO skins gambling platforms
- Role: Director & Founder
- Projects: CSGORoyale (roulette), CSGO-Pixels (roulette, coinflip & jackpot), CSGOBucks (roulette & jackpot)
- Features: CS:GO skins as currency, various gambling mechanics`,

    'contact.txt': `CONTACT INFORMATION
=================

EMAIL: joe@investinsight.io
PHONE: +44 7834 852855
LOCATION: Leeds, UK
ADDRESS: 4 Holburn Walk, Leeds, West Yorkshire, LS6 2RA, UK

SOCIAL LINKS:
LINKEDIN: https://www.linkedin.com/in/jhughes-dev/
GITHUB: https://github.com/d2Dreamer
WEBSITE: https://jhugh.es
DISCORD: d2dreamer

AVAILABILITY:
- Currently open to remote roles
- Available for freelance projects
- Interested in Web3 and blockchain opportunities
- Remote work preferred
- Full-time and part-time consulting available

RESPONSE TIME:
- Email: Within 24 hours
- LinkedIn: Within 48 hours
- Discord: Usually online
- GitHub: Check commits for activity

RESUME: Available upon request
CV: View detailed CV online or request via email

PREFERRED CONTACT METHODS:
1. Discord (quick communication and community engagement)
2. Email (best for detailed discussions and opportunities)
2. LinkedIn (professional networking)
3. GitHub (technical collaboration and code review)
4. WhatsApp (for urgent or time-sensitive discussions)`,

    'help.txt': `AVAILABLE COMMANDS
=================

FILE OPERATIONS:
ls                    - List all available files (click to open)
cat <filename>        - Display file contents
tree                  - Show directory structure

NAVIGATION:
pwd                   - Show current directory
whoami                - Display current user
date                  - Show current date and time
uptime                - Show system uptime

CONTENT PAGES:
about                 - Show about information
experience            - Show work experience
skills                - Show technical skills
projects              - List all projects
contact               - Show contact details

SOCIAL LINKS:
github                - Open GitHub profile
linkedin              - Open LinkedIn profile
email                 - Show email address
social                - Show all social media links
resume/cv             - Download resume

SYSTEM COMMANDS:
version               - Show version information
neofetch              - Display system information
status                - Show portfolio status
intro/welcome         - Show welcome message
clear                 - Clear the console
help                  - Show this help message

FUN COMMANDS:
matrix                - Matrix-style animation effect
hack                  - Simulated hacking animation

EXAMPLES:
$ cat about.txt
$ ls
$ neofetch
$ github
$ social
$ status
$ clear`,

    'README.md': `INTERACTIVE CONSOLE PORTFOLIO v1.1.3
===========================================

Welcome to my terminal-style portfolio! This is an interactive CV website
built with Next.js, TypeScript, and React that transforms a traditional
portfolio into a command-line interface experience.

QUICK START
-----------
Type 'help' to see all available commands
Use 'ls' to list all available files
Use 'cat <filename>' to read file contents
Type 'clear' to reset the console
Press ↑/↓ arrow keys to navigate command history

AVAILABLE FILES
---------------
📄 about.txt      - Personal information and background
📄 experience.txt - Professional work history
📄 skills.txt     - Technical skills and expertise
📄 projects.txt   - Featured projects and work
📄 contact.txt    - Contact information and social links
📄 help.txt       - Complete command reference

KEY COMMANDS
------------
whoami        - Display current user information
github        - Open GitHub profile
linkedin      - Open LinkedIn profile
email         - Show email address
social        - Display all social links
version       - Show version information
neofetch      - Display system information
status        - Show console statistics

FUN FEATURES
------------
matrix        - Run the Matrix animation
hack          - Run the hack sequence animation

TECHNOLOGIES
------------
Built with Next.js 13.2.4, TypeScript, and React
Features retro terminal aesthetics with glitch effects
Fully responsive and interactive

Enjoy exploring! 🚀`
  };

  const executeCommand = (input: string, commandsArray: Command[] = []): string => {
    const cmd = input.trim().toLowerCase();
    const parts = input.trim().split(' ');
    const commandPart = parts[0].toLowerCase(); // Make command case-insensitive

    switch (commandPart) {
      case 'ls':
        return Object.keys(fileSystem)
          .map(filename => `${getFileIcon(filename)} ${filename}`)
          .join('\n');
      
      case 'cat':
        if (parts.length > 1 && parts[1]) {
          // Get all parts after 'cat' to handle filenames with spaces
          const filename = parts.slice(1).join(' ');
          // Case-insensitive lookup for filenames
          const fileSystemKeys = Object.keys(fileSystem);
          const matchingKey = fileSystemKeys.find(key => key.toLowerCase() === filename.toLowerCase());
          if (matchingKey) {
            return (fileSystem as Record<string, string>)[matchingKey];
          }
          return `cat: ${filename}: No such file or directory`;
        }
        return 'cat: missing file operand';
      
      case 'clear':
        setCommands([]);
        return '';
      
      case 'help':
        return fileSystem['help.txt'];
      
      case 'whoami':
        return 'joseph-hughes';
      
      case 'pwd':
        return '/home/d2dreamer/portfolio';
      
      case 'date':
        return new Date().toString();
      
      case 'projects':
        return fileSystem['projects.txt'];
      
      case 'skills':
        return fileSystem['skills.txt'];
      
      case 'experience':
        return fileSystem['experience.txt'];
      
      case 'about':
        return fileSystem['about.txt'];
      
      case 'contact':
        return fileSystem['contact.txt'];
      
      case 'resume':
        return `Opening resume...\n\n📄 Resume available for download:\n🔗 /resume.pdf\n\nClick the link above to view or download the PDF in your browser.\n\nAlternatively, use 'cat contact.txt' for contact information.`;

      case 'cv':
        return `Opening CV...\n\n📄 CV available for download:\n🔗 /resume.pdf\n\nClick the link above to view or download the PDF in your browser.\n\nAlternatively, use 'cat contact.txt' for contact information.`;
      
      case 'github':
        return `Opening GitHub profile...\n\n🔗 https://github.com/d2Dreamer\n\nCheck out my repositories and contributions!`;
      
      case 'linkedin':
        return `Opening LinkedIn profile...\n\n🔗 https://www.linkedin.com/in/jhughes-dev\n\nConnect with me on LinkedIn!`;
      
      case 'email':
        return `📧 joe@investinsight.io\n\nFeel free to reach out for opportunities or collaboration!`;
      
      case 'version':
        return `Console Portfolio v1.1.3\nBuilt with Next.js, TypeScript, and React\nLast updated: ${new Date().toLocaleDateString()}`;
      
      case 'uptime':
        const uptime = Date.now() - (window.performance.timing.navigationStart || 0);
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `System uptime: ${hours}h ${minutes % 60}m ${seconds % 60}s`;
      
      case 'neofetch':
        return `OS: Portfolio Console v1.1.3
Host: d2dreamer-portfolio
Kernel: Next.js 13.2.4
Uptime: ${Math.floor((Date.now() - (window.performance.timing.navigationStart || 0)) / 1000)}s
Shell: Interactive Console
Terminal: Web Browser
CPU: JavaScript Engine
Memory: Dynamic
Theme: 8-bit Green`;

      case 'intro':
      case 'welcome':
        return `Welcome to Joseph Hughes' Interactive Portfolio!\n\nThis is a terminal-style CV built with Next.js and TypeScript.\n\nQuick Navigation:\n- Type 'ls' to see all available files\n- Type 'cat <filename>' to read content\n- Type 'help' for all available commands\n- Type 'neofetch' for system information\n\nEnjoy exploring! 🚀`;

      case 'status':
        return `Portfolio Status: ONLINE ✅\nLast Updated: ${new Date().toLocaleDateString()}\nTotal Commands: ${commandsArray.length}\nSystem: Running smoothly\nTheme: 8-bit Green Terminal\n\nReady for your next command!`;

      case 'social':
        return `SOCIAL MEDIA & LINKS
====================

GitHub: https://github.com/d2Dreamer
LinkedIn: https://www.linkedin.com/in/jhughes-dev
Website: https://jhugh.es
Email: jhughes2702@gmail.com

Follow me for updates on my latest projects and tech insights!`;

      case 'tree':
        return `portfolio/
├── [FILE] about.txt
├── [FILE] experience.txt
├── [FILE] skills.txt
├── [FILE] projects.txt
├── [FILE] contact.txt
├── [FILE] help.txt
└── [FILE] README.md

0 directories, 7 files`;
      
      case 'matrix':
        return 'MATRIX_ANIMATION'; // Special marker for animation
      
      case 'hack':
        return 'HACK_ANIMATION'; // Special marker for animation
      
      case '':
        return '';
      
      default:
        return `Command not found: ${parts[0]}. Type 'help' for available commands.`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    // If there's a command currently typing, cancel it and show full output immediately
    if (typingCommands.length > 0 || currentTypingCommandRef.current) {
      typingCancelledRef.current = true;
      
      // Complete any ongoing typing commands immediately
      if (currentTypingCommandRef.current) {
        setCommands(prev => 
          prev.map((cmd, index) => {
            // Find the last command that matches the typing one
            const lastIndex = prev.length - 1;
            if (index === lastIndex && cmd.input === currentTypingCommandRef.current?.input) {
              return {
                ...cmd,
                output: currentTypingCommandRef.current.fullOutput,
                isTyping: false
              };
            }
            return cmd;
          })
        );
        setTypingCommands([]);
        currentTypingCommandRef.current = null;
      }
      
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 50));
      typingCancelledRef.current = false;
    }

    const input = currentInput;
    const output = executeCommand(input, commands);
    
    // Add command to history immediately
    setCommandHistory(prev => [...prev, input]);
    setCurrentInput('');
    setHistoryIndex(-1);

    // Skip typing animation for special animations
    if (output === 'MATRIX_ANIMATION' || output === 'HACK_ANIMATION') {
      const newCommand: Command = {
        input: input,
        output: output,
        timestamp: new Date(),
        isTyping: false,
      };
      setCommands(prev => [...prev, newCommand]);
      // Scroll to bottom after adding animation command
      setTimeout(() => scrollToBottom(), 100);
    } else {
      // Use typing animation for better UX
      await addTypingCommand(input, output, 15);
    }
  };

  // Get all available commands and files for autocomplete
  const getAllCompletions = (): string[] => {
    const commands = [
      'ls', 'cat', 'clear', 'help', 'whoami', 'pwd', 'date', 'projects', 
      'skills', 'experience', 'about', 'contact', 'resume', 'cv', 'github', 
      'linkedin', 'email', 'version', 'uptime', 'neofetch', 'intro', 'welcome', 
      'status', 'social', 'tree', 'matrix', 'hack'
    ];
    const files = Object.keys(fileSystem);
    return [...commands, ...files];
  };

  // Find autocomplete suggestion based on current input
  const getAutocompleteSuggestion = (input: string): string => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return '';
    
    const parts = trimmedInput.split(' ');
    const completions = getAllCompletions();
    
    // If it's "cat" command, autocomplete files
    if (parts[0].toLowerCase() === 'cat' && parts.length === 2) {
      const filePrefix = parts[1].toLowerCase();
      const matchingFiles = Object.keys(fileSystem).filter(file => 
        file.toLowerCase().startsWith(filePrefix)
      );
      if (matchingFiles.length === 1) {
        return `cat ${matchingFiles[0]}`;
      }
      return '';
    }
    
    // Autocomplete command (first word)
    if (parts.length === 1) {
      const inputLower = parts[0].toLowerCase();
      const matchingCommands = completions.filter(cmd => 
        cmd.toLowerCase().startsWith(inputLower)
      );
      if (matchingCommands.length === 1) {
        return matchingCommands[0];
      }
      // If multiple matches, find the longest common prefix
      if (matchingCommands.length > 1) {
        let commonPrefix = matchingCommands[0].toLowerCase();
        for (let i = 1; i < matchingCommands.length; i++) {
          const cmd = matchingCommands[i].toLowerCase();
          let j = 0;
          while (j < commonPrefix.length && j < cmd.length && commonPrefix[j] === cmd[j]) {
            j++;
          }
          commonPrefix = commonPrefix.substring(0, j);
        }
        if (commonPrefix.length > inputLower.length) {
          return matchingCommands[0].substring(0, commonPrefix.length);
        }
      }
    }
    
    return '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAutocompleteSuggestion(''); // Clear autocomplete when navigating history
      if (commandHistory.length === 0) return;
      
      // Move backward in history (older commands)
      if (historyIndex === -1) {
        // Start from the most recent command (last in array)
        const newIndex = commandHistory.length - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else if (historyIndex > 0) {
        // Go to older command
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAutocompleteSuggestion(''); // Clear autocomplete when navigating history
      if (historyIndex === -1) return; // Already at the bottom
      
      // Move forward in history (newer commands)
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        // Reached the most recent command, clear input
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (autocompleteSuggestion && autocompleteSuggestion.toLowerCase().startsWith(currentInput.toLowerCase())) {
        // Complete the suggestion
        setCurrentInput(autocompleteSuggestion);
        setAutocompleteSuggestion('');
        setHistoryIndex(-1); // Reset history index when autocompleting
      }
    } else {
      // Reset history index when typing other keys
      setHistoryIndex(-1);
    }
  };

  const typeText = async (text: string, delay: number = 30) => {
    setIsTyping(true);
    let i = 0;
    while (i < text.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
      i++;
    }
    setIsTyping(false);
  };

  const scrollToBottom = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, []);

  const handleFileClick = async (filename: string) => {
    const output = executeCommand(`cat ${filename}`, commands);
    // Skip typing animation for special animations
    if (output === 'MATRIX_ANIMATION' || output === 'HACK_ANIMATION') {
      const newCommand: Command = {
        input: `cat ${filename}`,
        output: output,
        timestamp: new Date(),
        isTyping: false,
      };
      setCommands(prev => [...prev, newCommand]);
      // Scroll to bottom after adding animation command
      setTimeout(() => scrollToBottom(), 100);
    } else {
      await addTypingCommand(`cat ${filename}`, output, 15);
    }
  };

  const addTypingCommand = async (input: string, output: string, speed: number = 20) => {
    // Reset cancellation flag and track this command
    typingCancelledRef.current = false;
    currentTypingCommandRef.current = { input, fullOutput: output };
    
    const newCommand: Command = {
      input,
      output: '',
      timestamp: new Date(),
      isTyping: true,
      typingSpeed: speed
    };
    
    setCommands(prev => [...prev, newCommand]);
    setTypingCommands(prev => [...prev, newCommand]);
    
    // Special handling for ls command
    if (input === 'ls') {
      const files = Object.keys(fileSystem);
      let currentFiles: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        // Check if typing was cancelled
        if (typingCancelledRef.current) {
          // Show full output immediately
          const fullFileList = Object.keys(fileSystem)
            .map(filename => `${getFileIcon(filename)} ${filename}`)
            .join('\n');
          setCommands(prev => 
            prev.map((cmd, index) => 
              index === prev.length - 1 
                ? { ...cmd, output: fullFileList, isTyping: false }
                : cmd
            )
          );
          break;
        }
        
        currentFiles.push(files[i]);
        const fileList = currentFiles
          .map(filename => `${getFileIcon(filename)} ${filename}`)
          .join('\n');
        
        setCommands(prev => 
          prev.map((cmd, index) => 
            index === prev.length - 1 
              ? { ...cmd, output: fileList, isTyping: i < files.length - 1 }
              : cmd
          )
        );
        
        // Scroll to bottom during typing
        setTimeout(() => scrollToBottom(), 0);
        
        await new Promise(resolve => setTimeout(resolve, speed * 3)); // Slower for ls
      }
    } else {
      // Adaptive typing based on content length
      const contentLength = output.length;
      let typedOutput = '';
      
      // For very long content (>2000 chars), type by words/lines for speed
      // For medium content (500-2000 chars), type faster character by character
      // For short content (<500 chars), use normal character-by-character typing
      
      if (contentLength > 2000) {
        // Type by lines for very long content
        const lines = output.split('\n');
        for (let i = 0; i < lines.length; i++) {
          // Check if typing was cancelled
          if (typingCancelledRef.current) {
            setCommands(prev => 
              prev.map((cmd, index) => 
                index === prev.length - 1 
                  ? { ...cmd, output: output, isTyping: false }
                  : cmd
              )
            );
            break;
          }
          
          typedOutput += lines[i] + (i < lines.length - 1 ? '\n' : '');
          setCommands(prev => 
            prev.map((cmd, index) => 
              index === prev.length - 1 
                ? { ...cmd, output: typedOutput, isTyping: i < lines.length - 1 }
                : cmd
            )
          );
          setTimeout(() => scrollToBottom(), 0);
          // Fast line-by-line typing (5-10ms per line)
          await new Promise(resolve => setTimeout(resolve, Math.max(5, 10 - Math.floor(i / 50))));
        }
      } else if (contentLength > 500) {
        // Type by chunks (words) for medium content
        const words = output.split(/(\s+)/);
        for (let i = 0; i < words.length; i++) {
          // Check if typing was cancelled
          if (typingCancelledRef.current) {
            setCommands(prev => 
              prev.map((cmd, index) => 
                index === prev.length - 1 
                  ? { ...cmd, output: output, isTyping: false }
                  : cmd
              )
            );
            break;
          }
          
          typedOutput += words[i];
          setCommands(prev => 
            prev.map((cmd, index) => 
              index === prev.length - 1 
                ? { ...cmd, output: typedOutput, isTyping: i < words.length - 1 }
                : cmd
            )
          );
          setTimeout(() => scrollToBottom(), 0);
          // Adaptive speed: faster for longer content
          const adaptiveSpeed = Math.max(1, Math.floor(speed * (500 / contentLength)));
          await new Promise(resolve => setTimeout(resolve, adaptiveSpeed));
        }
      } else {
        // Character-by-character for short content (original behavior)
        for (let i = 0; i < output.length; i++) {
          // Check if typing was cancelled
          if (typingCancelledRef.current) {
            setCommands(prev => 
              prev.map((cmd, index) => 
                index === prev.length - 1 
                  ? { ...cmd, output: output, isTyping: false }
                  : cmd
              )
            );
            break;
          }
          
          typedOutput += output[i];
          setCommands(prev => 
            prev.map((cmd, index) => 
              index === prev.length - 1 
                ? { ...cmd, output: typedOutput, isTyping: i < output.length - 1 }
                : cmd
            )
          );
          setTimeout(() => scrollToBottom(), 0);
          await new Promise(resolve => setTimeout(resolve, speed));
        }
      }
    }
    
    setTypingCommands(prev => prev.slice(1));
    currentTypingCommandRef.current = null;
    
    // Final scroll to ensure we're at the bottom
    setTimeout(() => scrollToBottom(), 100);
  };

  const getFileIcon = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt':
        return '[TXT]';
      case 'md':
        return '[MD] ';
      case 'js':
      case 'ts':
      case 'tsx':
        return '[JS] ';
      case 'json':
        return '[JSON]';
      case 'css':
        return '[CSS]';
      case 'html':
        return '[HTML]';
      default:
        return '[FILE]';
    }
  };

  const renderTextWithLinks = (text: string): React.ReactNode => {
    // URL regex pattern - matches http, https, relative paths starting with /, and email addresses
    const urlRegex = /(https?:\/\/[^\s]+|\/[^\s]+|[\w.-]+@[\w.-]+\.\w+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const url = match[0];
      const isEmail = url.includes('@');
      const isRelativePath = url.startsWith('/');
      const href = isEmail ? `mailto:${url}` : url;

      // Add clickable link
      parts.push(
        <a
          key={match.index}
          href={href}
          target={isEmail || isRelativePath ? undefined : "_blank"}
          rel={isEmail || isRelativePath ? undefined : "noopener noreferrer"}
          style={{
            color: '#00ff00',
            textDecoration: 'underline',
            textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00cc00';
            e.currentTarget.style.textShadow = '0 0 10px #00ff00, 0 0 20px #00ff00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#00ff00';
            e.currentTarget.style.textShadow = '0 0 5px #00ff00, 0 0 10px #00ff00';
          }}
        >
          {url}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderTextWithClickableCommands = (text: string): React.ReactNode => {
    // Available files and commands that should be clickable
    const clickableItems = [
      ...Object.keys(fileSystem),
      'github', 'linkedin', 'email', 'social', 'whoami', 'pwd', 'date', 'uptime',
      'version', 'neofetch', 'status', 'clear', 'help', 'matrix', 'hack',
      'about', 'experience', 'skills', 'projects', 'contact', 'resume', 'cv'
    ];
    
    // Create regex pattern to match these items (word boundaries to avoid partial matches)
    const pattern = new RegExp(`\\b(${clickableItems.map(item => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        // Also check for URLs in the before text
        parts.push(renderTextWithLinks(beforeText));
      }

      const item = match[0].toLowerCase();
      const isFile = Object.keys(fileSystem).includes(item);
      const command = isFile ? `cat ${item}` : item;

      // Add clickable button
      parts.push(
        <button
          key={match.index}
          onClick={async () => {
            if (isFile) {
              await handleFileClick(item);
            } else {
              const output = executeCommand(command, commands);
              if (output === 'MATRIX_ANIMATION' || output === 'HACK_ANIMATION') {
                const newCommand: Command = {
                  input: command,
                  output: output,
                  timestamp: new Date(),
                  isTyping: false,
                };
                setCommands(prev => [...prev, newCommand]);
                setTimeout(() => scrollToBottom(), 100);
              } else {
                await addTypingCommand(command, output, 15);
              }
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#00ff00',
            fontFamily: 'Press Start 2P, monospace',
            fontSize: 'inherit',
            textDecoration: 'underline',
            textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
            cursor: 'pointer',
            padding: '0 2px',
            margin: '0',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#00cc00';
            e.currentTarget.style.textShadow = '0 0 10px #00ff00, 0 0 20px #00ff00';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#00ff00';
            e.currentTarget.style.textShadow = '0 0 5px #00ff00, 0 0 10px #00ff00';
          }}
        >
          {match[0]}
        </button>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text (also check for URLs)
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      parts.push(renderTextWithLinks(remainingText));
    }

    return parts.length > 0 ? parts : renderTextWithLinks(text);
  };

  const formatHelpForMobile = (text: string): string => {
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    
    for (const line of lines) {
      // Skip empty lines, headers, and separators
      if (!line.trim() || line.trim().startsWith('=') || line.trim().endsWith(':')) {
        formattedLines.push(line);
        continue;
      }
      
      // Check if line matches pattern: "command                    - description"
      const match = line.match(/^(\S+(?:\s+\S+)*?)\s{2,}-\s+(.+)$/);
      if (match) {
        const command = match[1].trim();
        const description = match[2].trim();
        // Format as: "command\n  → description" for mobile
        formattedLines.push(command);
        formattedLines.push(`  → ${description}`);
      } else {
        // Keep original line if it doesn't match the pattern
        formattedLines.push(line);
      }
    }
    
    return formattedLines.join('\n');
  };

  useEffect(() => {
    scrollToBottom();
  }, [commands, typingCommands]);

  // Check if mobile on mount and window resize, and calculate bottom offset
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        // Calculate the difference between window height and visual viewport
        // This gives us the browser UI height (address bar + navigation bar)
        let browserUIHeight = 0;
        
        if (window.visualViewport) {
          // Visual Viewport API: window.innerHeight includes browser UI
          // visualViewport.height is the actual visible content area
          // The difference is the browser UI at the bottom
          const windowHeight = window.innerHeight;
          const visualHeight = window.visualViewport.height;
          // Bottom browser UI = total window height - visual viewport height
          browserUIHeight = Math.max(0, windowHeight - visualHeight);
        } else {
          // Fallback: estimate based on outerHeight vs innerHeight
          browserUIHeight = Math.max(0, window.outerHeight - window.innerHeight);
        }
        
        // Get safe area inset (for device notches/home indicators)
        const safeAreaBottom = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('env(safe-area-inset-bottom)') || '0', 
          10
        ) || 0;
        
        // Bottom offset = browser navigation bar height + safe area
        // No extra buffer needed - position it exactly above the browser UI
        const calculatedOffset = browserUIHeight + safeAreaBottom;
        setBottomOffset(Math.max(0, calculatedOffset));
      } else {
        setBottomOffset(0);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);
    
    // Listen to visual viewport changes if available
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', checkMobile);
      window.visualViewport.addEventListener('scroll', checkMobile);
    }
    
    // Check multiple times to catch browser UI animations
    setTimeout(checkMobile, 100);
    setTimeout(checkMobile, 500);
    setTimeout(checkMobile, 1000);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', checkMobile);
        window.visualViewport.removeEventListener('scroll', checkMobile);
      }
    };
  }, []);

  // Update autocomplete suggestion when input changes
  useEffect(() => {
    if (currentInput && historyIndex === -1) {
      const suggestion = getAutocompleteSuggestion(currentInput);
      setAutocompleteSuggestion(suggestion);
    } else {
      setAutocompleteSuggestion('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput, historyIndex]);

  useEffect(() => {
    if (initialCommands.length > 0 && !initialCommandsRun.current) {
      initialCommandsRun.current = true;
      const runInitialCommands = async () => {
        for (const cmd of initialCommands) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const output = executeCommand(cmd, []);
          // Skip typing animation for special animations
          if (output === 'MATRIX_ANIMATION' || output === 'HACK_ANIMATION') {
            const newCommand: Command = {
              input: cmd,
              output: output,
              timestamp: new Date(),
              isTyping: false,
            };
            setCommands(prev => [...prev, newCommand]);
            setTimeout(() => scrollToBottom(), 100);
          } else {
            await addTypingCommand(cmd, output, 20);
          }
        }
      };
      runInitialCommands();
    }
  }, [initialCommands, addTypingCommand, executeCommand]);

  return (
    <div 
      className="console-container scanlines terminal-flicker glitch-text" 
      ref={consoleRef}
      style={{
        backgroundColor: '#000000',
        color: '#00ff00',
        fontFamily: 'Press Start 2P, monospace',
        border: '3px solid #00ff00',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1)',
        height: '100%',
        width: '100%',
        minHeight: '100%',
        padding: isMobile ? '5px' : '8px',
        paddingTop: isMobile ? 'max(env(safe-area-inset-top, 0px), 5px)' : '8px',
        paddingLeft: isMobile ? 'max(env(safe-area-inset-left, 0px), 5px)' : '8px',
        paddingRight: isMobile ? 'max(env(safe-area-inset-right, 0px), 5px)' : '8px',
        paddingBottom: isMobile ? '0' : '8px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div className="console-header" style={{ 
        color: '#00ff00', 
        borderBottom: '2px solid #00ff00', 
        paddingBottom: '5px',
        textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
        boxShadow: '0 5px 15px rgba(0, 255, 0, 0.3)',
        flexShrink: 0,
        paddingTop: '5px',
        position: 'relative',
        zIndex: 10000
      }}>
        <div className="ascii-art" style={{
          fontFamily: 'Press Start 2P, monospace',
          fontSize: isMobile ? '6px' : '10px',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
          whiteSpace: 'pre',
          margin: '5px 0',
          letterSpacing: isMobile ? '1px' : '2px',
          lineHeight: isMobile ? '1.2' : '1.5'
        }}>
{`JOSEPH HUGHES - BLOCKCHAIN ENTHUSIAST`}
        </div>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: isMobile ? '3px' : '10px',
          position: 'relative'
        }}>
          <div style={{ 
            fontSize: isMobile ? '6px' : '10px',
            color: '#00ff00',
            opacity: 0.9,
            textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00, 0 0 20px #00ff00'
          }}>
            INTERACTIVE PORTFOLIO CONSOLE v1.1.3
          </div>
          <button
            onClick={() => setShowHelpPopup(!showHelpPopup)}
            style={{
              background: 'transparent',
              border: '2px solid #00ff00',
              color: '#00ff00',
              fontFamily: 'Press Start 2P, monospace',
              fontSize: isMobile ? '8px' : '12px',
              padding: isMobile ? '4px 8px' : '6px 12px',
              cursor: 'pointer',
              textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              transition: 'all 0.2s ease',
              position: 'relative',
              zIndex: 1000
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
            }}
          >
            ?
          </button>
        </div>
        {showHelpPopup && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '10px',
              backgroundColor: '#000000',
              border: '3px solid #00ff00',
              padding: isMobile ? '10px' : '15px',
              maxWidth: isMobile ? '90vw' : '500px',
              maxHeight: '70vh',
              overflowY: 'auto',
              zIndex: 10001,
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.8), inset 0 0 20px rgba(0, 255, 0, 0.1)',
              fontFamily: 'Press Start 2P, monospace',
              fontSize: isMobile ? '8px' : '10px',
              lineHeight: '1.6',
              color: '#00ff00',
              textShadow: '0 0 5px #00ff00'
            }}
          >
            <div style={{ 
              borderBottom: '2px solid #00ff00', 
              paddingBottom: '8px', 
              marginBottom: '10px',
              fontSize: isMobile ? '9px' : '11px',
              fontWeight: 'bold'
            }}>
              AVAILABLE COMMANDS
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {renderTextWithClickableCommands(
                isMobile ? formatHelpForMobile(fileSystem['help.txt']) : fileSystem['help.txt']
              )}
            </div>
            <button
              onClick={() => setShowHelpPopup(false)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'transparent',
                border: '1px solid #00ff00',
                color: '#00ff00',
                fontFamily: 'Press Start 2P, monospace',
                fontSize: '8px',
                padding: '2px 6px',
                cursor: 'pointer',
                textShadow: '0 0 5px #00ff00'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ 
          fontSize: isMobile ? '5px' : '8px',
          color: '#00ff00',
          marginTop: isMobile ? '2px' : '5px',
          opacity: 0.7,
          textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
          display: isMobile ? 'none' : 'block'
        }}>
          Type &apos;help&apos; for available commands • Press ↑/↓ for command history • Click files in &apos;ls&apos; output
        </div>
      </div>
      
      <div 
        ref={contentRef}
        style={{ 
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: isMobile ? `${formHeight + bottomOffset + 5}px` : '5px',
          paddingRight: '5px',
          paddingBottom: isMobile ? '10px' : '0',
          WebkitOverflowScrolling: 'touch',
          minHeight: 0,
          maxHeight: '100%'
        }}>
        {commands.map((command, index) => (
          <div key={`${command.timestamp.getTime()}-${command.input}-${index}`} style={{ marginBottom: '10px' }}>
            <div className="command-line" style={{
              display: 'flex',
              alignItems: 'center',
              margin: '5px 0',
              padding: '8px 0',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}>
              <span style={{ 
                color: '#00ff00', 
                fontWeight: 'normal',
                userSelect: 'none',
                textShadow: '0 0 4px #00ff00, 0 0 8px rgba(0, 255, 0, 0.6)'
              }}>d2dreamer@portfolio:~$</span>
              <span style={{ 
                color: '#00ff00', 
                marginLeft: '10px',
                textShadow: '0 0 4px #00ff00, 0 0 8px #00ff00, 0 0 12px rgba(0, 255, 0, 0.5)'
              }}>{command.input}</span>
            </div>
            {command.output && (
              <div style={{
                color: '#00ff00',
                margin: '10px 0',
                whiteSpace: 'pre-wrap',
                backgroundColor: '#000000',
                padding: '15px',
                border: '2px solid #00ff00',
                marginLeft: '20px',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                textShadow: '0 0 4px #00ff00, 0 0 8px #00ff00, 0 0 12px rgba(0, 255, 0, 0.6)',
                letterSpacing: '0.5px'
              }}>
                {command.input === 'ls' ? (
                  <div>
                    {command.output.split('\n').map((line, index) => {
                      if (!line.trim()) return null;
                      // Extract icon and filename more reliably
                      // Format is: [ICON] filename or [ICON]  filename (with spaces)
                      const parts = line.trim().split(/\s+/);
                      const icon = parts[0];
                      const filename = parts.slice(1).join(' ').trim();
                      
                      if (!filename) return null; // Skip if no filename found
                      
                      return (
                        <div key={index} style={{ marginBottom: '5px' }}>
                          <span style={{ color: '#00ff00', textShadow: '0 0 5px #00ff00' }}>
                            {icon} 
                          </span>
                          <button
                            onClick={() => handleFileClick(filename)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#00ff00',
                              fontFamily: 'Press Start 2P, monospace',
                              fontSize: '12px',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
                              padding: '2px 4px',
                              margin: '0',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = '#00cc00';
                              e.currentTarget.style.textShadow = '0 0 10px #00ff00, 0 0 20px #00ff00';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = '#00ff00';
                              e.currentTarget.style.textShadow = '0 0 5px #00ff00, 0 0 10px #00ff00';
                            }}
                          >
                            {filename}
                          </button>
                        </div>
                      );
                    })}
                    {command.isTyping && (
                      <span style={{
                        animation: 'blink 1s infinite',
                        color: '#00ff00',
                        fontWeight: 'bold'
                      }}>█</span>
                    )}
                  </div>
                ) : command.output === 'MATRIX_ANIMATION' ? (
                  <MatrixAnimation onScroll={scrollToBottom} />
                ) : command.output === 'HACK_ANIMATION' ? (
                  <HackAnimation animationKey={`${command.timestamp.getTime()}-${command.input}`} onScroll={scrollToBottom} />
                ) : command.input === 'cat README.md' || (command.input.startsWith('cat ') && command.input.includes('README.md')) ? (
                  <>
                    {command.output.split('\n').map((line, lineIndex, lines) => (
                      <React.Fragment key={lineIndex}>
                        {renderTextWithClickableCommands(line)}
                        {lineIndex < lines.length - 1 && '\n'}
                      </React.Fragment>
                    ))}
                    {command.isTyping && (
                      <span style={{
                        animation: 'blink 1s infinite',
                        color: '#00ff00',
                        fontWeight: 'bold'
                      }}>█</span>
                    )}
                  </>
                ) : command.input === 'help' || command.input === 'cat help.txt' ? (
                  <>
                    {(isMobile ? formatHelpForMobile(command.output) : command.output)
                      .split('\n')
                      .map((line, lineIndex, lines) => (
                        <React.Fragment key={lineIndex}>
                          {renderTextWithClickableCommands(line)}
                          {lineIndex < lines.length - 1 && '\n'}
                        </React.Fragment>
                      ))}
                    {command.isTyping && (
                      <span style={{
                        animation: 'blink 1s infinite',
                        color: '#00ff00',
                        fontWeight: 'bold'
                      }}>█</span>
                    )}
                  </>
                ) : (
                  <>
                    {command.output.split('\n').map((line, lineIndex, lines) => (
                      <React.Fragment key={lineIndex}>
                        {renderTextWithLinks(line)}
                        {lineIndex < lines.length - 1 && '\n'}
                      </React.Fragment>
                    ))}
                    {command.isTyping && (
                      <span style={{
                        animation: 'blink 1s infinite',
                        color: '#00ff00',
                        fontWeight: 'bold'
                      }}>█</span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <form 
        ref={(el) => {
          if (el && isMobile) {
            // Measure form height including all padding
            const height = el.offsetHeight;
            setFormHeight(height);
          }
        }}
        onSubmit={handleSubmit} 
        style={{ 
          flexShrink: 0,
          position: isMobile ? 'absolute' : 'relative',
          bottom: isMobile ? `${bottomOffset}px` : 'auto',
          left: isMobile ? '0' : 'auto',
          right: isMobile ? '0' : 'auto',
          backgroundColor: '#000000',
          paddingTop: isMobile ? '12px' : '5px',
          paddingLeft: isMobile ? 'max(env(safe-area-inset-left, 0px), 13px)' : '0',
          paddingRight: isMobile ? 'max(env(safe-area-inset-right, 0px), 13px)' : '0',
          paddingBottom: isMobile ? 'env(safe-area-inset-bottom, 0px)' : '0',
          zIndex: 100,
          marginTop: isMobile ? '0' : 'auto',
          width: isMobile ? '100%' : 'auto',
          boxSizing: 'border-box',
          borderTop: isMobile ? '3px solid rgba(0, 255, 0, 0.8)' : 'none',
          boxShadow: isMobile ? '0 -10px 30px rgba(0, 0, 0, 1)' : 'none',
          backdropFilter: isMobile ? 'blur(0px)' : 'none'
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '2px 0',
          padding: isMobile ? '5px 0' : '8px 0',
          backgroundColor: '#000000',
          border: '1px solid transparent',
          transition: 'all 0.2s',
          position: 'relative'
        }}>
          <span style={{ 
            color: '#00ff00', 
            fontWeight: 'normal',
            userSelect: 'none',
            textShadow: '0 0 5px #00ff00',
            fontSize: isMobile ? '8px' : '12px',
            display: isMobile ? 'none' : 'inline'
          }}>d2dreamer@portfolio:~$</span>
          <div style={{ position: 'relative', flex: 1, marginLeft: isMobile ? '5px' : '10px' }}>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: isMobile ? '1px solid #00ff00' : '2px solid #00ff00',
                color: '#00ff00',
                fontFamily: 'Press Start 2P, monospace',
                fontSize: isMobile ? '11px' : '12px',
                outline: 'none',
                width: '100%',
                caretColor: '#00ff00',
                textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                padding: isMobile ? '12px 10px' : '5px 10px',
                position: 'relative',
                zIndex: 2,
                WebkitAppearance: 'none',
                borderRadius: '0',
                minHeight: isMobile ? '44px' : 'auto'
              }}
              placeholder={isMobile ? "Command..." : "Type a command..."}
              autoFocus={!isMobile}
            />
            {autocompleteSuggestion && autocompleteSuggestion.toLowerCase() !== currentInput.toLowerCase() && autocompleteSuggestion.toLowerCase().startsWith(currentInput.toLowerCase()) && (
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '10px',
                  color: '#00ff00',
                  fontFamily: 'Press Start 2P, monospace',
                  fontSize: '12px',
                  opacity: 0.7,
                  pointerEvents: 'none',
                  whiteSpace: 'pre',
                  textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px rgba(0, 255, 0, 0.5)',
                  zIndex: 1
                }}
              >
                {autocompleteSuggestion}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Console;
