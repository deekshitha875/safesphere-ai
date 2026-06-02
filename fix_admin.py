import re

content = open('client/src/pages/AdminLogin.jsx', 'r', encoding='utf-8').read()

# Find start of demo accounts section
start_marker = 'Demo Admin Accounts'
start = content.rfind('<div', 0, content.find(start_marker))
# Find the closing of the form tag after this
end = content.find('</form>', start) + len('</form>')

print('start:', start)
print('end:', end)
print('section preview:', repr(content[start:start+100]))

# Replace that section (from the border-t div to </form>) with just closing form
section_to_remove = content[start:end]
clean = content.replace(section_to_remove, '</form>')

open('client/src/pages/AdminLogin.jsx', 'w', encoding='utf-8', newline='\n').write(clean)
print('Admin credentials removed successfully')
