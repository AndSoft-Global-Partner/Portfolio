import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Clock from './Clock';

export default function Footer() {
  const [latency, setLatency] = useState(12);
  const [access, setAccess] = useState(false);
  const [systemId] = useState(() => Math.floor(Math.random()*9999));
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const historyRef = useRef<HTMLDivElement | null>(null);

  const termHeight =
    termSize === "small"
      ? "h-[120px]"
      : termSize === "large"
      ? "h-[300px]"
      : termSize === "full"
      ? "h-[420px]"
      : "h-[180px]";

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

  const isDirectory = (path: string) => fileSystem[path as keyof typeof fileSystem] !== undefined;
  const isFile = (name: string) => fileContents[name as keyof typeof fileContents] !== undefined;

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
sudo       system admin commands`,

    ls: (): string => {
      const items = fileSystem[currentDir as keyof typeof fileSystem];
      if (!items) return "directory not found";
      return items
        .map((item: string) => {
          const path = currentDir === "/" ? `/${item}` : `${currentDir}/${item}`;
          if (isDirectory(path)) {
            return `[BLUE]${item}[/BLUE]`;
          }
          return `[GRAY]${item}[/GRAY]`;
        })
        .join("   ");
    },

    cd: async (args: string[]): Promise<string> => {
      const target = args[0] || "~";
      const newPath = resolvePath(target);

      if (isDirectory(newPath)) {
        setPrevDir(currentDir);
        setCurrentDir(newPath);
        return "";
      }

      if (isFile(target)) {
        await typeText(fileContents[target as keyof typeof fileContents]);
        return "";
      }

      return `cd: no such file or directory: ${target}`;
    },

    cat: async (args: string[]): Promise<string> => {
      const file = args[0];
      if (!file) return "usage: cat <file>";
      
      const content = fileContents[file as keyof typeof fileContents];
      if (!content) return "cat: no such file";
      
      await typeText(content);
      return "";
    },

    whoami: (): string => "guest",

    pwd: (): string => currentDir,

    date: (): string => new Date().toString(),

    uname: (): string => "Linux andsoft 6.1.0 x86_64",

    echo: (args: string[]): string => args.join(" "),

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

    clear: () => "__CLEAR__"
  };

  const getAutocompleteOptions = (): string[] => {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const parts = trimmed.split(" ");
    const lastPart = parts[parts.length - 1];

    // Command completion
    if (parts.length === 1) {
      return Object.keys(commands).filter(cmd => cmd.startsWith(lastPart));
    }

    // Directory/file completion
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
    // Handle choice input
    if (awaitingChoice) {
      if (cmd === "1") {
        setHistory(prev => [
          ...prev,
          { text: "guest@andsoft:~$ " + cmd, type: "input" }
        ]);
        setHistory(prev => [
          ...prev,
          {
            text: "Welcome to fsociety.",
            type: "output"
          }
        ]);
        setHistory(prev => [
          ...prev,
          {
            text: "__SHOW_FSOCIETY__",
            type: "system"
          }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          { text: "guest@andsoft:~$ " + cmd, type: "input" }
        ]);
        setHistory(prev => [
          ...prev,
          {
            text: "You are a loser.",
            type: "error"
          }
        ]);
        setHistory(prev => [
          ...prev,
          {
            text: "__SHOW_LOSER__",
            type: "system"
          }
        ]);
      }

      setAwaitingChoice(false);
      return;
    }

    const parts = cmd.trim().split(" ");
    const base = parts[0];
    const args = parts.slice(1);

    if (!cmd.trim()) return;

    // Add to command history
    setCommandHistory(prev => [cmd, ...prev]);

    setHistory(prev => [
      ...prev,
      { text: `guest@andsoft:${currentDir}$ ${cmd}`, type: "input" }
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
      setLatency(Math.floor(Math.random() * 20) + 5);
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

  const handleAccess = () => {
    setAccess(true);
    setTimeout(() => setAccess(false), 2000);
  };

  return (
    <footer className="relative bg-black/50 backdrop-blur-md border-t border-cyan-500/20 py-4 md:py-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-cyan-400 blur-3xl rounded-full top-0 left-1/4 animate-pulse"></div>
        <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-blue-400 blur-3xl rounded-full bottom-0 right-1/4 animate-pulse"></div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        {/* AndSoft Section */}
        <div className="mb-4 md:mb-6">
          <div className="max-w-sm">
            <div className="text-2xl font-bold text-white mb-4 relative inline-block group cursor-pointer">
              <span className="text-cyan-400 group-hover:text-cyan-300 transition">And</span>
              <span className="group-hover:text-cyan-100 transition">Soft</span>
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-20 blur-xl transition pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Console + System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-2">
          {/* Console */}
          <div className="md:border-l md:border-cyan-500/10 md:pl-8">
            <h4 className="text-white font-semibold mb-4">Console</h4>
            <div className={`
              w-full
              md:w-[500px]
              bg-black/40 
              border border-cyan-500/20 
              rounded-lg 
              p-4 
              font-mono 
              text-xs md:text-sm
              ${termHeight}
              transition-all duration-300
              flex flex-col
              min-w-[280px]
              max-w-full
            `}>
              <div className="flex justify-between items-center mb-2">
                <div className="text-gray-400 text-xs">
                  terminal
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTermSize("small")}
                    className="text-xs px-2 py-0.5 border border-cyan-500/30 rounded hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition"
                  >
                    −
                  </button>
                  <button
                    onClick={() => setTermSize(termSize === "full" ? "normal" : "full")}
                    className="text-xs px-2 py-0.5 border border-cyan-500/30 rounded hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition"
                  >
                    □
                  </button>
                  <button
                    onClick={() => setTermSize("large")}
                    className="text-xs px-2 py-0.5 border border-cyan-500/30 rounded hover:bg-cyan-500/10 text-gray-400 hover:text-cyan-400 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                ref={historyRef}
                className="
                  flex-1
                  overflow-y-auto
                  overflow-x-hidden
                  space-y-1
                  break-words
                  whitespace-pre-wrap
                "
              >
                {history.map((line, i) => {
                  // Handle image reveals
                  if (line.text === "__SHOW_FSOCIETY__") {
                    return (
                      <img
                        key={i}
                        src="/fsociety.jpg"
                        alt="fsociety"
                        className="w-40 mt-2"
                      />
                    );
                  }

                  if (line.text === "__SHOW_LOSER__") {
                    return (
                      <img
                        key={i}
                        src="/loser.jpg"
                        alt="loser"
                        className="w-40 mt-2"
                      />
                    );
                  }

                  let baseColor = "text-green-400";
                  if (line.type === "input") baseColor = "text-cyan-400";
                  if (line.type === "error") baseColor = "text-red-400";
                  if (line.type === "system") baseColor = "text-gray-400";

                  // Parse color codes in text
                  const renderColoredText = (text: string) => {
                    const parts = text.split(/(\[BLUE\].*?\[\/BLUE\]|\[GRAY\].*?\[\/GRAY\])/);
                    return parts.map((part: string, idx: number) => {
                      if (part.startsWith("[BLUE]")) {
                        const content = part.replace(/\[BLUE\]|\[\/BLUE\]/g, "");
                        return <span key={idx} className="text-blue-400">{content}</span>;
                      } else if (part.startsWith("[GRAY]")) {
                        const content = part.replace(/\[GRAY\]|\[\/GRAY\]/g, "");
                        return <span key={idx} className="text-gray-400">{content}</span>;
                      }
                      return part;
                    });
                  };

                  return (
                    <div key={i} className={`${baseColor} break-words whitespace-pre-wrap`}>
                      {renderColoredText(line.text)}
                    </div>
                  );
                })}
              </div>

              {/* input line */}
              <div className="mt-auto flex items-start text-green-400 gap-2 pt-1">
                <span className="text-green-500 shrink-0 whitespace-nowrap">
                  guest@andsoft:{currentDir}$
                </span>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  rows={1}
                  className="
                    bg-transparent 
                    outline-none 
                    flex-1 
                    text-green-400
                    caret-green-400
                    min-w-0
                    resize-none
                    overflow-hidden
                    whitespace-pre-wrap
                    break-words
                    disabled:opacity-50
                    leading-relaxed
                  "
                  autoFocus
                />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div
            onClick={handleAccess}
            className="relative bg-black/30 border border-cyan-500/20 p-4 md:p-6 rounded-xl hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
              <div className="absolute w-full h-[2px] bg-cyan-400 animate-[scan_2s_linear_infinite]"></div>
            </div>
            <h4 className="text-white font-semibold mb-4 relative z-10">System Status</h4>

            <div className="space-y-3 text-xs md:text-sm font-mono">

              {/* Online indicator */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-green-400">ONLINE</span>
              </div>

              {/* latency */}
              <div className="text-gray-400">
                LATENCY: {latency}ms
              </div>

              {/* version */}
              <div className="text-gray-400">
                VERSION: v1.0.3
              </div>

              {/* uptime */}
              <div className="text-gray-400">
                UPTIME: {Math.floor(Math.random()*99)}%
              </div>

              {/* random id */}
              <div className="text-cyan-400">
                ID: AX-{systemId}
              </div>

              {access && (
                <div className="text-cyan-400 text-xs font-mono mt-2 animate-pulse">
                  ACCESS GRANTED
                </div>
              )}

            </div>
          </div>
        </div>

        <div className="border-t border-cyan-500/20 pt-2 flex flex-col gap-2 md:flex-row md:justify-between md:items-center md:gap-4">
          <div className="text-gray-400 text-xs md:text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AndSoft. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center md:justify-end md:flex-nowrap">
            <a href="#" className="relative text-gray-400 hover:text-cyan-400 text-xs md:text-sm group transition-colors">
              Privacy Policy
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-cyan-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#" className="relative text-gray-400 hover:text-cyan-400 text-xs md:text-sm group transition-colors">
              Terms of Service
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-cyan-400 transition-all group-hover:w-full"></span>
            </a>
            <div className="flex space-x-3 ml-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 hover:scale-110 transition-all duration-300">
                <Facebook size={18} />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <Clock />
            </div>
            <span className="text-gray-400 text-sm">EN</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-cyan-500/10 flex justify-center">
          <div className="text-green-400 font-mono text-xs animate-pulse tracking-widest">
            SYSTEM ONLINE ● ANDSOFT v1.0
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 opacity-50"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
