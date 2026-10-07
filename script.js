const terminal = document.getElementById("terminal");

let input = document.getElementById("commandInput");

let commandHistory = [];

let historyIndex = -1;

let currentDirectory = "/home/user";

let soundEnabled = true;

let matrixRunning = false;


/* =====================================================
   BOOT
===================================================== */

const bootScreen =
    document.getElementById("bootScreen");

const bootProgress =
    document.getElementById("bootProgress");

const bootStatus =
    document.getElementById("bootStatus");

const bootLog =
    document.getElementById("bootLog");


const bootMessages = [

    "Loading encrypted kernel...",
    "Initializing secure memory...",
    "Checking firewall integrity...",
    "Loading network modules...",
    "Disabling trace protocols...",
    "Mounting encrypted filesystem...",
    "Starting root shell...",
    "Security layer bypassed.",
    "BLACKOUT ENVIRONMENT READY."

];


let bootIndex = 0;

let bootProgressValue = 0;


const bootInterval = setInterval(() => {

    bootProgressValue +=
        Math.floor(
            Math.random() * 10
        ) + 5;


    if (bootProgressValue > 100) {

        bootProgressValue = 100;

    }


    bootProgress.style.width =
        `${bootProgressValue}%`;


    if (
        bootIndex <
        bootMessages.length
    ) {

        const line =
            document.createElement("div");

        line.innerHTML =
            `<span>[ OK ]</span> ${bootMessages[bootIndex]}`;

        bootLog.appendChild(line);

        bootStatus.textContent =
            bootMessages[bootIndex];

        bootIndex++;

    }


    if (bootProgressValue >= 100) {

        clearInterval(bootInterval);


        setTimeout(() => {

            bootScreen.classList.add(
                "hidden"
            );

            document
                .getElementById("loginScreen")
                .classList.remove(
                    "hidden"
                );


            document
                .getElementById(
                    "usernameInput"
                )
                .focus();


        }, 800);

    }

}, 300);


/* =====================================================
   LOGIN
===================================================== */

const loginButton =
    document.getElementById(
        "loginButton"
    );


const usernameInput =
    document.getElementById(
        "usernameInput"
    );


const passwordInput =
    document.getElementById(
        "passwordInput"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


function login() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!username) {

        loginMessage.textContent =
            "IDENTITY REQUIRED";

        loginMessage.style.color =
            "var(--danger)";

        return;

    }


    if (
        password &&
        password !== "admin"
    ) {

        loginMessage.textContent =
            "ACCESS DENIED // INVALID KEY";

        loginMessage.style.color =
            "var(--danger)";

        passwordInput.value = "";

        return;

    }


    loginMessage.textContent =
        "AUTHENTICATION SUCCESSFUL";

    loginMessage.style.color =
        "var(--primary)";


    setTimeout(() => {

        document
            .getElementById("loginScreen")
            .classList.add("hidden");


        document
            .getElementById("app")
            .classList.remove("hidden");


        setupInput();

    }, 700);

}


loginButton.addEventListener(
    "click",
    login
);


passwordInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            login();

        }

    }
);


/* =====================================================
   FILE SYSTEM
===================================================== */

const fileSystem = {

    "/home/user": [

        "Documents/",
        "Downloads/",
        "Projects/",
        "Secrets/",
        "README.txt"

    ],

    "/home/user/Documents": [

        "notes.txt",
        "projects.txt"

    ],

    "/home/user/Downloads": [

        "system-update.zip",
        "data.bin"

    ],

    "/home/user/Projects": [

        "hacker-terminal/",
        "portfolio/",
        "vivaia/"

    ],

    "/home/user/Secrets": [

        "classified.txt",
        "passwords.txt"

    ]

};


const files = {

    "README.txt":

        `HACKEROS BLACKOUT

System status:
ONLINE

Security:
CRITICAL

This environment is completely simulated.`,


    "notes.txt":

        `NOTE #01

Curiosity is a dangerous thing.

NOTE #02

Never trust a system you did not build.`,


    "classified.txt":

        `████████████████████████

CLASSIFIED

You found something
you were not supposed to find.

████████████████████████`,


    "passwords.txt":

        `root: ********
admin: ********
guest: ********`,


    "projects.txt":

        `PROJECTS

HackerOS
Portfolio
Vivaia
Network Simulator`

};


/* =====================================================
   COMMANDS
===================================================== */

const commands = {


    help: () => `

╔══════════════════════════════════════╗
║        BLACKOUT COMMAND CENTER       ║
╚══════════════════════════════════════╝

SYSTEM

  help          Command center
  clear         Clear terminal
  whoami        Current identity
  pwd           Current directory
  date          Current date
  time          Current time
  neofetch      System information
  history       Command history

FILES

  ls            List files
  cd <folder>   Change directory
  cat <file>    Read file

NETWORK

  scan          Scan network
  network       Network topology
  connect       Connect to node
  disconnect    Disconnect

SECURITY

  hack          BREACH PROTOCOL
  decrypt       Decrypt classified data
  matrix        Enter Matrix mode
  sudo          Root access
  trace         Trace connection

SYSTEM

  echo <text>   Print message
  theme         Change visual theme
  sound         Toggle system sounds
  secret        Hidden command

`,


    clear: () => {

        terminal.innerHTML = `

            <div class="input-line">

                <span class="prompt">
                    root@unknown:~$
                </span>

                <input
                    type="text"
                    id="commandInput"
                    autocomplete="off"
                    autofocus
                    spellcheck="false"
                >

            </div>

        `;


        setupInput();

        return null;

    },


    whoami: () =>
        "root",


    pwd: () =>
        currentDirectory,


    date: () =>
        new Date().toString(),


    time: () =>
        new Date().toLocaleTimeString(),


    ls: () => {

        return (

            fileSystem[
                currentDirectory
            ] || []

        ).join("\n");

    },


    cd: args => {

        if (!args) {

            return currentDirectory;

        }


        if (args === "..") {

            if (
                currentDirectory !==
                "/home/user"
            ) {

                const parts =
                    currentDirectory
                        .split("/");

                parts.pop();

                currentDirectory =
                    parts.join("/") ||
                    "/";

            }


            return currentDirectory;

        }


        const newPath =
            args.startsWith("/")
                ? args
                : `${currentDirectory}/${args}`;


        if (
            fileSystem[newPath]
        ) {

            currentDirectory =
                newPath;

            return `
Directory changed.

CURRENT PATH:
${currentDirectory}`;

        }


        return `
cd: ${args}: directory not found`;

    },


    cat: args => {

        if (!args) {

            return `
cat: missing file argument`;

        }


        if (files[args]) {

            return files[args];

        }


        return `
cat: ${args}: file not found`;

    },


    echo: args =>
        args || "",


    neofetch: () => `

        ██╗  ██╗
        ██║  ██║
        ███████║
        ██╔══██║
        ██║  ██║

root@blackout
────────────────────────────

OS          HackerOS Blackout
Kernel      6.6.0-secure
Shell       root-shell
CPU         UNKNOWN
Memory      16 GB
Network     ENCRYPTED
Firewall    BYPASSED
Trace       DISABLED
Security    CRITICAL
Status      ONLINE

`,


    history: () => {

        if (
            !commandHistory.length
        ) {

            return "No history.";

        }


        return commandHistory
            .map(
                (command, index) =>
                    `${index + 1}  ${command}`
            )
            .join("\n");

    },


    scan: async () => {

        const output =
            createOutput();


        const messages = [

            "[+] Initializing network scanner...",
            "[+] Scanning 192.168.0.0/24...",
            "[+] Searching active hosts...",
            "",
            "192.168.0.1      ONLINE",
            "192.168.0.12     ONLINE",
            "192.168.0.25     UNKNOWN",
            "192.168.0.31     ONLINE",
            "192.168.0.42     PROTECTED",
            "",
            "[!] 5 HOSTS DISCOVERED"

        ];


        for (
            const message of messages
        ) {

            output.textContent +=
                message + "\n";

            scrollTerminal();

            await sleep(180);

        }


        return null;

    },


    network: () => `

                 [ CORE SERVER ]
                        │
          ┌─────────────┼─────────────┐
          │             │             │
       [NODE01]      [NODE02]      [NODE03]
          │                           │
       [USER]                     [DATABASE]
                                      │
                                  [ENCRYPTED]

NETWORK STATUS: SECURE
ACTIVE NODES: 6
LATENCY: 12ms
ENCRYPTION: AES-256

`,


    connect: async () => {

        const output =
            createOutput();


        const messages = [

            "Opening secure channel...",
            "Resolving target...",
            "Negotiating encryption...",
            "Authenticating credentials...",
            "Handshake complete.",
            "",
            "CONNECTION ESTABLISHED",
            "",
            "NODE: 192.168.0.42",
            "ENCRYPTION: AES-256",
            "STATUS: SECURE"

        ];


        for (
            const message of messages
        ) {

            output.textContent +=
                message + "\n";

            scrollTerminal();

            await sleep(250);

        }


        return null;

    },


    disconnect: () => `

Connection terminated.

Secure tunnel closed.
Trace protection restored.

`,


    trace: () => `

TRACE PROTOCOL

Source: UNKNOWN
Route: ENCRYPTED
Proxy: ACTIVE
VPN: ACTIVE
Location: MASKED

TRACE FAILED.

`,


    decrypt: async () => {

        const output =
            createOutput();


        const messages = [

            "Initializing decryption engine...",
            "Analyzing encryption...",
            "Finding cryptographic weakness...",
            "Generating keys...",
            "Brute force initiated...",
            "Key attempt: 1048",
            "Key attempt: 9382",
            "Key attempt: 7721",
            "Key matched.",
            "",
            "DECRYPTION COMPLETE",
            "",
            "CLASSIFIED DATA:",
            "",
            "The secret was never important."

        ];


        for (
            const message of messages
        ) {

            output.textContent +=
                message + "\n";

            scrollTerminal();

            await sleep(220);

        }


        return null;

    },


    hack: async () => {

        await runBreach();

        return null;

    },


    sudo: () => `

[sudo]

root privileges unavailable.

Nice try.

This incident has been
completely ignored.

`,


    secret: () => `

╔══════════════════════════════╗
║      CLASSIFIED ACCESS       ║
╚══════════════════════════════╝

You discovered the hidden command.

ACHIEVEMENT UNLOCKED

> CURIOUS HUMAN

`,


    matrix: () => {

        startMatrix();

        return null;

    },


    theme: () => {

        document
            .getElementById("themePanel")
            .classList.toggle("hidden");

        return null;

    },


    sound: () => {

        soundEnabled =
            !soundEnabled;

        return `
System sounds:
${soundEnabled ? "ENABLED" : "DISABLED"}
`;

    }

};


/* =====================================================
   COMMAND EXECUTION
===================================================== */

async function executeCommand(
    command
) {

    const rawCommand =
        command.trim();


    if (!rawCommand) {

        return;

    }


    commandHistory.push(
        rawCommand
    );


    historyIndex =
        commandHistory.length;


    const parts =
        rawCommand.split(" ");


    const commandName =
        parts.shift().toLowerCase();


    const args =
        parts.join(" ").trim();


    const currentInput =
        document.querySelector(
            ".input-line"
        );


    const commandLine =
        document.createElement(
            "div"
        );


    const prompt =
        document.createElement(
            "span"
        );


    prompt.className =
        "prompt";


    prompt.textContent =
        "root@unknown:~$";


    const commandText =
        document.createElement(
            "span"
        );


    commandText.className =
        "command";


    commandText.textContent =
        rawCommand;


    commandLine.appendChild(
        prompt
    );


    commandLine.appendChild(
        commandText
    );


    terminal.insertBefore(
        commandLine,
        currentInput
    );


    if (
        commands[commandName]
    ) {

        const result =
            await commands[
                commandName
            ](args);


        if (
            result !== null &&
            result !== undefined
        ) {

            const output =
                document.createElement(
                    "pre"
                );


            output.className =
                "output";


            output.textContent =
                result;


            terminal.insertBefore(
                output,
                currentInput
            );

        }

    } else {

        const error =
            document.createElement(
                "div"
            );


        error.className =
            "error";


        error.textContent =
            `Command not found: ${commandName}`;


        terminal.insertBefore(
            error,
            currentInput
        );

    }


    scrollTerminal();

    input.focus();

}


/* =====================================================
   INPUT
===================================================== */

function setupInput() {

    input =
        document.getElementById(
            "commandInput"
        );


    if (!input) {

        return;

    }


    input.focus();


    input.addEventListener(
        "keydown",
        event => {


            if (
                event.key === "Enter"
            ) {

                const command =
                    input.value;


                input.value = "";


                executeCommand(
                    command
                );

            }


            if (
                event.key === "ArrowUp"
            ) {

                event.preventDefault();


                if (
                    !commandHistory.length
                ) {

                    return;

                }


                historyIndex--;


                if (
                    historyIndex < 0
                ) {

                    historyIndex = 0;

                }


                input.value =
                    commandHistory[
                        historyIndex
                    ];

            }


            if (
                event.key === "ArrowDown"
            ) {

                event.preventDefault();


                if (
                    !commandHistory.length
                ) {

                    return;

                }


                historyIndex++;


                if (
                    historyIndex >=
                    commandHistory.length
                ) {

                    historyIndex =
                        commandHistory.length;

                    input.value = "";

                    return;

                }


                input.value =
                    commandHistory[
                        historyIndex
                    ];

            }


            if (
                event.key === "Tab"
            ) {

                event.preventDefault();

                autocomplete();

            }

        }
    );


    terminal.addEventListener(
        "click",
        () => {

            input.focus();

        }
    );

}


/* =====================================================
   AUTOCOMPLETE
===================================================== */

function autocomplete() {

    const value =
        input.value.toLowerCase();


    const matches =
        Object.keys(commands)
            .filter(
                command =>
                    command.startsWith(
                        value
                    )
            );


    if (
        matches.length === 1
    ) {

        input.value =
            matches[0];

    }

}


/* =====================================================
   BREACH
===================================================== */

async function runBreach() {

    const overlay =
        document.getElementById(
            "breachOverlay"
        );


    overlay.classList.remove(
        "hidden"
    );


    document.body.classList.add(
        "theme-blood"
    );


    const output =
        createOutput();


    const messages = [

        "> INITIALIZING BREACH PROTOCOL",
        "",
        "[ OK ] TARGET ACQUIRED",
        "[ OK ] PORT 22 OPEN",
        "[ OK ] PORT 80 OPEN",
        "[ OK ] FIREWALL DETECTED",
        "",
        "[!] SECURITY SYSTEM ALERT",
        "",
        "BYPASSING FIREWALL...",
        "INJECTING PAYLOAD...",
        "ESCALATING PRIVILEGES...",
        "ESTABLISHING ROOT ACCESS...",
        "",
        "████████████████████████ 100%",
        "",
        "ROOT ACCESS GRANTED",
        "",
        "╔══════════════════════════════╗",
        "║     SYSTEM COMPROMISED      ║",
        "╚══════════════════════════════╝",
        "",
        "TRACE STATUS: ACTIVE",
        "COUNTERMEASURES: RUNNING",
        "",
        "> DISCONNECTING...",
        "",
        "SIMULATION COMPLETE."

    ];


    for (
        const message of messages
    ) {

        output.textContent +=
            message + "\n";

        scrollTerminal();

        await sleep(
            message.includes("[!]") ?
                500 :
                180
        );

    }


    await sleep(1000);


    overlay.classList.add(
        "hidden"
    );


    document.body.className =
        "";


    input.focus();

}


/* =====================================================
   MATRIX
===================================================== */

function startMatrix() {

    if (matrixRunning) {

        return;

    }


    matrixRunning = true;


    const canvas =
        document.getElementById(
            "matrixCanvas"
        );


    const ctx =
        canvas.getContext("2d");


    canvas.classList.remove(
        "hidden"
    );


    canvas.width =
        window.innerWidth;


    canvas.height =
        window.innerHeight;


    const characters =
        "アァカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    const fontSize = 16;


    const columns =
        Math.floor(
            canvas.width /
            fontSize
        );


    const drops =
        Array(columns).fill(1);


    function draw() {

        ctx.fillStyle =
            "rgba(0,0,0,.08)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "#00ff66";


        ctx.font =
            `${fontSize}px monospace`;


        for (
            let i = 0;
            i < drops.length;
            i++
        ) {

            const text =
                characters[
                    Math.floor(
                        Math.random() *
                        characters.length
                    )
                ];


            ctx.fillText(
                text,
                i * fontSize,
                drops[i] * fontSize
            );


            if (
                drops[i] *
                    fontSize >
                    canvas.height &&
                Math.random() > .975
            ) {

                drops[i] = 0;

            }


            drops[i]++;

        }

    }


    const interval =
        setInterval(
            draw,
            35
        );


    setTimeout(() => {

        clearInterval(
            interval
        );


        canvas.classList.add(
            "hidden"
        );


        matrixRunning = false;


        input.focus();

    }, 7000);

}


/* =====================================================
   THEMES
===================================================== */

document
    .querySelectorAll(
        "[data-theme]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const theme =
                    button.dataset.theme;


                document.body.className =
                    theme === "void"
                        ? ""
                        : `theme-${theme}`;


                document
                    .getElementById(
                        "themePanel"
                    )
                    .classList.add(
                        "hidden"
                    );

            }
        );

    });


document
    .getElementById(
        "themeButton"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "themePanel"
                )
                .classList.toggle(
                    "hidden"
                );

        }
    );


document
    .getElementById(
        "soundButton"
    )
    .addEventListener(
        "click",
        () => {

            soundEnabled =
                !soundEnabled;


            document
                .getElementById(
                    "soundButton"
                )
                .textContent =
                soundEnabled
                    ? "🔊"
                    : "🔇";

        }
    );


/* =====================================================
   SYSTEM STATUS
===================================================== */

function updateSystemStatus() {

    const cpu =
        Math.floor(
            Math.random() * 45
        ) + 20;


    const ram =
        Math.floor(
            Math.random() * 30
        ) + 40;


    const ping =
        Math.floor(
            Math.random() * 20
        ) + 8;


    document
        .getElementById(
            "cpuValue"
        )
        .textContent =
        `${cpu}%`;


    document
        .getElementById(
            "ramValue"
        )
        .textContent =
        `${ram}%`;


    document
        .getElementById(
            "pingValue"
        )
        .textContent =
        `${ping}ms`;


    document
        .getElementById(
            "clock"
        )
        .textContent =
        new Date()
            .toLocaleTimeString();

}


setInterval(
    updateSystemStatus,
    1000
);


updateSystemStatus();


/* =====================================================
   UTILITIES
===================================================== */

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


function scrollTerminal() {

    terminal.scrollTop =
        terminal.scrollHeight;

}


function createOutput() {

    const output =
        document.createElement(
            "pre"
        );


    output.className =
        "output";


    terminal.insertBefore(
        output,
        document.querySelector(
            ".input-line"
        )
    );


    return output;

}


/* =====================================================
   START
===================================================== */

setTimeout(
    () => {

        setupInput();

    },
    1000
);