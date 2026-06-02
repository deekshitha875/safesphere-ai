content = open('server/index.js', 'r', encoding='utf-8').read()
content = content.replace('"10kb"', '"10mb"')
open('server/index.js', 'w', encoding='utf-8', newline='\n').write(content)
print('Body limit updated:', '"10mb"' in content)
