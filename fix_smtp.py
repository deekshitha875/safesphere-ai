content = open('server/routes/auth.js', 'r', encoding='utf-8').read()

# Replace gmail service with explicit host/port config that works on Render
old = '''    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });'''

new = '''    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });'''

content = content.replace(old, new)
open('server/routes/auth.js', 'w', encoding='utf-8', newline='\n').write(content)
print('SMTP config updated')
print('Changed:', new[:50] in content)
