export const CODE_SNIPPETS = [
  {
    id: 'html-boilerplate',
    title: 'HTML5 Standard Boilerplate',
    difficulty: 'EASY',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Race</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main class="container">
    <h1>Red Light Code Race</h1>
    <p>Type fast, stop on red!</p>
  </main>
  <script src="main.js"></script>
</body>
</html>`,
    description: 'The fundamental HTML5 boilerplate structure required for modern web applications.'
  },
  {
    id: 'cyber-login-form',
    title: 'Cyberpunk Auth Interface',
    difficulty: 'MEDIUM',
    language: 'html',
    code: `<form class="cyber-card p-6 bg-slate-900 border border-cyan-500/50 rounded-xl">
  <h2 class="text-xl font-bold text-cyan-400 mb-4">NET ACCESS</h2>
  <div class="mb-4">
    <label for="handle" class="block text-xs uppercase tracking-wider text-slate-400">Agent Handle</label>
    <input type="text" id="handle" name="handle" required class="w-full bg-slate-950 border border-slate-700 px-3 py-2 text-emerald-400 focus:outline-none focus:border-cyan-400" />
  </div>
  <button type="submit" class="w-full py-2 bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400">
    AUTHENTICATE
  </button>
</form>`,
    description: 'Tactical login interface snippet using Tailwind classes.'
  },
  {
    id: 'full-html5-app',
    title: 'Modern SPA Shell',
    difficulty: 'HARD',
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cyber Matrix Protocol</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 flex flex-col min-h-screen">
  <header class="h-16 border-b border-slate-800 flex items-center justify-between px-6">
    <span class="font-mono text-emerald-400 font-bold">SYSTEM // ACTIVE</span>
  </header>
  <div id="app" class="flex-1 p-8 grid grid-cols-2 gap-4">
    <div class="bg-slate-900 border border-slate-800 rounded-lg p-4"></div>
  </div>
</body>
</html>`,
    description: 'Full Single Page Application HTML markup layout with external scripts.'
  }
];
