const router = require('express').Router();
const Complaint = require('../models/Complaint');
const authMiddleware = require('../middleware/auth');

// Comprehensive harmful words list — 400+ entries
const HARMFUL_WORDS = [

  // ── DIRECT INSULTS ──────────────────────────────────────────────────────
  'stupid','idiot','moron','dumb','dumbass','retard','retarded','imbecile',
  'fool','foolish','loser','pathetic','worthless','useless','trash','garbage',
  'scum','filth','disgusting','ugly','fat','pig','swine','rat','dog','beast',
  'freak','weirdo','creep','psycho','lunatic','crazy','insane','nutcase',
  'dimwit','halfwit','nitwit','twit','dunce','blockhead','bonehead','airhead',
  'birdbrain','pea brain','numbskull','knucklehead','lamebrain','meathead',
  'dolt','dullard','simpleton','nincompoop','ninny','buffoon','clown','joke',
  'laughingstock','embarrassment','disgrace','shame','failure','reject',
  'nobody','nothing','zero','loser','waste','burden','parasite','leech',
  'coward','wimp','weakling','spineless','gutless','yellow','chicken',
  'crybaby','baby','manchild','immature','childish','pathetic excuse',
  'poor excuse','excuse for a human','subhuman','animal','creature',

  // ── APPEARANCE SHAMING ──────────────────────────────────────────────────
  'ugly','hideous','grotesque','repulsive','revolting','vile','nasty',
  'disgusting face','ugly face','fat pig','fat cow','obese','overweight',
  'skinny freak','anorexic','too fat','too skinny','ugly body','deformed',
  'monster','troll','goblin','witch','hag','beast','eyesore','hideous freak',
  'no one would date you','undateable','unlovable','undesirable','repulsive',

  // ── HATE SPEECH & DISCRIMINATION ────────────────────────────────────────
  'hate','despise','detest','abhor','loathe','racist','bigot','xenophobe',
  'discriminate','prejudice','sexist','misogynist','homophobe','transphobe',
  'go back to your country','you dont belong here','your kind','your people',
  'inferior race','superior race','ethnic cleansing','genocide','exterminate',

  // ── THREATS & VIOLENCE ──────────────────────────────────────────────────
  'kill','murder','die','death','hurt','harm','attack','destroy','beat',
  'punch','stab','shoot','bomb','threat','threaten','revenge','payback',
  'suffer','pain','bleed','maim','torture','strangle','choke','drown',
  'burn','set on fire','acid attack','slash','cut you','break your bones',
  'smash your face','bash your head','knock you out','beat you up',
  'i will find you','i know where you live','i know where you go to school',
  'watch your back','you wont see it coming','you are dead','dead meat',
  'dead to me','i will end you','i will destroy you','i will ruin you',
  'i will make you pay','you will regret this','you will suffer',
  'i will hurt you','i will kill you','i am going to kill you',
  'going to hurt you','going to attack you','going to beat you',

  // ── CYBERBULLYING SPECIFIC ──────────────────────────────────────────────
  'expose you','doxx','doxing','leak your address','leak your number',
  'leak your photos','share your photos','post your pictures','screenshot',
  'spread rumors','tell everyone','ruin your reputation','cancel you',
  'cancel culture','report you','get you banned','hack you','hack your account',
  'steal your account','take over your account','swat you','swatting',
  'catfish','fake account','impersonate','pretend to be you',
  'make everyone hate you','turn everyone against you','isolate you',
  'no one will believe you','no one will help you','you are alone',

  // ── HARASSMENT & STALKING ────────────────────────────────────────────────
  'bully','harass','stalk','stalker','following you','watching you',
  'i see you','i am watching','i know your schedule','i know your routine',
  'blackmail','manipulate','gaslight','control you','own you',
  'humiliate','embarrass','shame','mock','ridicule','taunt','tease',
  'torment','torturing','haunt you','never leave you alone','obsessed with you',

  // ── EXCLUSION & SOCIAL HARM ──────────────────────────────────────────────
  'nobody likes you','no one likes you','everyone hates you','go away',
  'get lost','disappear','no one wants you','you dont belong','leave',
  'unwanted','unloved','alone','friendless','rejected','outcast',
  'you have no friends','you will never have friends','you are invisible',
  'no one cares about you','no one would miss you','you are irrelevant',
  'you are insignificant','you dont matter','you are nothing to anyone',
  'you are a burden','everyone is better without you','world is better without you',

  // ── SEXUAL HARASSMENT ────────────────────────────────────────────────────
  'slut','whore','bitch','bastard','asshole','dick','prick','cunt','twat',
  'hoe','thot','skank','tramp','floozy','prostitute','sex worker insult',
  'send nudes','send pics','show me','sexual favors','sleep with me',
  'i will rape you','rape threat','sexual assault','molest','grope',
  'touch you','inappropriate touching','sexual harassment',

  // ── SELF HARM ENCOURAGEMENT ──────────────────────────────────────────────
  'kill yourself','kys','end yourself','end your life','take your own life',
  'nobody cares if you die','better off dead','do it','just do it already',
  'no one would miss you','world is better without you','go die',
  'drop dead','die already','why are you still alive','you should not exist',
  'you should never have been born','your parents regret you',
  'your family hates you','everyone wishes you were gone',

  // ── MENTAL HEALTH ATTACKS ────────────────────────────────────────────────
  'you are crazy','you are mental','you are psycho','you are insane',
  'you need help','you are broken','you are damaged','you are messed up',
  'something is wrong with you','you are not normal','you are abnormal',
  'you are a freak of nature','you are defective','you are a mistake',
  'you were a mistake','you are an accident','your parents regret having you',

  // ── GENERAL TOXIC ────────────────────────────────────────────────────────
  'shut up','shut your mouth','shut your face','shut your trap',
  'get out','go to hell','go die','drop dead','go jump off a bridge',
  'waste of space','waste of time','waste of oxygen','waste of skin',
  'never wanted','mistake','accident','regret','failure','born loser',
  'good for nothing','hopeless','helpless','no future','no one cares',
  'invisible','irrelevant','insignificant','pointless','purposeless',
  'you will never amount to anything','you will never succeed',
  'you will always be a failure','you are a disappointment',
  'you disappoint everyone','you let everyone down',
  'no one is proud of you','no one respects you','no one trusts you',

  // ── HINDI / HINGLISH ABUSIVE WORDS ──────────────────────────────────────
  'bewakoof','gadha','ullu','pagal','kamina','kameena','harami','haramzada',
  'kutte','suar','bakwaas','chutiya','madarchod','bhenchod','gaandu',
  'randi','saala','saali','nalayak','nikamma','bekar','ghatiya','neech',
  'kutta','besharam','badtameez','ganda','jhootha','chor','dhokhebaaz',
  'namard','napunsak','bhadwa','dalal','lafanga','awara','badmaash',
  'gundagardi','darpok','kayar','bhadka','jhalla','pagla','sanka',
  'andha','bahra','lula','langda','apahij insult','buddhu','murkh',
  'jaahil','anpadh','ganwar','dehati insult','jungle','junglee',

  // ── REGIONAL / SOUTH ASIAN SLURS ────────────────────────────────────────
  'madrasi insult','bhaiya insult','ghati','marathi insult','bihari insult',
  'nepali insult','bangladeshi insult','pakis','chinki','kalia','kaalu',

  // ── BODY SHAMING ─────────────────────────────────────────────────────────
  'flat chest','small chest','big nose','big ears','four eyes','bald',
  'too tall','too short','midget','dwarf insult','giant insult',
  'stretch marks','acne face','pimple face','spotty','blotchy',
  'smelly','stinky','you stink','body odor','bad breath',

  // ── FAMILY ATTACKS ───────────────────────────────────────────────────────
  'your mom','your mother','your father','your family','your parents',
  'your sister','your brother','your family is trash','your family is garbage',
  'your parents failed','your parents are ashamed','your family hates you',
  'orphan insult','bastard child','illegitimate','your dad left you',
  'your mom doesnt love you','your parents wish you were never born',

  // ── ACADEMIC / PROFESSIONAL ATTACKS ─────────────────────────────────────
  'you will fail','you are going to fail','you will never pass',
  'you are too dumb to study','you are too stupid for this',
  'you will never get a job','you are unemployable','you are a dropout',
  'you will end up nowhere','you have no future','you are a dead end',
  'you will never be successful','you are a complete failure',

  // ── ONLINE GAMING TOXICITY ───────────────────────────────────────────────
  'noob','trash player','get rekt','get owned','you suck','uninstall',
  'go back to kindergarten','bot','hacker accusation','cheater',
  'reported','ez','easy','ratio','l bozo','cope','seethe','mald',
  'skill issue','touch grass','no life','basement dweller',

  // ── RELATIONSHIP ATTACKS ─────────────────────────────────────────────────
  'no one will ever love you','you will die alone','you are unlovable',
  'you are too ugly to date','no one wants to be with you',
  'your partner will leave you','your partner is cheating on you',
  'you are a bad partner','you are toxic','you are abusive',
  'you deserve to be alone','you are not worth loving',
];


function detectHarmfulWords(text) {
  const lower = text.toLowerCase();
  return HARMFUL_WORDS.filter(w => lower.includes(w.toLowerCase()));
}

function calculateSeverity(detectedWords, text) {
  const lower = text.toLowerCase();
  const critical = [
    'kill yourself','kys','kill','murder','die','death','stab','shoot','bomb',
    'end yourself','better off dead','i will kill you','i am going to kill you',
    'going to kill','rape threat','i will rape','acid attack','swatting','swat you',
    'take your own life','end your life','world is better without you',
    'you should not exist','why are you still alive'
  ];
  const high = [
    'threat','threaten','expose','doxx','doxing','blackmail','find you',
    'watch your back','harm','hurt','attack','beat you up','i will hurt you',
    'i will destroy you','i will ruin you','leak your','share your photos',
    'hack you','hack your account','i know where you live','i see you',
    'i am watching','madarchod','bhenchod','haramzada','rape','molest',
    'sexual assault','send nudes','going to hurt','going to attack'
  ];
  if (critical.some(w => lower.includes(w))) return 'critical';
  if (high.some(w => lower.includes(w)) || detectedWords.length >= 6) return 'high';
  if (detectedWords.length >= 3) return 'medium';
  return 'low';
}

// Guest complaint — no login required (anyone can report)
router.post('/guest', async (req, res) => {
  try {
    const { offenderName, offenderPlatform, incidentDescription, harmfulContent, reporterName, reporterEmail } = req.body;
    if (!offenderName || !offenderPlatform || !incidentDescription || !harmfulContent)
      return res.status(400).json({ message: 'All fields are required' });
    const detectedWords = detectHarmfulWords(harmfulContent + ' ' + incidentDescription);
    const severity = calculateSeverity(detectedWords, harmfulContent + ' ' + incidentDescription);
    const User = require('../models/User');
    const admins = await User.find({ role: 'admin' }).limit(3);
    const count = await Complaint.countDocuments();
    const assignedAdmin = admins.length > 0 ? admins[count % admins.length]._id : null;
    const complaint = await Complaint.create({
      reportedByName: reporterName || 'Anonymous',
      reportedByEmail: reporterEmail || '',
      offenderName, offenderPlatform, incidentDescription, harmfulContent,
      detectedWords, severity, assignedAdmin,
    });
    res.status(201).json({ complaint, message: 'Complaint filed successfully. An administrator will review it shortly.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a complaint (logged-in users)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { offenderName, offenderPlatform, incidentDescription, harmfulContent } = req.body;
    if (!offenderName || !offenderPlatform || !incidentDescription || !harmfulContent)
      return res.status(400).json({ message: 'All fields are required' });

    const detectedWords = detectHarmfulWords(harmfulContent + ' ' + incidentDescription);
    const severity = calculateSeverity(detectedWords, harmfulContent + ' ' + incidentDescription);

    // Round-robin assign to one of 3 admins
    const User = require('../models/User');
    const admins = await User.find({ role: 'admin' }).limit(3);
    const count = await Complaint.countDocuments();
    const assignedAdmin = admins.length > 0 ? admins[count % admins.length]._id : null;

    const complaint = await Complaint.create({
      reportedBy: req.user.id,
      reportedByName: req.body.reporterName,
      reportedByEmail: req.body.reporterEmail,
      offenderName, offenderPlatform, incidentDescription, harmfulContent,
      detectedWords, severity, assignedAdmin,
    });

    res.status(201).json({ complaint, message: 'Complaint filed successfully. An administrator will review it shortly.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my complaints
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ reportedBy: req.user.id }).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Detect harmful words in text (public helper)
router.post('/detect', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: 'Text required' });
  const detected = detectHarmfulWords(text);
  const severity = calculateSeverity(detected, text);
  res.json({ detected, severity, count: detected.length, isCyberbullying: detected.length > 0 });
});

module.exports = router;
module.exports.HARMFUL_WORDS = HARMFUL_WORDS;
module.exports.detectHarmfulWords = detectHarmfulWords;
