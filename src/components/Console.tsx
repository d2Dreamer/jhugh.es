import React, { useState, useEffect, useRef } from 'react';

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

const Console: React.FC<ConsoleProps> = ({ initialCommands = [] }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialCommandsRun = useRef(false);
  const [typingCommands, setTypingCommands] = useState<Command[]>([]);

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

EXAMPLES:
$ cat about.txt
$ ls
$ neofetch
$ github
$ social
$ status
$ clear`,

    'README.md': `JOSEPH HUGHES - PORTFOLIO
========================

Welcome to my interactive console portfolio!

This is a terminal-style CV website built with Next.js and TypeScript.

QUICK START
-----------
- Type 'help' to see available commands
- Use 'ls' to list all files
- Use 'cat <filename>' to read files
- Type 'clear' to reset the console

NAVIGATION
----------
- about.txt      - Personal information
- experience.txt - Work history
- skills.txt     - Technical skills
- projects.txt   - Featured projects
- contact.txt    - Contact information

Enjoy exploring! 🚀`
  };

  const executeCommand = (input: string, commandsArray: Command[] = []): string => {
    const cmd = input.trim().toLowerCase();
    const parts = input.trim().split(' ');

    switch (parts[0]) {
      case 'ls':
        return Object.keys(fileSystem)
          .map(filename => `${getFileIcon(filename)} ${filename}`)
          .join('\n');
      
      case 'cat':
        if (parts[1]) {
          const filename = parts[1];
          if (fileSystem[filename as keyof typeof fileSystem]) {
            return fileSystem[filename as keyof typeof fileSystem];
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
        return `Opening resume...\n\n📄 Coming soon\n\nAlternatively, use 'cat contact.txt' for contact information.`;

      case 'cv':
        return `Opening resume...\n\n📄 Coming soon\n\nAlternatively, use 'cat contact.txt' for contact information.`;
      
      case 'github':
        return `Opening GitHub profile...\n\n🔗 https://github.com/d2Dreamer\n\nCheck out my repositories and contributions!`;
      
      case 'linkedin':
        return `Opening LinkedIn profile...\n\n🔗 https://www.linkedin.com/in/jhughes-dev\n\nConnect with me on LinkedIn!`;
      
      case 'email':
        return `📧 joe@investinsight.io\n\nFeel free to reach out for opportunities or collaboration!`;
      
      case 'version':
        return `Console Portfolio v1.0.2\nBuilt with Next.js, TypeScript, and React\nLast updated: ${new Date().toLocaleDateString()}`;
      
      case 'uptime':
        const uptime = Date.now() - (window.performance.timing.navigationStart || 0);
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `System uptime: ${hours}h ${minutes % 60}m ${seconds % 60}s`;
      
      case 'neofetch':
        return `OS: Portfolio Console v1.0.2
Host: d2dreamer-portfolio
Kernel: Next.js 13.2.4
Uptime: ${Math.floor((Date.now() - (window.performance.timing.navigationStart || 0)) / 1000)}s
Shell: Interactive Console
Terminal: Web Browser
CPU: JavaScript Engine
Memory: Dynamic
Theme: 8-bit Green
Icons: ASCII`;

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
      
      case '':
        return '';
      
      default:
        return `Command not found: ${parts[0]}. Type 'help' for available commands.`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    const input = currentInput;
    const output = executeCommand(input, commands);
    
    // Add command to history immediately
    setCommandHistory(prev => [...prev, input]);
    setCurrentInput('');
    setHistoryIndex(-1);

    // Use typing animation for better UX
    await addTypingCommand(input, output, 15);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
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

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  const handleFileClick = async (filename: string) => {
    const output = executeCommand(`cat ${filename}`, commands);
    await addTypingCommand(`cat ${filename}`, output, 15);
  };

  const addTypingCommand = async (input: string, output: string, speed: number = 20) => {
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
      // Regular typing for other commands
      let typedOutput = '';
      for (let i = 0; i < output.length; i++) {
        typedOutput += output[i];
        setCommands(prev => 
          prev.map((cmd, index) => 
            index === prev.length - 1 
              ? { ...cmd, output: typedOutput, isTyping: i < output.length - 1 }
              : cmd
          )
        );
        
        // Scroll to bottom during typing
        setTimeout(() => scrollToBottom(), 0);
        
        await new Promise(resolve => setTimeout(resolve, speed));
      }
    }
    
    setTypingCommands(prev => prev.slice(1));
    
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
    // URL regex pattern - matches http, https, and email addresses
    const urlRegex = /(https?:\/\/[^\s]+|[\w.-]+@[\w.-]+\.\w+)/g;
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
      const href = isEmail ? `mailto:${url}` : url;

      // Add clickable link
      parts.push(
        <a
          key={match.index}
          href={href}
          target={isEmail ? undefined : "_blank"}
          rel={isEmail ? undefined : "noopener noreferrer"}
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

  useEffect(() => {
    scrollToBottom();
  }, [commands, typingCommands]);

  useEffect(() => {
    if (initialCommands.length > 0 && !initialCommandsRun.current) {
      initialCommandsRun.current = true;
      const runInitialCommands = async () => {
        for (const cmd of initialCommands) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const output = executeCommand(cmd, []);
          await addTypingCommand(cmd, output, 20);
        }
      };
      runInitialCommands();
    }
  }, [initialCommands, addTypingCommand, executeCommand]);

  return (
    <div 
      className="console-container scanlines terminal-flicker" 
      ref={consoleRef}
      style={{
        backgroundColor: '#000000',
        color: '#00ff00',
        fontFamily: 'Press Start 2P, monospace',
        border: '3px solid #00ff00',
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1)',
        height: '100vh',
        width: '100vw',
        padding: '15px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="console-header" style={{ 
        color: '#00ff00', 
        borderBottom: '3px solid #00ff00', 
        paddingBottom: '10px',
        textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
        boxShadow: '0 5px 15px rgba(0, 255, 0, 0.3)',
        flexShrink: 0
      }}>
        <div className="ascii-art" style={{
          fontFamily: 'Press Start 2P, monospace',
          fontSize: '10px',
          color: '#00ff00',
          textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00',
          whiteSpace: 'pre',
          margin: '10px 0',
          letterSpacing: '2px'
        }}>
{`JOSEPH HUGHES - BLOCKCHAIN ENTHUSIAST`}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: '#00ff00', 
          marginTop: '10px', 
          opacity: 0.9,
          textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00, 0 0 20px #00ff00'
        }}>
          INTERACTIVE PORTFOLIO CONSOLE v1.0.2
        </div>
        <div style={{ 
          fontSize: '8px', 
          color: '#00ff00', 
          marginTop: '5px', 
          opacity: 0.7,
          textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00'
        }}>
          Type &apos;help&apos; for available commands • Press ↑/↓ for command history • Click files in &apos;ls&apos; output
        </div>
      </div>
      
      <div 
        ref={contentRef}
        style={{ 
          flex: 1,
          overflowY: 'auto',
          marginBottom: '10px',
          paddingRight: '5px'
        }}>
        {commands.map((command, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div className="command-line" style={{
              display: 'flex',
              alignItems: 'center',
              margin: '5px 0',
              padding: '8px 0',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}>
              <span style={{ 
                color: '#00ff00', 
                fontWeight: 'normal',
                userSelect: 'none',
                textShadow: '0 0 5px #00ff00'
              }}>d2dreamer@portfolio:~$</span>
              <span style={{ 
                color: '#00ff00', 
                marginLeft: '10px',
                textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00'
              }}>{command.input}</span>
            </div>
            {command.output && (
              <div style={{
                color: '#00ff00',
                margin: '10px 0',
                whiteSpace: 'pre-wrap',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: '15px',
                border: '2px solid #00ff00',
                marginLeft: '20px',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00'
              }}>
                {command.input === 'ls' ? (
                  <div>
                    {command.output.split('\n').map((line, index) => {
                      if (!line.trim()) return null;
                      const parts = line.split(' ');
                      const icon = parts[0];
                      const filename = parts.slice(1).join(' ');
                      
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

      <form onSubmit={handleSubmit} style={{ flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '5px 0',
          padding: '8px 0',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid transparent',
          transition: 'all 0.2s'
        }}>
          <span style={{ 
            color: '#00ff00', 
            fontWeight: 'normal',
            userSelect: 'none',
            textShadow: '0 0 5px #00ff00'
          }}>d2dreamer@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: '2px solid #00ff00',
              color: '#00ff00',
              fontFamily: 'Press Start 2P, monospace',
              fontSize: '12px',
              outline: 'none',
              width: '100%',
              marginLeft: '10px',
              caretColor: '#00ff00',
              textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3), inset 0 0 10px rgba(0, 255, 0, 0.1)',
              padding: '5px 10px'
            }}
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  );
};

export default Console;
