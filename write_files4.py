import os

# Fix Hero stats to be realistic
hero_patch = open('client/src/sections/Hero.jsx', 'r', encoding='utf-8').read()

# Replace fake stats with realistic ones
hero_patch = hero_patch.replace(
    "{ target: 98, suffix: '%', label: 'Accuracy' },\n                { target: 2, suffix: 'M+', label: 'Protected' },\n                { target: 150, suffix: '+', label: 'Platforms' },\n                { target: 50, suffix: 'ms', label: 'Response' },",
    "{ target: 98, suffix: '%', label: 'Detection Rate' },\n                { target: 500, suffix: '+', label: 'Reports Filed' },\n                { target: 15, suffix: '+', label: 'Platforms' },\n                { target: 24, suffix: 'hr', label: 'Response Time' },"
)

# Replace "Watch Demo" with "Try Live Demo"
hero_patch = hero_patch.replace(
    "Watch Demo",
    "Try Live Demo"
)

with open('client/src/sections/Hero.jsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(hero_patch)
print('Written: client/src/sections/Hero.jsx')

# Fix index.html to add favicon and better title
index_html = open('client/index.html', 'r', encoding='utf-8').read()
if '<link rel="icon"' not in index_html:
    index_html = index_html.replace(
        '<title>',
        '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n    <title>'
    )
    with open('client/index.html', 'w', encoding='utf-8', newline='\n') as f:
        f.write(index_html)
    print('Written: client/index.html (favicon added)')

# Create SVG favicon
favicon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#g)"/>
  <text x="16" y="22" font-family="Arial,sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">S</text>
</svg>'''

os.makedirs('client/public', exist_ok=True)
with open('client/public/favicon.svg', 'w', encoding='utf-8', newline='\n') as f:
    f.write(favicon_svg)
print('Written: client/public/favicon.svg')

print('Done batch 4')
