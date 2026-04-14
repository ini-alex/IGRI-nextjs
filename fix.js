#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  log(`✅ Fixed: ${filePath}`, 'green');
}

// ==================== FIX 1: tailwind.config.ts ====================
function fixTailwindConfig() {
  const filePath = path.join(process.cwd(), 'tailwind.config.ts');
  let content = readFile(filePath);
  if (!content) return;

  // Replace custom borderRadius with standard format
  content = content.replace(
    /borderRadius: \{\s*ios: \{\s*sm: "8px",\s*md: "12px",\s*lg: "16px",\s*xl: "20px",\s*full: "9999px",\s*\},\s*\}/,
    `borderRadius: {
        'ios-sm': '8px',
        'ios-md': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-full': '9999px',
      }`
  );

  // Replace boxShadow with standard format
  content = content.replace(
    /boxShadow: \{\s*ios: \{\s*sm: "0 1px 3px rgba\(0,0,0,0.1\)",\s*md: "0 4px 20px rgba\(0,0,0,0.08\)",\s*lg: "0 10px 40px rgba\(0,0,0,0.12\)",\s*\},\s*\}/,
    `boxShadow: {
        'ios-sm': '0 1px 3px rgba(0,0,0,0.1)',
        'ios-md': '0 4px 20px rgba(0,0,0,0.08)',
        'ios-lg': '0 10px 40px rgba(0,0,0,0.12)',
      }`
  );

  writeFile(filePath, content);
}

// ==================== FIX 2: globals.css ====================
function fixGlobalsCSS() {
  const filePath = path.join(process.cwd(), 'src', 'globals.css');
  let content = readFile(filePath);
  if (!content) return;

  // Add tailwind directives if missing
  if (!content.includes('@tailwind base')) {
    content = '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n' + content;
  }

  writeFile(filePath, content);
}

// ==================== FIX 3: Update all component files ====================
function fixComponentFiles() {
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  
  function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDir(fullPath);
      } else if (file.endsWith('.tsx')) {
        let content = readFile(fullPath);
        if (!content) return;

        // Fix rounded-ios-* classes
        content = content.replace(/rounded-ios-sm/g, 'rounded-ios-sm');
        content = content.replace(/rounded-ios-md/g, 'rounded-ios-md');
        content = content.replace(/rounded-ios-lg/g, 'rounded-ios-lg');
        content = content.replace(/rounded-ios-xl/g, 'rounded-ios-xl');
        content = content.replace(/rounded-ios-full/g, 'rounded-ios-full');
        content = content.replace(/rounded-ios-2xl/g, 'rounded-[20px]');

        // Fix shadow-ios-* classes
        content = content.replace(/shadow-ios-sm/g, 'shadow-ios-sm');
        content = content.replace(/shadow-ios-md/g, 'shadow-ios-md');
        content = content.replace(/shadow-ios-lg/g, 'shadow-ios-lg');

        // Fix active:scale-96 to active:scale-95
        content = content.replace(/active:scale-96/g, 'active:scale-95');
        content = content.replace(/active:scale-98/g, 'active:scale-95');

        // Fix animation classes
        content = content.replace(/animate-modal-up/g, 'animate-[modalUp_0.4s_ease-out]');
        content = content.replace(/animate-fade-in/g, 'animate-[fadeIn_0.4s_ease-out]');
        content = content.replace(/animate-siren/g, 'animate-[sirenPulse_1s_infinite]');
        content = content.replace(/animate-bell-shake/g, 'animate-[bellShake_0.5s_infinite]');

        writeFile(fullPath, content);
      }
    });
  }

  processDir(componentsDir);
}

// ==================== FIX 4: app files ====================
function fixAppFiles() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  
  function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDir(fullPath);
      } else if (file.endsWith('.tsx')) {
        let content = readFile(fullPath);
        if (!content) return;

        // Fix same class issues
        content = content.replace(/rounded-ios-sm/g, 'rounded-ios-sm');
        content = content.replace(/rounded-ios-md/g, 'rounded-ios-md');
        content = content.replace(/rounded-ios-lg/g, 'rounded-ios-lg');
        content = content.replace(/rounded-ios-xl/g, 'rounded-ios-xl');
        content = content.replace(/rounded-ios-full/g, 'rounded-ios-full');

        content = content.replace(/shadow-ios-sm/g, 'shadow-ios-sm');
        content = content.replace(/shadow-ios-md/g, 'shadow-ios-md');
        content = content.replace(/shadow-ios-lg/g, 'shadow-ios-lg');

        writeFile(fullPath, content);
      }
    });
  }

  processDir(appDir);
}

// ==================== FIX 5: Create simplified tailwind config ====================
function createSimplifiedTailwindConfig() {
  const config = `import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: "var(--ios-bg)",
          surface: "var(--ios-surface)",
          "surface-secondary": "var(--ios-surface-secondary)",
          text: {
            primary: "var(--ios-text-primary)",
            secondary: "var(--ios-text-secondary)",
            tertiary: "var(--ios-text-tertiary)",
          },
          separator: "var(--ios-separator)",
          accent: "var(--ios-accent)",
          "accent-secondary": "var(--ios-accent-secondary)",
          green: "var(--ios-green)",
          orange: "var(--ios-orange)",
          red: "var(--ios-red)",
          yellow: "var(--ios-yellow)",
          purple: "var(--ios-purple)",
          teal: "var(--ios-teal)",
        },
      },
      borderRadius: {
        'ios-sm': '8px',
        'ios-md': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-full': '9999px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0,0,0,0.1)',
        'ios-md': '0 4px 20px rgba(0,0,0,0.08)',
        'ios-lg': '0 10px 40px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "sans-serif"],
      },
      keyframes: {
        iosSpring: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.2)" },
        },
        slideDown: {
          from: { transform: "translateX(-50%) translateY(-100px)" },
          to: { transform: "translateX(-50%) translateY(0)" },
        },
        skeletonShimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        sirenPulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.5" },
        },
        bellShake: {
          "0%, 100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(-15deg)" },
          "75%": { transform: "rotate(15deg)" },
        },
        modalUp: {
          from: { opacity: "0", transform: "translateY(50px) scale(0.9)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "ios-spring": "iosSpring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-dot": "pulseDot 2s infinite",
        "slide-down": "slideDown 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        skeleton: "skeletonShimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;`;

  writeFile(path.join(process.cwd(), 'tailwind.config.ts'), config);
}

// ==================== FIX 6: Fix stats-section.tsx ====================
function fixStatsSection() {
  const filePath = path.join(process.cwd(), 'src', 'components', 'sections', 'stats-section.tsx');
  let content = readFile(filePath);
  if (!content) return;

  // Fix animateValue calls
  content = content.replace(/animateValue\("stat-total",/g, 'animateValue("total",');
  content = content.replace(/animateValue\("stat-max",/g, 'animateValue("max",');
  content = content.replace(/animateValue\("stat-avg",/g, 'animateValue("avg",');

  writeFile(filePath, content);
}

// ==================== MAIN ====================
log('🔧 IGRI Next.js Project Fixer', 'blue');
log('==========================\n', 'blue');

log('Step 1: Fixing tailwind.config.ts...', 'yellow');
createSimplifiedTailwindConfig();

log('\nStep 2: Fixing component files...', 'yellow');
fixComponentFiles();

log('\nStep 3: Fixing app files...', 'yellow');
fixAppFiles();

log('\nStep 4: Fixing stats-section.tsx...', 'yellow');
fixStatsSection();

log('\n==========================', 'green');
log('✨ All fixes applied!', 'green');
log('Run "npm run build" to test.', 'yellow');
