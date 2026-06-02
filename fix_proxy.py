content = open('server/index.js', 'r', encoding='utf-8').read()

# Add trust proxy after app is created
old = 'app.use(cors({ origin: "*", credentials: false }));'
new = 'app.set("trust proxy", 1);\napp.use(cors({ origin: "*", credentials: false }));'

content = content.replace(old, new)
open('server/index.js', 'w', encoding='utf-8', newline='\n').write(content)
print('Trust proxy added:', 'trust proxy' in content)
