import { Facebook, Twitter, Linkedin, Github, Mail, MapPin, Phone, Terminal, Activity, Shield, Zap, Server } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Clock from './Clock';

export default function Footer() {
  const [cpu, setCpu] = useState(12);
  const [ram, setRam] = useState(38);
  const [uptime, setUptime] = useState(0);
  const [access, setAccess] = useState(false);
  const [_systemId, _setSystemId] = useState(() => Math.floor(Math.random()*9999));
  const [visitors] = useState(Math.floor(Math.random()*5000));
  const [user, setUser] = useState<"guest" | "root">("guest");
  const [loginUser, setLoginUser] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [bootSequenceShown, setBootSequenceShown] = useState(false);
  const [_theme, _setTheme] = useState<"cyan" | "green" | "amber" | "red">("cyan");
  const [dynamicFiles, setDynamicFiles] = useState<Record<string, { type: "file" | "dir", content?: string, path: string }>>({});
  const [nanoMode, setNanoMode] = useState(false);
  const [nanoFile, setNanoFile] = useState("");
  const [nanoContent, setNanoContent] = useState("");
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [showFloatingTerminal, setShowFloatingTerminal] = useState(false);
  const [activeNode, setActiveNode] = useState("ANDSOFT-CORE");
  const [_aiOnline, _setAiOnline] = useState(false);
  const [_systemCrashed, _setSystemCrashed] = useState(false);
  const [history, setHistory] = useState<Array<{ text: string; type: "input" | "output" | "error" | "system" }>>([
    { text: "System initialized.", type: "system" },
    { text: "Type 'help' to see available commands.", type: "system" }
  ]);
  const [input, setInput] = useState("");
  const [termSize, setTermSize] = useState("normal");
  const [currentDir, setCurrentDir] = useState("/home/guest");
  const [prevDir, setPrevDir] = useState("/home/guest");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const termHeight =
    termSize === "small"
      ? "h-[150px]"
      : termSize === "large"
      ? "h-[340px]"
      : termSize === "full"
      ? "h-[480px]"
      : "h-[220px]";

  const themeColor = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    amber: "text-amber-400",
    red: "text-red-400"
  }[_theme];

  const themeBright = {
    cyan: "text-cyan-300/90",
    green: "text-green-300/90",
    amber: "text-amber-300/90",
    red: "text-red-300/90"
  }[_theme];

  const themeDim = {
    cyan: "text-cyan-500/40",
    green: "text-green-500/40",
    amber: "text-amber-500/40",
    red: "text-red-500/40"
  }[_theme];

  const themeBorder = {
    cyan: "border-cyan-500/10",
    green: "border-green-500/10",
    amber: "border-amber-500/10",
    red: "border-red-500/10"
  }[_theme];

  const themeBg = {
    cyan: "bg-cyan-400/[0.06]",
    green: "bg-green-400/[0.06]",
    amber: "bg-amber-400/[0.06]",
    red: "bg-red-400/[0.06]"
  }[_theme];

  const fileSystem = {
    "/": ["home"],
    "/home": ["guest"],
    "/home/guest": ["about.txt", "contact.md", "system.log", "projects"],
    "/home/guest/projects": ["project1.txt", "project2.txt"]
  };

  const fileContents = {
    "about.txt": `AndSoft Global Partner

We operate across multiple digital sectors.

Infrastructure.
Security.
Control.

Partner nodes active worldwide.`,

    "contact.md": `Contact Protocol

Phone: +976 99212999
Signal: ACTIVE
Node: ANDSOFT_CORE

Authorized access only.`,

    "system.log": `[ OK ] kernel loaded
[ OK ] memory initialized
[ OK ] network connected
[ OK ] interface ready`,

    "project1.txt": `Project: AndSoft Portal
Status: In Development
Progress: 75%`,

    "project2.txt": `Project: Neural Interface
Status: Beta Testing
Progress: 45%`
  };

  const fsocietySpeech = `Are you a one or a zero?

In this world, there are two kinds of people.

Those who control.
And those who are controlled.

The ones who wake up and see the system.
And the zeros who live inside it.

The question is not what you are now.

The question is…

What do you choose to be.`;



  const progressBar = (percent: number): string => {
    const filled = Math.floor(percent / 10);
    return `[${("█".repeat(filled))}${("░".repeat(10 - filled))}] ${percent}%`;
  };

  const requireRoot = async (): Promise<boolean> => {
    if (user !== "root") {
      await typeText("Permission denied.", "error");
      return false;
    }
    return true;
  };

  const resolvePath = (target: string): string => {
    if (target === "/") return "/";
    if (target === "~") return "/home/guest";
    if (target === "-") return prevDir || "/home/guest";
    if (target.startsWith("/")) return target;
    if (target === "..") {
      const parts = currentDir.split("/");
      parts.pop();
      return parts.join("/") || "/";
    }
    return currentDir === "/"
      ? `/${target}`
      : `${currentDir}/${target}`;
  };

  const typeText = async (text: string, type: "output" | "error" | "system" = "output"): Promise<void> => {
    setIsTyping(true);
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      // Play typing sound every 3 characters
      if (i % 3 === 0) {
        playTypeSound();
      }

      setHistory(prev => {
        const newHistory = [...prev];

        if (
          newHistory.length > 0 &&
          newHistory[newHistory.length - 1].type === type &&
          newHistory[newHistory.length - 1].text.startsWith(current.slice(0, -1))
        ) {
          newHistory[newHistory.length - 1] = {
            text: current,
            type
          };
        } else {
          newHistory.push({
            text: current,
            type
          });
        }

        return newHistory;
      });

      await new Promise(r => setTimeout(r, 20));
    }

    setIsTyping(false);
  };

  const commands = {
    help: () => `help       list commands
ls         list files
cd         change directory
cat        read file
pwd        show current directory
whoami     show user
date       system date
uname      system info
clear      clear terminal
echo       print text
sudo       system admin commands
clock      show time
login      login to system
hack       inject payload [ROOT]
netmap     show network map
andsoft    secret command
touch      create file
mkdir      make directory
rm         remove file [ROOT]
nano       edit file
ps         process list
ai         AI assistant
connect    connect to node
theme      change theme color
crash      crash system [ROOT]`,

    ls: (): string => {
      const staticItems = fileSystem[currentDir as keyof typeof fileSystem] || [];
      const dynamicItems = Object.values(dynamicFiles)
        .filter(file => {
          const parent = file.path.substring(0, file.path.lastIndexOf("/")) || "/";
          return parent === currentDir;
        })
        .map(file => {
          const name = file.path.split("/").pop();
          return file.type === "dir"
            ? `[BLUE]${name}[/BLUE]`
            : `[GRAY]${name}[/GRAY]`;
        });
      return [...staticItems.map(i => `[GRAY]${i}[/GRAY]`), ...dynamicItems].join("   ");
    },

    cd: async (args: string[]): Promise<string> => {
      const target = args[0] || "~";
      const newPath = resolvePath(target);

      if (fileSystem[newPath as keyof typeof fileSystem]) {
        setPrevDir(currentDir);
        setCurrentDir(newPath);
        return "";
      }

      const dynamicDir = Object.values(dynamicFiles)
        .find(file => file.type === "dir" && file.path === newPath);

      if (dynamicDir) {
        setPrevDir(currentDir);
        setCurrentDir(newPath);
        return "";
      }

      return `cd: no such directory: ${target}`;
    },

    cat: async (args: string[]): Promise<string> => {
      const file = args[0];
      if (!file) return "usage: cat <file>";
      
      const fullPath = `${currentDir}/${file}`.replace("//", "/");
      const dynamicFile = Object.values(dynamicFiles).find(f => f.path === fullPath && f.type === "file");
      
      if (dynamicFile && dynamicFile.content) {
        await typeText(dynamicFile.content);
        return "";
      }
      
      const content = fileContents[file as keyof typeof fileContents];
      if (!content) return "cat: no such file";
      
      await typeText(content);
      return "";
    },

    whoami: (): string => user,

    pwd: (): string => currentDir,

    date: (): string => new Date().toString(),

    uname: (): string => "Linux andsoft 6.1.0 x86_64",

    echo: (args: string[]): string => args.join(" "),

    clear: (): string => "__CLEAR__",

    sudo: async (args: string[]): Promise<string> => {
      const sub = args.join(" ");

      if (sub === "apt install") {
        await typeText(fsocietySpeech);
        setHistory(prev => [
          ...prev,
          {
            text: "[ENTER 1 OR 0]",
            type: "system"
          }
        ]);
        setAwaitingChoice(true);
        return "";
      }

      if (sub === "apt update") {
        await typeText(`Get:1 andsoft core packages
Get:2 security modules
Fetched 12.4 MB in 2s

Reading package lists...  Done`);
        return "";
      }

      if (sub === "apt upgrade") {
        setAwaitingChoice(true);
        await typeText("Are you a one or a zero?");
        return "";
      }

      return "sudo: command not found";
    },

    tree: (): string => `
/
└── home
    └── guest
        ├── about.txt
        ├── contact.md
        ├── system.log
        └── projects
            ├── project1.txt
            └── project2.txt
`,

    neofetch: (): string => `
AndSoft OS v1.0
─────────────────
Kernel: 6.1.0 x86_64
CPU: ${cpu}%
RAM: ${ram}%
Uptime: ${uptime}s
Node: AX-${_systemId}
Status: ONLINE
`,

    scan: async (): Promise<string> => {
      await typeText("Scanning network...");
      await typeText("Node detected: CORE-AX");
      await typeText("Security: ACTIVE");
      await typeText("Threat level: NONE");
      return "";
    },

    clock: (): string => new Date().toLocaleTimeString(),

    login: async (args: string[]): Promise<string> => {
      const username = args[0] || "root";
      if (username === "root") {
        setLoginUser("root");
        await typeText("Password: ");
        setAwaitingChoice(true);
        return "";
      }
      return `login: user '${username}' does not exist`;
    },

    andsoft: async (): Promise<string> => {
      await typeText("Welcome, operator.");
      await typeText("You have root access.");
      await typeText("System decrypted.");
      return "";
    },

    hack: async (): Promise<string> => {
      if (!await requireRoot()) return "";
      
      for (let i = 0; i <= 100; i += 10) {
        await typeText(progressBar(i));
      }
      await typeText("Root exploit successful.");
      return "";
    },

    netmap: (): string => `
   USER
    │
  ANDSOFT
  /     \\
 NODE1  NODE2

Network Status: CONNECTED
`,

    touch: (args: string[]): string => {
      const name = args[0];
      if (!name) return "usage: touch <filename>";
      const fullPath = `${currentDir}/${name}`.replace("//", "/");
      setDynamicFiles(prev => ({
        ...prev,
        [fullPath]: {
          type: "file",
          content: "",
          path: fullPath
        }
      }));
      return `created ${name}`;
    },

    mkdir: (args: string[]): string => {
      const name = args[0];
      if (!name) return "usage: mkdir <dirname>";
      const fullPath = `${currentDir}/${name}`.replace("//", "/");
      setDynamicFiles(prev => ({
        ...prev,
        [fullPath]: {
          type: "dir",
          path: fullPath
        }
      }));
      return `directory created: ${name}`;
    },

    rm: async (args: string[]): Promise<string> => {
      if (!await requireRoot()) return "";
      const name = args[0];
      if (!name) return "usage: rm <file>";
      const fullPath = `${currentDir}/${name}`.replace("//", "/");
      setDynamicFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fullPath];
        return newFiles;
      });
      return `removed ${name}`;
    },

    nano: async (args: string[]): Promise<string> => {
      const file = args[0];
      if (!file) {
        await typeText("usage: nano <filename>");
        return "";
      }
      setNanoFile(file);
      const fullPath = `${currentDir}/${file}`.replace("//", "/");
      const dynamicFile = Object.values(dynamicFiles).find(f => f.path === fullPath && f.type === "file");
      if (dynamicFile) {
        setNanoContent(dynamicFile.content || "");
      } else if (fileContents[file as keyof typeof fileContents]) {
        setNanoContent(fileContents[file as keyof typeof fileContents]);
      } else {
        setNanoContent("");
      }
      setNanoMode(true);
      return "";
    },

    ps: (): string => {
      return `PID   NAME
102   andsoft-core
211   network-daemon
334   security-module
445   ai-monitor
556   firewall-service`;
    },

    ai: async (): Promise<string> => {
      await typeText("AI CORE INITIALIZING...");
      _setAiOnline(true);
      await typeText("AI CORE ONLINE");
      await typeText("Monitoring system.");
      await typeText("Ready for commands.");
      return "";
    },

    connect: async (args: string[]): Promise<string> => {
      const node = args[0] || "node1";
      setActiveNode(node.toUpperCase());
      _setSystemId(Math.floor(Math.random()*9999));
      await typeText(`Connecting to ${node}...`);
      await typeText("Connection established.");
      return "";
    },

    theme: async (args: string[]): Promise<string> => {
      const newTheme = args[0] as "cyan" | "green" | "amber" | "red";
      if (!["cyan", "green", "amber", "red"].includes(newTheme)) {
        return "Available themes: cyan, green, amber, red";
      }
      _setTheme(newTheme);
      await typeText(`Theme changed to ${newTheme}`);
      return "";
    },

    attack: async (): Promise<string> => {
      if (!await requireRoot()) return "";
      
      await typeText("USER → NODE → FIREWALL → ACCESS");
      await typeText("");
      await typeText("Penetrating NODE...");
      await typeText(progressBar(33));
      await typeText("");
      await typeText("Breaking FIREWALL...");
      await typeText(progressBar(66));
      await typeText("");
      await typeText("Gaining ACCESS...");
      await typeText(progressBar(100));
      await typeText("");
      await typeText("SYSTEM COMPROMISED");
      return "";
    },

    crash: async (): Promise<string> => {
      if (!await requireRoot()) return "";
      
      _setSystemCrashed(true);
      await typeText("INITIATING SYSTEM SHUTDOWN...");
      await typeText("Terminating all processes...");
      await typeText("");
      await typeText("KERNEL PANIC");
      await typeText("SYSTEM FAILURE");
      await typeText("REBOOT REQUIRED");
      
      setTimeout(async () => {
        _setSystemCrashed(false);
        setBootSequenceShown(false);
        setShowBootScreen(true);
        await new Promise(r => setTimeout(r, 2000));
        setShowBootScreen(false);
        await typeText("[ OK ] System rebooted.", "system");
      }, 3000);
      
      return "";
    },
  };

  const getAutocompleteOptions = (): string[] => {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const parts = trimmed.split(" ");
    const lastPart = parts[parts.length - 1];

    if (parts.length === 1) {
      return Object.keys(commands).filter(cmd => cmd.startsWith(lastPart));
    }

    const items = fileSystem[currentDir as keyof typeof fileSystem] || [];
    return items.filter((item: string) => item.startsWith(lastPart));
  };

  const handleTabComplete = (): void => {
    const options = getAutocompleteOptions();
    if (options.length === 1) {
      const parts = input.trim().split(" ");
      parts[parts.length - 1] = options[0];
      setInput(parts.join(" ") + " ");
    }
  };

  const handleCommand = async (cmd: string): Promise<void> => {
    if (awaitingChoice) {
      // Handle login password
      if (loginUser === "root") {
        setHistory(prev => [
          ...prev,
          { text: `${user}@${activeNode}:~$ Password: ••••`, type: "input" }
        ]);
        setUser("root");
        setHistory(prev => [
          ...prev,
          { text: "Welcome to AndSoft, root.", type: "system" }
        ]);
        setLoginUser("");
        setAwaitingChoice(false);
        return;
      }

      // Handle fsociety choice (1 or 0)
      if (cmd === "1") {
        setHistory(prev => [
          ...prev,
          { text: `${user}@${activeNode}:~$ ` + cmd, type: "input" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "Welcome to fsociety.", type: "output" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "__SHOW_FSOCIETY__", type: "system" }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          { text: `${user}@${activeNode}:~$ ` + cmd, type: "input" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "You are a loser.", type: "error" }
        ]);
        setHistory(prev => [
          ...prev,
          { text: "__SHOW_LOSER__", type: "system" }
        ]);
      }

      setAwaitingChoice(false);
      return;
    }

    const parts = cmd.trim().split(" ");
    const aliases: Record<string, string> = { dir: "ls", cls: "clear", exit: "clear" };
    const base = aliases[parts[0]] || parts[0];
    const args = parts.slice(1);

    if (!cmd.trim()) return;

    setCommandHistory(prev => prev[0] === cmd ? prev : [cmd, ...prev]);

    setHistory(prev => [
      ...prev,
      { text: `${user}@${activeNode}:${currentDir}$ ${cmd}`, type: "input" }
    ]);

    if (commands[base as keyof typeof commands]) {
      const result = await (commands[base as keyof typeof commands] as any)(args);

      if (result === "__CLEAR__") {
        setHistory([]);
      } else {
        if (result) {
          setHistory(prev => [
            ...prev,
            { text: result, type: "output" }
          ]);
        }
      }
    } else {
      setHistory(prev => [
        ...prev,
        { text: `Command not found: ${base}`, type: "error" }
      ]);
    }

    setShowAutocomplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommand(input);
      setInput("");
      setHistoryIndex(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabComplete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex < commandHistory.length) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex === -1) {
        setHistoryIndex(-1);
        setInput("");
      } else if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 5);
      setRam(Math.floor(Math.random() * 60) + 20);
      setUptime(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [history]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("term_history", JSON.stringify(history));
    } catch (e) {
      // Ignore storage errors
    }
  }, [history]);

  // Load persistent login state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_user");
      if (saved === "root") setUser("root");
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  // Save persistent login state
  useEffect(() => {
    try {
      localStorage.setItem("term_user", user);
    } catch (e) {
      // Ignore storage errors
    }
  }, [user]);

  // Load command history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cmd_history");
      if (saved) setCommandHistory(JSON.parse(saved));
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save command history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cmd_history", JSON.stringify(commandHistory));
    } catch (e) {
      // Ignore storage errors
    }
  }, [commandHistory]);

  // Load persistent dynamic files
  useEffect(() => {
    try {
      const saved = localStorage.getItem("term_files");
      if (saved) setDynamicFiles(JSON.parse(saved));
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save persistent dynamic files
  useEffect(() => {
    try {
      localStorage.setItem("term_files", JSON.stringify(dynamicFiles));
    } catch (e) {
      // Ignore storage errors
    }
  }, [dynamicFiles]);

  // Auto-focus terminal
  useEffect(() => {
    if (showTerminal) {
      textareaRef.current?.focus();
    }
  }, [showTerminal]);

  // Matrix rain animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charCount = 50;
    const drops: number[] = [];

    for (let i = 0; i < charCount; i++) {
      drops[i] = Math.random() * canvas.height;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(5, 8, 22, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00d4ff";
      ctx.font = "10px monospace";

      for (let i = 0; i < charCount; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = (i * (canvas.width / charCount)) + Math.random() * 20;
        
        ctx.fillText(char, x, drops[i]);

        if (drops[i] > canvas.height) {
          drops[i] = 0;
        }

        drops[i] += Math.random() * 3 + 1;
      }

      setTimeout(draw, 33);
    };

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Boot sequence on first terminal open
  useEffect(() => {
    if (showTerminal && !bootSequenceShown && showBootScreen) {
      setBootSequenceShown(true);
      const runBootSequence = async () => {
        setTimeout(() => {
          setShowBootScreen(false);
        }, 4000);
        
        // Delay before showing boot messages
        await new Promise(r => setTimeout(r, 4100));
        
        await typeText("[ OK ] Initializing kernel...", "system");
        await typeText("[ OK ] Loading modules...", "system");
        await typeText("[ OK ] Connecting to network...", "system");
        await typeText("[ OK ] AndSoft system ready.", "system");
      };
      runBootSequence();
    }
  }, [showTerminal, bootSequenceShown, showBootScreen]);

  const handleAccess = () => {
    setAccess(true);
    playAccessSound();
    setTimeout(() => setAccess(false), 2000);
  };

  const handleDragStart = () => {
    // Terminal is visually draggable (cursor feedback on titlebar)
    // Full drag implementation can be extended using react-rnd if needed
  };

  // Sound effects using Web Audio API
  const playSound = (frequency: number, duration: number, type: 'sine' | 'square' | 'triangle' = 'sine') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = frequency;
      osc.type = type;
      gain.gain.value = 0.05;

      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, duration * 1000);
    } catch (e) {
      // Audio not supported
    }
  };

  const playTypeSound = () => {
    playSound(800 + Math.random() * 200, 0.05, 'square');
  };

  const playAccessSound = () => {
    playSound(1200, 0.1, 'sine');
    setTimeout(() => playSound(1400, 0.1, 'sine'), 100);
  };

  const statusItems = [
    { label: "NETWORK", value: "ONLINE", color: "text-green-400", icon: <Activity size={14} /> },
    { label: "CPU", value: `${cpu}%`, color: "text-yellow-400", icon: <Zap size={14} /> },
    { label: "RAM", value: `${ram}%`, color: "text-purple-400", icon: <Server size={14} /> },
    { label: "UPTIME", value: `${uptime}s`, color: "text-green-400", icon: <Shield size={14} /> },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient border */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="relative bg-[#050816]/80 backdrop-blur-xl pt-10 pb-6">
        {/* Matrix rain effect */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ display: 'block' }}
        />
        
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-cyan-500/[0.04] blur-[150px] rounded-full -top-60 left-1/4"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-500/[0.03] blur-[120px] rounded-full -bottom-40 right-1/4"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">

          {/* ─── Top: Brand + Contact + System ─── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-10">

            {/* Brand */}
            <div className="md:col-span-5">
              <div className="mb-4">
                <div className="text-3xl font-bold tracking-tight relative inline-block group cursor-pointer">
                  <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">And</span>
                  <span className="text-white/90 group-hover:text-white transition">Soft</span>
                  <div className="absolute -inset-2 bg-cyan-400/0 group-hover:bg-cyan-400/5 blur-xl rounded-full transition-all duration-500 pointer-events-none"></div>
                </div>
              </div>
              <p className="text-gray-400/70 text-sm leading-relaxed max-w-sm mb-6">
                Building the future of digital infrastructure. Secure, scalable, and intelligent solutions for the modern world.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {[
                  { icon: <Github size={16} />, href: "#" },
                  { icon: <Linkedin size={16} />, href: "#" },
                  { icon: <Twitter size={16} />, href: "#" },
                  { icon: <Facebook size={16} />, href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/[0.08] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h4 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
                Contact
              </h4>
              <ul className="space-y-3.5">
                <li className="flex items-center gap-3 text-gray-400/70 text-sm group cursor-default hover:text-gray-300 transition-colors">
                  <div className="p-1.5 rounded-lg bg-cyan-400/[0.06] border border-cyan-500/10 group-hover:border-cyan-500/25 transition">
                    <Phone size={12} className="text-cyan-400/60" />
                  </div>
                  +976 99212999
                </li>
                <li className="flex items-center gap-3 text-gray-400/70 text-sm group cursor-default hover:text-gray-300 transition-colors">
                  <div className="p-1.5 rounded-lg bg-cyan-400/[0.06] border border-cyan-500/10 group-hover:border-cyan-500/25 transition">
                    <Mail size={12} className="text-cyan-400/60" />
                  </div>
                  info@andsoft.mn
                </li>
                <li className="flex items-center gap-3 text-gray-400/70 text-sm group cursor-default hover:text-gray-300 transition-colors">
                  <div className="p-1.5 rounded-lg bg-cyan-400/[0.06] border border-cyan-500/10 group-hover:border-cyan-500/25 transition">
                    <MapPin size={12} className="text-cyan-400/60" />
                  </div>
                  Ulaanbaatar, Mongolia
                </li>
              </ul>
            </div>

            {/* System Status */}
            <div className="md:col-span-4" onClick={handleAccess}>
              <h4 className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-400"></div>
                System Status
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {statusItems.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 hover:bg-cyan-400/[0.04] hover:border-cyan-500/15 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`${item.color} opacity-50 group-hover:opacity-100 transition`}>{item.icon}</span>
                      <span className="text-gray-600 text-[10px] uppercase tracking-wider font-medium">{item.label}</span>
                    </div>
                    <div className={`${item.color} text-xs font-mono font-medium`}>{item.value}</div>
                  </div>
                ))}
              </div>
              {access && (
                <div className="text-cyan-400 text-xs font-mono mt-3 animate-pulse text-center tracking-wider">
                  ● ACCESS GRANTED
                </div>
              )}
            </div>
          </div>

          {/* ─── Terminal (collapsible) ─── */}
          <div className="mb-8">
            {/* Boot Screen Overlay */}
            {showBootScreen && showTerminal && (
              <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] font-mono text-cyan-400 text-sm">
                <div className="text-center space-y-4">
                  <div className="text-lg font-bold mb-8">ANDSOFT BIOS v3.2</div>
                  <div>Initializing hardware...</div>
                  <div>Memory check... <span className="text-green-400">OK</span></div>
                  <div>CPU check... <span className="text-green-400">OK</span></div>
                  <div>Booting kernel...</div>
                  <div className="mt-8 animate-pulse">Starting system...</div>
                </div>
              </div>
            )}

            {/* Nano Editor Overlay */}
            {nanoMode && (
              <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] font-mono">
                <div className="w-[90%] h-[80%] bg-[#0a0e27] border border-cyan-500/30 rounded-lg flex flex-col">
                  <div className="bg-cyan-500/20 px-4 py-2 border-b border-cyan-500/30 flex justify-between items-center">
                    <span className="text-cyan-400 text-sm">GNU nano 7.2  File: {nanoFile}</span>
                    <span className="text-gray-600 text-xs">^X Exit</span>
                  </div>
                  <textarea
                    value={nanoContent}
                    onChange={(e) => setNanoContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.ctrlKey && e.key === 'x') {
                        e.preventDefault();
                        const fullPath = `${currentDir}/${nanoFile}`.replace("//", "/");
                        setDynamicFiles(prev => ({
                          ...prev,
                          [fullPath]: {
                            type: "file",
                            content: nanoContent,
                            path: fullPath
                          }
                        }));
                        setNanoMode(false);
                        setTimeout(() => {
                          typeText(`Saved ${nanoFile}`, "system");
                        }, 100);
                      }
                    }}
                    className="flex-1 bg-transparent text-cyan-300 outline-none p-4 resize-none"
                    autoFocus
                  />
                  <div className="bg-cyan-500/10 px-4 py-2 border-t border-cyan-500/30 text-cyan-400 text-xs">
                    ^G Get Help  ^X Exit  ^O WriteOut  ^R Read File  ^Y Prev Page  ^K Cut Text  ^U Uncut Text  ^J Justify
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                setShowTerminal(!showTerminal);
                playSound(600, 0.1, 'sine');
              }}
              className={`flex items-center gap-2.5 text-sm text-gray-500 hover:${themeColor} transition-colors duration-200 mb-4 group`}
            >
              <div className={`p-1.5 rounded-lg ${themeBg} border ${themeBorder} group-hover:border-${_theme}-500/30 transition`}>
                <Terminal size={13} className={`${themeColor}/50 group-hover:${themeColor} transition`} />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest">
                {showTerminal ? "Close Terminal" : "Open Terminal"}
              </span>
              <span className={`text-[10px] ${themeDim} transition-transform duration-300 ${showTerminal ? "rotate-180" : ""}`}>▼</span>
            </button>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showTerminal ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
              <div className={`
                w-full
                max-w-2xl
                bg-[#0a0e27]/90
                border ${themeBorder}
                rounded-2xl
                p-5
                font-mono
                text-xs md:text-sm
                ${termHeight}
                transition-all duration-300
                flex flex-col
                backdrop-blur-md
                shadow-[0_0_60px_rgba(6,182,212,0.03)]
              `}>
                {/* Terminal titlebar */}
                <div 
                  className="flex justify-between items-center mb-3 pb-3 border-b border-white/[0.04] cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={handleDragStart}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70 hover:bg-red-500 transition cursor-pointer"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition cursor-pointer"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/70 hover:bg-green-500 transition cursor-pointer"></div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-1">
                      <div className={`w-1 h-1 rounded-full ${themeColor}/40 animate-pulse`}></div>
                      <span className="text-gray-600 text-[10px] uppercase tracking-widest">andsoft — bash</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setTermSize("small")}
                      className={`text-[10px] w-6 h-5 rounded-md bg-white/[0.03] hover:bg-white/10 text-gray-600 hover:${themeColor} transition flex items-center justify-center`}
                    >
                      −
                    </button>
                    <button
                      onClick={() => setTermSize(termSize === "full" ? "normal" : "full")}
                      className={`text-[10px] w-6 h-5 rounded-md bg-white/[0.03] hover:bg-white/10 text-gray-600 hover:${themeColor} transition flex items-center justify-center`}
                    >
                      □
                    </button>
                    <button
                      onClick={() => setTermSize("large")}
                      className={`text-[10px] w-6 h-5 rounded-md bg-white/[0.03] hover:bg-white/10 text-gray-600 hover:${themeColor} transition flex items-center justify-center`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Terminal output */}
                <div
                  ref={historyRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden space-y-0.5 break-words whitespace-pre-wrap pr-1"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6,182,212,0.15) transparent' }}
                >
                  {history.map((line, i) => {
                    if (line.text === "__SHOW_FSOCIETY__") {
                      return (
                        <img key={i} src="/fsociety.jpg" alt="fsociety" className="w-40 mt-2 rounded-lg border border-cyan-500/10" />
                      );
                    }
                    if (line.text === "__SHOW_LOSER__") {
                      return (
                        <img key={i} src="/loser.jpg" alt="loser" className="w-40 mt-2 rounded-lg border border-red-500/10" />
                      );
                    }

                    let baseColor = themeBright;
                    if (line.type === "input") baseColor = "text-gray-400";
                    if (line.type === "error") baseColor = "text-red-400/80";
                    if (line.type === "system") baseColor = "text-gray-600";

                    const renderColoredText = (text: string) => {
                      const parts = text.split(/(\[BLUE\].*?\[\/BLUE\]|\[GRAY\].*?\[\/GRAY\])/);
                      return parts.map((part: string, idx: number) => {
                        if (part.startsWith("[BLUE]")) {
                          const content = part.replace(/\[BLUE\]|\[\/BLUE\]/g, "");
                          return <span key={idx} className={themeColor}>{content}</span>;
                        } else if (part.startsWith("[GRAY]")) {
                          const content = part.replace(/\[GRAY\]|\[\/GRAY\]/g, "");
                          return <span key={idx} className="text-gray-500">{content}</span>;
                        }
                        return part;
                      });
                    };

                    return (
                      <div key={i} className={`${baseColor} break-words whitespace-pre-wrap leading-relaxed`}>
                        {renderColoredText(line.text)}
                      </div>
                    );
                  })}
                </div>

                {/* Terminal input */}
                <div className="mt-auto pt-3 border-t border-white/[0.04]">
                  <div className="flex items-start gap-2 relative">
                    <span className={`${themeColor}/70 shrink-0 whitespace-nowrap text-xs font-mono`}>
                      {user}@{activeNode}:{currentDir}$
                    </span>
                    <div className="flex-1 relative">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          setShowAutocomplete(e.target.value.length > 0);
                        }}
                        onKeyDown={handleKeyDown}
                        disabled={isTyping || _systemCrashed}
                        rows={1}
                        className={`bg-transparent outline-none flex-1 w-full ${themeColor} caret-cyan-400 min-w-0 resize-none overflow-hidden whitespace-pre-wrap break-words disabled:opacity-40 leading-relaxed placeholder:text-gray-700`}
                        placeholder={isTyping ? "" : "type a command..."}
                        autoFocus
                      />
                      {!isTyping && !_systemCrashed && <span className={`animate-pulse ${themeColor} ml-1`}>█</span>}
                      
                      {/* Autocomplete dropdown */}
                      {showAutocomplete && getAutocompleteOptions().length > 0 && (
                        <div className={`absolute bottom-full left-0 w-48 mb-1 bg-[#0a0e27]/95 border ${themeBorder} rounded-lg overflow-hidden shadow-lg backdrop-blur-md z-50`}>
                          {getAutocompleteOptions().slice(0, 7).map((option, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                const parts = input.trim().split(" ");
                                parts[parts.length - 1] = option;
                                setInput(parts.join(" ") + " ");
                                setShowAutocomplete(false);
                              }}
                              className={`px-3 py-1.5 ${themeColor} text-xs hover:bg-white/5 cursor-pointer transition border-b ${themeBorder} last:border-b-0`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Bottom Bar ─── */}
          <div className="border-t border-white/[0.04] pt-5 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-xs">
                © {new Date().getFullYear()} AndSoft
              </span>
              <span className="text-gray-800 text-xs">·</span>
              <a href="#" className={`text-gray-600 hover:${themeColor} text-xs transition-colors duration-200`}>
                Privacy
              </a>
              <span className="text-gray-800 text-xs">·</span>
              <a href="#" className={`text-gray-600 hover:${themeColor} text-xs transition-colors duration-200`}>
                Terms
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-xs font-mono">Visitors: {visitors.toLocaleString()}</span>
              </div>
              <div className="h-3 w-[1px] bg-white/[0.06]"></div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                </span>
                <span className="text-gray-600 text-xs font-mono">v1.0.3</span>
              </div>
              <div className="h-3 w-[1px] bg-white/[0.06]"></div>
              <Clock />
              <div className="h-3 w-[1px] bg-white/[0.06]"></div>
              <span className="text-gray-600 text-xs font-medium">EN</span>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="mt-4 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
        </div>

        {/* Floating Terminal Button */}
        {showTerminal && !showFloatingTerminal && (
          <button
            onClick={() => {
              setShowFloatingTerminal(true);
              setShowTerminal(false);
            }}
            className={`fixed bottom-8 right-8 p-3 rounded-full ${themeBg} border ${themeBorder} hover:bg-white/10 transition-all duration-300 shadow-lg z-50`}
            title="Minimize Terminal"
          >
            <Terminal size={20} className={themeColor} />
          </button>
        )}

        {/* Floating Terminal Window */}
        {showFloatingTerminal && (
          <div className={`fixed bottom-8 right-8 w-80 bg-[#0a0e27]/95 border ${themeBorder} rounded-lg shadow-xl backdrop-blur-md z-50`}>
            <div className={`flex justify-between items-center p-3 border-b ${themeBorder}`}>
              <span className={`${themeColor} text-xs font-mono`}>Terminal</span>
              <button
                onClick={() => {
                  setShowFloatingTerminal(false);
                  setShowTerminal(true);
                }}
                className={`${themeColor}/60 hover:${themeColor} transition`}
              >
                ⛶
              </button>
            </div>
            <div className={`h-40 bg-[#050816] overflow-y-auto ${themeBright} text-xs font-mono p-3 space-y-1`}>
              {history.slice(-5).map((line, i) => (
                <div key={i} className="text-gray-500">{line.text.substring(0, 40)}{line.text.length > 40 ? '...' : ''}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
