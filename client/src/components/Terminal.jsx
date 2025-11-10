import { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize2, ChevronDown } from 'lucide-react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { SearchAddon } from '@xterm/addon-search';
import '@xterm/xterm/css/xterm.css';

const TerminalComponent = () => {
  const terminalRef = useRef(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const terminal = useRef(null);
  const fitAddon = useRef(new FitAddon());
  
  // Available commands
  const commands = {
    help: () => `Available commands:
  help      - Show this help message
  about     - About this project
  skills    - View my skills
  roadmap   - View learning roadmap
  contact   - Contact information
  clear     - Clear the terminal
  
  DSA Commands:
  arrays    - Learn about arrays
  linkedlist - Learn about linked lists
  sort      - Sorting algorithms
  search    - Searching algorithms
  tree      - Tree data structures`,
    
    about: () => `RISE - DSA Learning Platform

A modern platform to help developers master Data Structures and Algorithms
through interactive coding challenges and tutorials.`,
    
    skills: () => `Core Skills:
- JavaScript/TypeScript
- Python
- Data Structures
- Algorithms
- Problem Solving

Frameworks & Tools:
- React
- Node.js
- Git
- VS Code`,
    
    roadmap: () => `Learning Path:
1. Basic Data Structures
   - Arrays & Strings
   - Linked Lists
   - Stacks & Queues
   - Hash Tables

2. Algorithms
   - Sorting & Searching
   - Recursion
   - Time/Space Complexity

3. Advanced Topics
   - Trees & Graphs
   - Dynamic Programming
   - System Design`,
    
    contact: () => `Get in touch:
- Email: contact@rise-dsa.com
- GitHub: github.com/rise-dsa
- Twitter: @rise_dsa`,
    
    clear: (term) => {
      term.clear();
      return '';
    },
    
    // DSA Commands
    arrays: () => `Arrays:
- Contiguous block of memory
- O(1) access time
- Fixed size (static arrays)
- Common operations:
  - Access: O(1)
  - Search: O(n)
  - Insertion: O(n)
  - Deletion: O(n)`,
    
    linkedlist: () => `Linked Lists:
- Linear data structure
- Dynamic size
- Elements not stored contiguously
- Common operations:
  - Access: O(n)
  - Search: O(n)
  - Insertion: O(1) at head/tail
  - Deletion: O(1) at head/tail`,
    
    sort: () => `Sorting Algorithms:

Bubble Sort:
- Time: O(n²) worst/average, O(n) best
- Space: O(1)
- Stable: Yes

Quick Sort:
- Time: O(n log n) average, O(n²) worst
- Space: O(log n)
- Unstable`,
    
    search: () => `Searching Algorithms:

Linear Search:
- Time: O(n)
- Space: O(1)
- Works on any list

Binary Search:
- Time: O(log n)
- Space: O(1)
- Requires sorted list`,
    
    tree: () => `Tree Data Structures:

Binary Tree:
- Each node has ≤ 2 children
- Used in binary search trees, heaps

Binary Search Tree (BST):
- Left < Parent < Right
- Search/Insert/Delete: O(h)
- h = height (O(log n) if balanced)`
  };

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Create terminal
    terminal.current = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#000000',
        foreground: '#33ff33',
        cursor: '#33ff33',
        selection: 'rgba(51, 255, 51, 0.3)',
        black: '#000000',
        red: '#ff3333',
        green: '#33ff33',
        yellow: '#ffff33',
        blue: '#3399ff',
        magenta: '#ff33ff',
        cyan: '#33ffff',
        white: '#ffffff',
        brightBlack: '#666666',
        brightRed: '#ff6666',
        brightGreen: '#66ff66',
        brightYellow: '#ffff66',
        brightBlue: '#66b3ff',
        brightMagenta: '#ff66ff',
        brightCyan: '#66ffff',
        brightWhite: '#ffffff',
      },
    });
    
    // Load addons
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.loadAddon(new WebLinksAddon());
    terminal.current.loadAddon(new SearchAddon());
    
    // Open terminal in container
    terminal.current.open(terminalRef.current);
    
    // Fit terminal to container
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.current.fit();
    });
    
    resizeObserver.observe(terminalRef.current);
    fitAddon.current.fit();
    
    // Initial welcome message
    const welcomeMessage = `Welcome to RISE Terminal
Type 'help' to see available commands

$ `;
    terminal.current.write(welcomeMessage);
    
    // Handle terminal input
    let command = '';
    terminal.current.onData((data) => {
      const code = data.charCodeAt(0);
      
      // Handle special keys
      if (code === 13) { // Enter key
        terminal.current.write('\r\n');
        processCommand(command);
        command = '';
        terminal.current.write('$ ');
      } else if (code === 127) { // Backspace
        if (command.length > 0) {
          command = command.slice(0, -1);
          terminal.current.write('\b \b');
        }
      } else if (code < 32) {
        // Handle other control characters (arrows, etc.)
        // For simplicity, we'll ignore them for now
      } else {
        // Regular character input
        command += data;
        terminal.current.write(data);
      }
    });
    
    // Cleanup
    return () => {
      if (terminal.current) {
        terminal.current.dispose();
      }
      resizeObserver.disconnect();
    };
  }, []);
  
  // Process commands
  const processCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;
    
    const cmdLower = trimmedCmd.toLowerCase();
    
    if (cmdLower === 'clear') {
      terminal.current.clear();
      return;
    }
    
    if (commands[cmdLower]) {
      const output = commands[cmdLower](terminal.current);
      if (output) {
        terminal.current.write(output + '\r\n');
      }
    } else {
      terminal.current.write(`Command not found: ${trimmedCmd}\r\n`);
      terminal.current.write(`Type 'help' for available commands\r\n`);
    }
  };
  
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setTimeout(() => {
      fitAddon.current.fit();
    }, 0);
  };

  // Add the JSX return statement
  return (
    <div className={`relative flex flex-col bg-black rounded-lg overflow-hidden border border-green-500/30 transition-all duration-300 ${
      isMaximized ? 'fixed inset-0 z-50 m-0 rounded-none' : 'h-[500px] w-full max-w-5xl'
    }`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-green-500/30">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div 
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer"
              onClick={() => {
                if (confirm('Are you sure you want to close the terminal?')) {
                  if (isMaximized) {
                    setIsMaximized(false);
                  } else {
                    // Handle terminal close
                  }
                }
              }}
            ></div>
            <div 
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
              onClick={() => terminal.current.clear()}
            ></div>
            <div 
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer"
              onClick={handleMaximize}
            ></div>
          </div>
          <div className="text-xs text-green-400 font-mono ml-2">
            terminal
          </div>
        </div>
        <div className="text-xs text-green-500/70 font-mono">
          RISE_TERMINAL v1.0.0
        </div>
      </div>
      
      {/* Terminal Body */}
      <div 
        ref={terminalRef} 
        className="flex-1 w-full h-full p-2 overflow-hidden"
      />
    </div>
  );
}

export default TerminalComponent;
    