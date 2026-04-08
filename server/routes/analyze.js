const router = require('express').Router();
const Analysis = require('../models/Analysis');
const authMiddleware = require('../middleware/auth');

// Simulated AI analysis engine (replace with real ML model/API)
function analyzeText(text) {
  const lower = text.toLowerCase();

  const hateWords = [
    'stupid','idiot','moron','dumb','dumbass','retard','imbecile','fool','loser','pathetic',
    'worthless','useless','trash','garbage','scum','filth','disgusting','ugly','fat','pig',
    'freak','weirdo','creep','psycho','lunatic','crazy','insane','nutcase','dimwit','halfwit',
    'nitwit','twit','dunce','blockhead','bonehead','airhead','birdbrain','numbskull',
    'dolt','simpleton','buffoon','clown','joke','laughingstock','embarrassment','disgrace',
    'nobody','nothing','zero','waste','burden','parasite','leech','coward','wimp','weakling',
    'hate','despise','detest','abhor','loathe','racist','bigot','xenophobe','discriminate',
    'bewakoof','gadha','ullu','pagal','kamina','kameena','harami','haramzada','kutte','suar',
    'chutiya','madarchod','bhenchod','gaandu','randi','saala','nalayak','nikamma','bekar',
    'ghatiya','neech','kutta','besharam','badtameez','ganda','jhootha','chor','dhokhebaaz',
    'namard','lafanga','awara','badmaash','darpok','kayar','buddhu','murkh','jaahil',
    'slut','whore','bitch','bastard','asshole','dick','prick','cunt','twat','hoe','thot','skank',
    'noob','trash player','you suck','uninstall','bot','no life','basement dweller',
  ];

  const toxicWords = [
    'shut up','shut your mouth','get out','go to hell','go die','drop dead',
    'waste of space','waste of time','waste of oxygen','never wanted','mistake','accident',
    'failure','born loser','good for nothing','hopeless','helpless','no future',
    'nobody likes you','no one likes you','everyone hates you','go away','get lost',
    'disappear','no one wants you','you dont belong','leave','unwanted','unloved',
    'friendless','rejected','outcast','you have no friends','you are invisible',
    'no one cares about you','you dont matter','you are nothing','you are a burden',
    'nobody cares','better off dead','go jump off a bridge','you will fail',
    'you will never succeed','you are a disappointment','no one is proud of you',
    'you will die alone','you are unlovable','you are too ugly to date',
    'mock','ridicule','taunt','tease','torment','humiliate','embarrass','shame',
    'bully','harass','manipulate','gaslight','blackmail',
  ];

  const harassWords = [
    'follow you','watch you','find you','expose you','doxx','doxing',
    'leak your address','leak your number','leak your photos','share your photos',
    'screenshot','spread rumors','tell everyone','ruin your reputation','cancel you',
    'hack you','hack your account','steal your account','swat you','swatting',
    'catfish','impersonate','make everyone hate you','turn everyone against you',
    'i know where you live','i know where you go','i see you','i am watching',
    'i will find you','watch your back','you wont see it coming',
    'i will expose you','i will ruin you','i will destroy you','i will make you pay',
  ];

  const threatWords = [
    'kill','murder','die','death','hurt','harm','attack','destroy','beat','punch','stab',
    'shoot','bomb','threaten','revenge','payback','suffer','pain','bleed','maim','torture',
    'strangle','choke','drown','burn','set on fire','acid attack','slash','cut you',
    'break your bones','smash your face','bash your head','knock you out','beat you up',
    'i will kill you','i am going to kill you','going to hurt you','going to attack you',
    'dead meat','i will end you','you will regret this','you will suffer',
    'kill yourself','kys','end yourself','end your life','take your own life',
    'better off dead','world is better without you','you should not exist',
    'why are you still alive','you should never have been born',
    'rape','molest','sexual assault','i will rape you','rape threat',
  ];

  let score = 0;
  threatWords.forEach(w => { if (lower.includes(w)) score += 5; });
  harassWords.forEach(w => { if (lower.includes(w)) score += 3; });
  hateWords.forEach(w => { if (lower.includes(w)) score += 2; });
  toxicWords.forEach(w => { if (lower.includes(w)) score += 1.5; });

  let label, sentiment, threatLevel, action, confidence;

  if (score >= 10) {
    label = 'hate'; sentiment = 'hostile'; threatLevel = 'high';
    action = 'Alert sent to admin'; confidence = Math.min(95 + Math.floor(score / 2), 99);
  } else if (score >= 5) {
    label = 'toxic'; sentiment = 'negative'; threatLevel = 'medium';
    action = 'User warned'; confidence = Math.min(80 + score * 2, 97);
  } else if (score >= 2) {
    label = 'harassment'; sentiment = 'negative'; threatLevel = 'low';
    action = 'Flagged for review'; confidence = Math.min(65 + score * 3, 90);
  } else {
    label = 'safe'; sentiment = 'positive'; threatLevel = 'none';
    action = 'No action needed'; confidence = 97;
  }

  return { label, sentiment, threatLevel, action, confidence };
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { text, platform } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const result = analyzeText(text);
    const analysis = await Analysis.create({ userId: req.user.id, text, result, platform: platform || 'manual' });
    res.json({ analysis });
  } catch {
    res.status(500).json({ message: 'Analysis failed' });
  }
});

router.post('/demo', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text required' });
  res.json({ result: analyzeText(text) });
});

module.exports = router;
