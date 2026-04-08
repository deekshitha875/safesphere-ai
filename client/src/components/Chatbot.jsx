import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Knowledge base with multiple varied answers per topic ──────────────────
const KB = {
  greet: [
    "Hey there! 👋 I'm SafeSphere AI assistant. Ask me anything about cyberbullying detection, our features, pricing, or how to get started!",
    "Hi! Welcome to SafeSphere AI 🛡️ — your intelligent cyber safety companion. What would you like to know today?",
    "Hello! Great to see you here. I'm here to help you understand how SafeSphere AI keeps people safe online. What's on your mind?",
    "Hey! I'm the SafeSphere AI bot 🤖. Whether it's about our tech, pricing, or safety tips — I've got you covered. Fire away!",
  ],
  features: [
    "SafeSphere AI packs 6 core features: ⚡ Real-Time Detection (50ms), 🧠 Sentiment Analysis, 🌐 Multi-Platform Integration, 🔔 Smart Alerts, 🔒 Privacy Protection, and ⚖️ Ethical AI Engine. Which one would you like to dive into?",
    "Our AI engine uses advanced NLP to detect hate speech, toxicity, harassment, and threats — all in under 50 milliseconds. It works across 150+ platforms simultaneously!",
    "The sentiment analysis module is particularly powerful — it understands sarcasm, passive aggression, coded language, and cultural context. Not just keyword matching!",
    "Real-time detection is our flagship feature. Messages are analyzed the moment they're sent — before they even reach the recipient in some integrations. That's true prevention, not just detection.",
    "Multi-platform integration means one API key protects your users across Instagram, WhatsApp, Discord, Slack, school portals, and custom apps. Truly unified safety.",
  ],
  pricing: [
    "We have 3 plans 💰:\n• **Free** — 100 scans/month, basic detection\n• **Pro** ₹999/mo — unlimited scans, real-time alerts, 10 platforms\n• **Enterprise** — custom pricing, white-label, dedicated support\nThe Pro plan is our most popular!",
    "The Free plan is genuinely useful — 100 scans/month with basic threat detection and email alerts. Perfect for individuals or small communities.",
    "Pro at ₹999/month gives you unlimited scans, SMS + email alerts, sentiment analysis dashboard, and priority support. Most schools and families go with this.",
    "Enterprise is fully custom — we build around your infrastructure. Includes on-premise deployment, custom AI model training, SLA guarantees, and a dedicated account manager.",
    "We also offer a 14-day free trial of Pro — no credit card needed. Want me to help you get started?",
  ],
  demo: [
    "The Live Demo is at /demo — just type any message and our AI analyzes it instantly! Try something like 'you're so stupid nobody likes you' and watch the threat detection kick in 🎯",
    "Our demo uses the same AI engine as production. You'll see the label (safe/toxic/hate/harassment), confidence score, sentiment, threat level, and recommended action — all in real time.",
    "Fun fact: the demo processes your text through the same NLP pipeline used by our enterprise clients. It's not a toy — it's the real deal running live.",
    "Try typing something ambiguous in the demo — like sarcasm or indirect threats. You'll see how our contextual AI handles nuance that simple keyword filters miss completely.",
  ],
  safety: [
    "Your privacy is our foundation 🔐. All data is encrypted with AES-256 in transit and at rest. Our AI analyzes content in-memory — nothing is stored after analysis.",
    "We follow GDPR, CCPA, and India's PDPB compliance standards. We're also SOC 2 Type II certified and ISO 27001 aligned.",
    "Zero data retention policy means: once a message is analyzed, the content is gone. We only store metadata (threat level, timestamp) if you explicitly enable logging.",
    "Our AI is bias-tested quarterly by an independent ethics board. We actively work to reduce false positives for marginalized communities and non-English languages.",
    "End-to-end encryption + zero-knowledge architecture means even our engineers can't read your users' messages. That's the level of privacy we're committed to.",
  ],
  howItWorks: [
    "The pipeline is: Message → API Gateway → Tokenization → NLP Model → Threat Classifier → Alert Engine. The whole thing runs in under 50ms ⚡",
    "Our NLP model is a fine-tuned transformer (similar to BERT) trained on 50M+ labeled examples of cyberbullying across 12 languages. It understands context, not just keywords.",
    "Step by step: 1️⃣ Text is received via API 2️⃣ Preprocessed and tokenized 3️⃣ Run through our threat classification model 4️⃣ Severity scored 5️⃣ Alert triggered if threshold exceeded",
    "We use an ensemble approach — combining rule-based filters, ML classifiers, and a large language model for edge cases. This gives us 98% accuracy with very low false positives.",
  ],
  useCases: [
    "SafeSphere AI is used in 4 main environments: 🎓 Schools & universities, 👨‍👩‍👧 Family monitoring, 📱 Social media platforms, and 🏢 Corporate workplaces. Each has a tailored configuration.",
    "For schools, we integrate with LMS platforms like Google Classroom and Microsoft Teams for Education. Admins get a real-time dashboard of flagged content.",
    "Parents can set up monitoring for their child's social media accounts and get instant SMS alerts when harmful content is detected — without reading every message (privacy-first).",
    "For enterprises, we plug into Slack, Teams, and email systems to detect workplace harassment before HR even knows there's an issue. Proactive, not reactive.",
  ],
  contact: [
    "You can reach us at hello@safesphere.ai 📧 or call +91 98765 43210. Our support team responds within 2 hours on business days.",
    "For enterprise inquiries, email enterprise@safesphere.ai and our solutions team will schedule a demo within 24 hours.",
    "Use the contact form on our website for general queries. For urgent safety issues, we have a priority support line available 24/7 for Pro and Enterprise users.",
  ],
  start: [
    "Getting started takes 3 minutes: 1️⃣ Click 'Get Started' 2️⃣ Create your free account 3️⃣ Connect your first platform via our API or dashboard. You're protected instantly!",
    "The fastest way to start: sign up for free, go to the Live Demo to see the AI in action, then upgrade to Pro when you're ready. No commitment needed.",
    "For developers: our REST API is live at api.safesphere.ai. Check the docs, grab your API key from the dashboard, and you can be sending requests in under 10 minutes.",
    "For non-technical users: our no-code dashboard lets you connect platforms, set alert thresholds, and manage everything without writing a single line of code.",
  ],
  accuracy: [
    "We achieve 98% detection accuracy on our benchmark dataset — but more importantly, our false positive rate is under 1.2%, which means legitimate messages rarely get flagged.",
    "Accuracy varies by content type: hate speech 99.1%, harassment 97.8%, threats 98.4%, toxic language 96.9%. We publish our full benchmark report quarterly.",
    "Our model is continuously retrained on new data. As language evolves (new slang, coded language), our AI adapts — usually within 2-3 weeks of a new pattern emerging.",
  ],
  cyberbullying: [
    "Cyberbullying includes harassment, hate speech, threats, doxxing, impersonation, and exclusion. SafeSphere AI detects all these categories with distinct severity levels.",
    "Did you know? 1 in 3 teenagers experience cyberbullying annually, and 59% of US teens have been harassed online. Early AI detection can prevent serious mental health consequences.",
    "The most dangerous form of cyberbullying is often the most subtle — repeated exclusion, gaslighting, and indirect threats. Our contextual AI catches these where keyword filters fail.",
    "Cyberbullying causes anxiety, depression, and in severe cases, self-harm. That's why real-time detection matters — every minute of delay increases psychological impact.",
  ],
  default: [
    "That's a great question! I'm not 100% sure about that specific topic, but I can help you with SafeSphere AI's features, pricing, how it works, or getting started. What would you like to know?",
    "Hmm, I don't have a specific answer for that, but our team at hello@safesphere.ai would love to help! In the meantime, can I tell you about our AI detection capabilities?",
    "I'm still learning! For that specific query, I'd recommend reaching out to our support team. But I'm great at answering questions about cyberbullying detection, our platform, and pricing 😊",
    "Good question — that's a bit outside my knowledge base. Try our contact form for detailed answers. Meanwhile, want to know how our 98% accurate AI actually works?",
  ],
};

// ── Track last used index per topic to avoid repeats ──────────────────────
const lastUsed = {};
function getResponse(msg) {
  const m = msg.toLowerCase();
  let topic = 'default';

  if (m.match(/^(hi|hello|hey|sup|yo|greet|good\s*(morning|evening|afternoon))/)) topic = 'greet';
  else if (m.match(/feature|what.*do|capabilit|function|detect|scan|sentiment|alert|notif|integrat/)) topic = 'features';
  else if (m.match(/price|pricing|cost|plan|free|pro|enterprise|₹|rupee|pay|subscri/)) topic = 'pricing';
  else if (m.match(/demo|try|test|example|show|live|sample/)) topic = 'demo';
  else if (m.match(/safe|privacy|secure|encrypt|gdpr|data|store|retain|complian/)) topic = 'safety';
  else if (m.match(/how.*work|pipeline|process|step|model|nlp|ai.*engine|behind/)) topic = 'howItWorks';
  else if (m.match(/use.*case|school|parent|family|corporate|workplace|social.*media|who.*use/)) topic = 'useCases';
  else if (m.match(/contact|email|phone|support|reach|help|talk/)) topic = 'contact';
  else if (m.match(/start|begin|sign.*up|register|get.*start|onboard|setup/)) topic = 'start';
  else if (m.match(/accura|percent|98|false.*positive|benchmark|perform/)) topic = 'accuracy';
  else if (m.match(/cyberbull|bully|harass|online.*abuse|victim|mental.*health|impact/)) topic = 'cyberbullying';

  const pool = KB[topic];
  const last = lastUsed[topic] ?? -1;
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); } while (pool.length > 1 && idx === last);
  lastUsed[topic] = idx;
  return pool[idx];
}

// ── Typing indicator ───────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5 bg-dark-700 rounded-xl rounded-bl-sm w-fit">
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400"
          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  );
}

// ── Format message text (bold **text**) ───────────────────────────────────
function MsgText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith('**') ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong> : p
      )}
    </span>
  );
}

const SUGGESTIONS = [
  'How does it work?', 'Show pricing', 'Try the demo', 'Is my data safe?', 'Get started',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: KB.greet[0], time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: t, time: new Date() }]);
    setTyping(true);
    // Simulate realistic typing delay based on response length
    const response = getResponse(t);
    const delay = 600 + Math.min(response.length * 8, 1800);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: response, time: new Date() }]);
      if (!open) setUnread(n => n + 1);
    }, delay);
  };

  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-2xl flex items-center justify-center text-2xl"
        style={{ boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>✕</motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>💬</motion.span>
          )}
        </AnimatePresence>
        {unread > 0 && !open && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
            {unread}
          </motion.span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(99,102,241,0.25)', backdropFilter: 'blur(20px)', height: '520px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-purple-700" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm leading-tight">SafeSphere Assistant</p>
                <p className="text-white/60 text-xs">{typing ? 'Typing...' : 'Online · Replies instantly'}</p>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#4f46e5 transparent' }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {m.from === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs shrink-0 mt-1">🤖</div>
                  )}
                  <div className={`max-w-[82%] ${m.from === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                    <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      m.from === 'user'
                        ? 'bg-gradient-to-br from-brand-500 to-purple-600 text-white rounded-br-sm'
                        : 'bg-dark-700 text-slate-200 rounded-bl-sm'
                    }`}>
                      <MsgText text={m.text} />
                    </div>
                    <span className="text-slate-600 text-xs px-1">{fmt(m.time)}</span>
                  </div>
                  {m.from === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-dark-600 flex items-center justify-center text-xs shrink-0 mt-1">👤</div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs shrink-0">🤖</div>
                  <TypingDots />
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <div className="px-3 py-2 flex gap-1.5 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium text-brand-400 border border-brand-500/30 hover:bg-brand-500/10 transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3 shrink-0">
              <div className="flex gap-2 items-center bg-dark-700 rounded-xl border border-white/10 focus-within:border-brand-500/50 transition-colors px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => send()}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs disabled:opacity-40 transition-opacity shrink-0"
                >
                  ➤
                </motion.button>
              </div>
              <p className="text-center text-slate-600 text-xs mt-1.5">Powered by SafeSphere AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
