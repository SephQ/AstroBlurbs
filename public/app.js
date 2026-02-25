// Profile Management
class ProfileManager {
    constructor() {
        this.profiles = this.loadProfiles();
        this.currentProfile = null;
    }

    loadProfiles() {
        const stored = localStorage.getItem('astroblurb_profiles');
        return stored ? JSON.parse(stored) : [];
    }

    saveProfiles() {
        localStorage.setItem('astroblurb_profiles', JSON.stringify(this.profiles));
    }

    addProfile(profile) {
        profile.id = Date.now().toString();
        profile.createdAt = new Date().toISOString();
        this.profiles.push(profile);
        this.saveProfiles();
        return profile;
    }

    deleteProfile(id) {
        this.profiles = this.profiles.filter(p => p.id !== id);
        this.saveProfiles();
    }

    getProfile(id) {
        return this.profiles.find(p => p.id === id);
    }
}

// Blurb Templates (will be database-backed later)
const DEFAULT_BLURBS = [
    {
        id: 1,
        text: "I am @sun but my emotions are rather @moon. I think in a @mercury way, but express my energy in a @mars way. In love, I seek @venus. I take on the role of @rising.",
        author: "zodiac--signs.tumblr.com",
        replacements: {
            sun: ['an initiator','a guardian','a wanderer','a psychic','a warrior','a mastermind','a peacemaker','a detective','an explorer','an entrepreneur','a visionary','a dreamer', ],
            moon: ['intense','enduring','sparkling','deep','vibrant','composed','whimsical','overwhelming','vivid','guarded','unpredictable','extreme'],
            mercury: ['direct','practical','lighthearted','intuitive','dynamic','fruitful','artistical','complex','curious','purposeful','logical','vague'],
            mars: ['combative','abiding','erratic','protective','powerful','efficient','passive','brooding','lively','focused','analytical','creative'],
            venus: ['passion','commitment','stimulation','security','affection','respect','support','devotion','excitement','intensity','understanding','stability'],
            rising: ['the pioneer','the owner','the messenger','the nurturer','the protector','the organizer','the aesthete','the mystic','the comedian','the old soul','the outlaw','the creator']
        }
    },
    {
        id: 2,
        text: "You're just a @moon @sun who acts like they're a @venus @mars.",
        author: "AstroBlurb",
        replacements: {
            moon: ["hyperactive", "relentless", "talkative", "loving", "dramatic", "dedicated", "charming", "intense", "adventurous", "ambitious", "erratic", "easy-going"],
            sun: ["clown", "sloth", "chatter-box", "hermit-crab", "drama queen", "buzz-kill", "fence-sitter", "edge-lord", "dilettante", "workaholic", "weirdo", "tadpole"], 
            venus: ["passionate", "dependable", "popular", "empathic", "famous", "innocent", "posh", "pioneering", "global", "successful", "revolutionary", "tortured"], 
            mars: ["hero", "bull", "comedian", "child", "celebrity", "martyr", "expert", "detective", "philosopher", "CEO", "prophet", "healer"]
        }
    },
    {
        id: 3,
        text: "I am a @sun in @sunH, but I @moon in @moonH. I act @mars, but struggle with @chiron @chironH.",
        author: "AstroBlurb",
        replacements: {
            sun: ["warrior", "builder", "communicator", "nurturer", "leader", "healer", "mediator", "transformer", "explorer", "achiever", "innovator", "dreamer"],
            sunH: ["my identity", "my resources", "my communication", "the home", "my creativity", "my work", "my relationships", "deep waters", "my beliefs", "my career", "my community", "my solitude"],
            moon: ["fight back", "hold steady", "overthink", "feel deeply", "perform", "analyze", "people-please", "dive deep", "wander", "control", "detach", "flow"],
            moonH: ["my self-assuredness", "what I have", "what I say", "where I belong", "what I create", "my daily life", "my partnerships", "my transformations", "my philosophy", "my work life", "my friendships", "my subconscious"],
            mars: ["aggressive", "stubborn", "quick-witted", "protective", "confident", "critical", "diplomatic", "intense", "blunt", "calculating", "rebellious", "passive"],
            chiron: ["personal", "material", "intellectual", "emotional", "public", "domestic", "relational", "obsessive", "existential", "career", "human", "spiritual"],
            chironH: ["identity", "stability", "communication", "crises", "showmanship", "service", "intimacy", "power trips", "growth", "ambition", "connection", "isolation"]
        }
    },
    {
        id: 4,
        text: "I think like a @mercury, dream like a @moon, and love like a @venus.",
        author: "AstroBlurb",
        replacements: {
            mercury: ["warrior", "pragmatist", "butterfly", "poet", "performer", "analyst", "diplomat", "detective", "philosopher", "strategist", "inventor", "mystic"],
            moon: ["fighter", "creature of comfort", "chameleon", "mother hen", "future celebrity", "helper", "socialite", "phoenix", "wanderer", "mountain", "alien", "ocean"],
            venus: ["wildfire", "romantic traditionalist", "flirt", "devoted protector", "dramatic lover", "perfectionist partner", "harmonious soul", "all-or-nothing lover", "free spirit", "steady partner", "unconventional heart", "selfless romantic"]
        }
    },
    {
    id: 5,
    text: "My power lies in @plutoH, I assert myself through @mars, but I refuse to be tamed in my @lilith.",
    author: "AstroBlurb",
    replacements: {
        plutoH: ["who I am", "what I own", "what I say", "my roots", "my creativity", "my service", "my relationships", "my sexuality", "my beliefs", "my reputation", "my ideals", "self-awareness"],
        mars: ["direct combat", "stubborn resistance", "sharp words", "emotional tests", "grand gestures", "meticulous action", "strategic compromise", "psychological warfare", "bold adventure", "calculated steps", "revolutionary action", "subtle sabotage"],
        lilith: ["raw identity", "material desires", "unfiltered speech", "primal needs", "sexual expression", "bodily autonomy", "partnership demands", "dark desires", "wild freedom", "ambitious hunger", "radical authenticity", "spiritual rebellion"]
        }
    },
    {
        id: 6,
        text: "I've transformed through @plutoH. When threatened, I @mars like a @lilith, even though my deepest wound is @chironH.",
        author: "AstroBlurb",
        replacements: {
            plutoH: ["reinventing myself", "survival", "speaking truth", "family trauma", "creative rebirth", "health crises", "relationship deaths", "sexual awakening", "existential shifts", "career destruction", "collective movements", "spiritual dissolution"],
            mars: ["charge forward", "stand firm", "talk back", "defend emotionally", "perform loudly", "serve perfectly", "negotiate carefully", "strike deep", "escape freely", "strategize coldly", "rebel openly", "withdraw mysteriously"],
            lilith: ["wild animal", "unstoppable force", "silver tongue", "fierce mother", "diva", "pure vessel", "rebel queen", "dark priestess", "free spirit", "power player", "alien", "witch"],
            chironH: ["self-loathing", "worthlessness", "being misunderstood", "abandonment", "seeking validation", "never enough", "losing myself", "betrayal", "feeling caged", "failure", "not belonging", "invisibility"]
        }
    },
    {
        id: 7,
        text: "I find joy through @jupiter @jupiterH, my @venus heart craves @venusH, but my @moon side needs @moonH to feel safe.",
        author: "AstroBlurb",
        replacements: {
            jupiter: ["pioneering", "building", "discussing", "nurturing", "displaying", "perfecting", "connecting with", "transforming", "exploring", "mastering", "innovating in", "transcending through"],
            jupiterH: ["new paths", "my resources", "new subjects", "my home life", "my talents", "my work", "my relationships", "the depths", "new places", "my career", "my community", "my spirituality"],
            venus: ["impulsive", "sensual", "curious", "tender", "proud", "discerning", "romantic", "obsessive", "adventurous", "traditional", "detached", "dreamy"],
            venusH: ["validation", "security", "variety", "belonging", "admiration", "usefulness", "partnership", "merger", "freedom", "respect", "friendship", "unconditional love"],
            moon: ["reactive", "comfort-seeking", "restless", "sensitive", "dramatic", "anxious", "harmonious", "intense", "optimistic", "emotionally-guarded", "independent", "empathetic"],
            moonH: ["independence", "stability", "stimulation", "privacy", "spotlight", "routine", "companionship", "intensity", "adventure", "structure", "community", "solitude"]
        }
    },
    {
        id: 8,
        text: "My @mercury mind works through @mercuryH. @saturn taught me discipline in @saturnH, while @neptune dissolves boundaries in @neptuneH. I nurture by @ceres @ceresH.",
        author: "AstroBlurb",
        replacements: {
            mercury: ["reactive", "methodical", "rapid-fire", "intuitive", "performative", "analytical", "balanced", "probing", "philosophical", "strategic", "innovative", "poetic"],
            mercuryH: ["self-talk", "resource management", "daily conversations", "family dynamics", "creative projects", "problem-solving", "negotiations", "research", "belief systems", "career planning", "group brainstorming", "meditation"],
            saturn: ["Independence", "Self-worth", "Communication", "Emotional security", "Self-expression", "Perfectionism", "Relationships", "Control", "Meaning", "Achievement", "Belonging", "Boundaries"],
            saturnH: ["my identity", "my finances", "my education", "my home", "my hobbies", "my job", "my marriage", "my sexuality", "my worldview", "my reputation", "my friendships", "my inner world"],
            neptune: ["ego", "materialism", "facts", "defenses", "performances", "criticism", "people-pleasing", "power", "dogma", "my work", "individuality", "reality"],
            neptuneH: ["who I am", "what I own", "what I think", "where I live", "what I love", "how I serve", "who I love", "what I fear", "what I believe", "who I become", "how I connect", "where I hide"],
            ceres: ["fighting for", "providing for", "teaching", "protecting", "celebrating", "organising", "partnering with", "transforming", "exploring with", "guiding", "liberating", "healing"],
            ceresH: ["myself", "my loved ones", "others", "my home", "my creations", "those in need", "my partner", "others", "my students", "my community", "the oppressed", "the wounded"]
        }
    },
    {
        id: 9,
        text: "I'm a @sun at my core, but @uranusH makes @uranus complicated. My commitment style is @juno, though my @mars energy gets expressed through @marsH.",
        author: "AstroBlurb",
        replacements: {
            sun: ["warrior", "hedonist", "storyteller", "caregiver", "performer", "craftsperson", "diplomat", "alchemist", "philosopher", "architect", "revolutionary", "mystic"],
            uranusH: ["reinventing myself", "financial chaos", "disruptive ideas", "family rebellion", "creative genius", "work revolution", "relationship upheaval", "sexual desire", "changing beliefs", "career change", "non-conformity", "mystical awakening"],
            uranus: ["my identity", "my values", "communication", "family life", "creativity", "my health", "my relationships", "intimacy", "my beliefs", "my career", "my friendships", "spirituality"],
            juno: ["independent", "loyal", "intellectual", "nurturing", "passionate", "practical", "balanced", "intense", "freedom-loving", "committed", "unconventional", "spiritual"],
            mars: ["direct", "steady", "witty", "protective", "bold", "precise", "fair", "strategic", "spontaneous", "controlled", "rebellious", "intuitive"],
            marsH: ["self-assertion", "earning money", "debates", "building my nest", "creative passion", "daily tasks", "partnership conflicts", "power struggles", "activism", "career ambition", "social causes", "hidden anger"]
        }
    },
    {
        id: 10,
        text: "I am naturally @lifepath, and my purpose is @northnode through @northnodeH. In this life I will transform @plutoH, express identity in @sunH, while overcoming @saturnH @saturn.",
        author: "AstroBlurb",
        replacements: {
            lifepath: ["an independent leader", "a diplomatic peacemaker", "a creative communicator", "a practical builder", "a freedom-loving adventurer", "a nurturing caretaker", "a spiritual seeker", "an ambitious achiever", "a humanitarian helper", "an intuitive visionary", "a master builder", "a master teacher"],
            northnode: ["pioneering", "stabilizing", "communicating", "nurturing", "creating", "serving", "connecting", "transforming", "expanding", "achieving", "innovating", "transcending"],
            northnodeH: ["self-discovery", "cultivating self-worth", "learning and teaching", "building roots", "creative self-expression", "healing service", "authentic partnership", "deep intimacy", "higher learning", "public contribution", "community building", "spiritual surrender"],
            plutoH: ["my identity and ego", "my relationship with money", "how I communicate", "my family patterns", "my creative power", "my daily habits", "my intimate bonds", "my sexual nature", "my belief systems", "my career ambitions", "my social circles", "my hidden fears"],
            sunH: ["the spotlight", "material stability", "intellectual pursuits", "domestic life", "creative projects", "service work", "one-on-one connections", "shadow integration", "philosophical exploration", "professional achievement", "group dynamics", "solitary reflection"],
            saturnH: ["self-doubt", "financial insecurity", "communication anxiety", "family obligations", "creative blocks", "health perfectionism", "relationship fears", "intimacy walls", "dogmatic thinking", "success pressure", "isolation tendencies", "existential confusion"],
            saturn: ["through impatient action", "with material security fears", "around communication barriers", "via emotional walls", "in creative confidence", "through perfectionist tendencies", "in relationship commitment", "with control and vulnerability", "around rigid beliefs", "through authority and ambition", "in belonging and detachment", "with boundaries and escapism"]
        }
    }
];

// Synastry Blurb Templates
// Tokens use [@planet, fallback] syntax resolved from synastry aspect keywords.
// @planet = first aspect (by orb) involving that planet from either profile.
// @planet@planet = first aspect between those two planets in either direction.
// See README for full token syntax.
const DEFAULT_SYNASTRY_BLURBS = [
    {
        id: 1,
        text: "When we talk it gives [@mercury, nothing], and when we met it felt like [@NN, no big deal].",
        author: "AstroBlurb"
    },
    {
        id: 2,
        text: "Our love language is [@venus, a mystery]. Together we feel [@moon, disconnected], and we fight about [@mars, surprisingly little].",
        author: "AstroBlurb"
    },
    {
        id: 3,
        text: "[@sun, Nothing stands out, 3-5, [, ]]a are what define us. Behind closed doors it is all [@pluto, pretty tame, 2-3, [, ]]a. Our wounds meet in a place of [@chiron, quiet indifference].",
        author: "AstroBlurb"
    },
    {
        id: 4,
        text: "Our chemistry is full of [@venus@mars, nothing, 1-2, [, ]]a. Emotionally we share [@moon@moon, very little, 1-2, [, ]]a. Our ideas [@mercury@jupiter, rarely cross paths, 1-2, [, ]]a.",
        author: "AstroBlurb"
    }
];

// Aspect Calculator (for both natal and synastry aspects)
class AspectCalculator {
    constructor(aspectsData) {
        this.aspectsData = aspectsData;
        this.aspects = {
            Conjunction: { angle: 0, orb: 10.5, key: 'Conjunct' },
            Opposition: { angle: 180, orb: 10.0, key: 'Opposition' },
            Trine: { angle: 120, orb: 8.3, key: 'Trine' },
            Square: { angle: 90, orb: 7.8, key: 'Square' },
            Sextile: { angle: 60, orb: 6.1, key: 'Sextile' },
            Inconjunct: { angle: 150, orb: 2.7, key: 'Inconjunct' }
        };
        this.planets = ['SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER',
            'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO', 'N. NODE', 'CHIRON', 'LILITH'];
    }

    calculateNatal(profile) {
        const aspects = [];

        for (let i = 0; i < this.planets.length; i++) {
            const planet1 = this.planets[i];
            const p1 = profile.chart?.planets[planet1];
            if (!p1) continue;

            for (let j = i + 1; j < this.planets.length; j++) {
                const planet2 = this.planets[j];
                const p2 = profile.chart?.planets[planet2];
                if (!p2) continue;

                const distance = this.getAngularDistance(p1.longitude, p2.longitude);
                const aspect = this.checkAspect(distance);

                if (aspect) {
                    const lookupKey = this.getLookupKey(planet1, planet2, aspect.key);
                    const data = this.aspectsData[lookupKey];

                    aspects.push({
                        planet1,
                        planet2,
                        aspectType: aspect.name,
                        angle: distance.toFixed(2),
                        orb: aspect.orb.toFixed(2),
                        description: data?.description || 'No interpretation available',
                        keywords: data?.keywords || ''
                    });
                }
            }
        }

        return aspects.sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb));
    }

    calculate(profile1, profile2) {
        const aspects = [];

        for (const planet1 of this.planets) {
            const p1 = profile1.chart?.planets[planet1];
            if (!p1) continue;

            for (const planet2 of this.planets) {
                const p2 = profile2.chart?.planets[planet2];
                if (!p2) continue;

                const distance = this.getAngularDistance(p1.longitude, p2.longitude);
                const aspect = this.checkAspect(distance);

                if (aspect) {
                    const lookupKey = this.getLookupKey(planet1, planet2, aspect.key);
                    const data = this.aspectsData[lookupKey];

                    aspects.push({
                        planet1,
                        planet2,
                        profile1Name: profile1.name,
                        profile2Name: profile2.name,
                        aspectType: aspect.name,
                        angle: distance.toFixed(2),
                        orb: aspect.orb.toFixed(2),
                        description: data?.description || 'No interpretation available',
                        keywords: data?.keywords || ''
                    });
                }
            }
        }

        return aspects.sort((a, b) => parseFloat(a.orb) - parseFloat(b.orb));
    }

    getAngularDistance(angle1, angle2) {
        let diff = Math.abs(angle1 - angle2);
        return diff > 180 ? 360 - diff : diff;
    }

    checkAspect(distance) {
        for (const [name, { angle, orb, key }] of Object.entries(this.aspects)) {
            const actualOrb = Math.abs(distance - angle);
            if (actualOrb <= orb) {
                return { name, key, orb: actualOrb };
            }
        }
        return null;
    }

    getLookupKey(p1, p2, aspectKey) {
        const normalize = (p) => {
            const mapping = {
                'SUN': 'Sun', 'MOON': 'Moon', 'MERCURY': 'Mercury', 'VENUS': 'Venus',
                'MARS': 'Mars', 'JUPITER': 'Jupiter', 'SATURN': 'Saturn',
                'URANUS': 'Uranus', 'NEPTUNE': 'Neptune', 'PLUTO': 'Pluto',
                'N. NODE': 'North Node', 'CHIRON': 'Chiron', 'LILITH': 'Lilith'
            };
            return mapping[p] || p;
        };
        const key1 = `${normalize(p1)}-${aspectKey}-${normalize(p2)}`;
        const key2 = `${normalize(p2)}-${aspectKey}-${normalize(p1)}`;
        return this.aspectsData[key1] ? key1 : key2;
    }
}

// State
const profileManager = new ProfileManager();
let currentChart = null;
let currentView = 'blurbs'; // 'blurbs', 'chart', or 'synastry'
let customBlurbs = JSON.parse(localStorage.getItem('custom_blurbs') || '[]');
let deletedBlurbs = JSON.parse(localStorage.getItem('deleted_blurbs') || '[]');
let deletedDefaultBlurbIds = JSON.parse(localStorage.getItem('deleted_default_blurb_ids') || '[]');
let generatedBlurbs = JSON.parse(localStorage.getItem('generated_blurbs') || '[]');
let profileFilters = {}; // { profileName: null | 'exclude' | 'include' }
let templateFilters = {}; // { templateId: null | 'exclude' | 'include' }
let modalCounter = 0;
let synastryCalculator = null;
let natalCalculator = null;
let selectedSynastryProfiles = { profile1: null, profile2: null };
let synastryKeywordFilters = new Set();
let natalKeywordFilters = new Set();
let synastryBlurbMode = false; // true when a profile pair is selected for blurbs
let currentSynastryAspects = []; // cached synastry aspects for the active pair
let customSynastryBlurbs = JSON.parse(localStorage.getItem('custom_synastry_blurbs') || '[]');
let deletedSynastryBlurbs = JSON.parse(localStorage.getItem('deleted_synastry_blurbs') || '[]');
let deletedDefaultSynastryBlurbIds = JSON.parse(localStorage.getItem('deleted_default_synastry_blurb_ids') || '[]');
let generatedSynastryBlurbs = []; // transient, re-evaluated each time a pair is chosen
let shorterDescriptions = false;

// Planet name normalisation for synastry token matching
const SYNASTRY_TOKEN_PLANET_MAP = {
    'sun': 'SUN', 'moon': 'MOON', 'mercury': 'MERCURY', 'venus': 'VENUS',
    'mars': 'MARS', 'jupiter': 'JUPITER', 'saturn': 'SATURN', 'uranus': 'URANUS',
    'neptune': 'NEPTUNE', 'pluto': 'PLUTO', 'chiron': 'CHIRON', 'lilith': 'LILITH',
    'nn': 'N. NODE', 'northnode': 'N. NODE', 'nnode': 'N. NODE'
};

// Parse a synastry blurb token, respecting nested brackets.
// Returns the resolved string for a single [...] token.
function parseSynastryToken(tokenBody, aspects, { forceOxfordAnd = false } = {}) {
    // tokenBody is everything between the outer [ and ] (bracket-depth-aware).
    // Split by commas at depth 0 only.
    const args = [];
    let depth = 0;
    let current = '';
    for (let i = 0; i < tokenBody.length; i++) {
        const ch = tokenBody[i];
        if (ch === '[') depth++;
        else if (ch === ']') depth--;
        if (ch === ',' && depth === 0) {
            args.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    args.push(current);

    // arg 0: @planet or @planet@planet
    const planetRef = args[0].trim();
    // arg 1: fallback text
    const fallback = args.length > 1 ? args[1].trim() : '';
    // arg 2: number of keywords to take (default 1); supports plain int or hyphenated range e.g. "3-5"
    let kwStart = 0, kwEnd = 1;
    if (args.length > 2) {
        const kwArg = args[2].trim();
        const rangeMatch = kwArg.match(/^(\d+)-(\d+)$/);
        if (rangeMatch) {
            kwStart = parseInt(rangeMatch[1], 10) - 1;  // convert to 0-based
            kwEnd   = parseInt(rangeMatch[2], 10);      // slice end is exclusive
        } else {
            kwEnd = parseInt(kwArg, 10) || 1;
        }
    }
    // arg 3: separator (may contain brackets) optionally ending with 'a' for Oxford-style last separator
    let separator = ', ';
    let oxfordAnd = false;
    if (args.length > 3) {
        let sepRaw = args[3].trim();
        // Check for trailing 'a' flag (Oxford-style "and" before last keyword)
        if (sepRaw.endsWith('a')) {
            // 'a' flag only applies when the arg ends with ]a or is just 'a'
            const inner = sepRaw.slice(0, -1);
            if (inner === '' || inner.endsWith(']')) {
                oxfordAnd = true;
                sepRaw = inner;
            }
        }
        // Strip outer [ ] if present
        if (sepRaw.startsWith('[') && sepRaw.endsWith(']')) {
            sepRaw = sepRaw.slice(1, -1);
        }
        separator = sepRaw || ', ';
    }
    if (forceOxfordAnd) oxfordAnd = true;

    // Parse planet reference(s)
    const atParts = planetRef.split('@').filter(Boolean);
    let matchedAspect = null;

    if (atParts.length === 1) {
        // Single planet: find first aspect involving this planet (either side)
        const upper = SYNASTRY_TOKEN_PLANET_MAP[atParts[0].toLowerCase()];
        if (upper) {
            matchedAspect = aspects.find(a =>
                a.planet1 === upper || a.planet2 === upper
            );
        }
    } else if (atParts.length === 2) {
        // Two planets: find first aspect between them in either direction
        const u1 = SYNASTRY_TOKEN_PLANET_MAP[atParts[0].toLowerCase()];
        const u2 = SYNASTRY_TOKEN_PLANET_MAP[atParts[1].toLowerCase()];
        if (u1 && u2) {
            matchedAspect = aspects.find(a =>
                (a.planet1 === u1 && a.planet2 === u2) ||
                (a.planet1 === u2 && a.planet2 === u1)
            );
        }
    }

    if (!matchedAspect || !matchedAspect.keywords) {
        return fallback;
    }

    // Extract keywords (comma-separated in the aspect data)
    const allKeywords = matchedAspect.keywords
        .split(',')
        .map(k => k.trim().replace(/\.$/, ''))
        .filter(Boolean);
    const picked = allKeywords.slice(kwStart, kwEnd).map(k => k.toLowerCase());

    if (picked.length === 0) return fallback;

    // Join with separator, using Oxford-style last item if flagged
    if (picked.length === 1) return picked[0];
    if (oxfordAnd && picked.length > 1) {
        const last = picked.pop();
        return picked.join(separator) + ' and ' + last;
    }
    return picked.join(separator);
}

// Resolve all synastry tokens in a template string.
// Tokens are delimited by [ and ] with bracket-depth awareness.
// Capitalisation follows sentence rules.
function resolveSynastryBlurb(template, aspects) {
    let result = '';
    let i = 0;

    while (i < template.length) {
        if (template[i] === '[') {
            // Find matching ] respecting depth
            let depth = 1;
            let j = i + 1;
            while (j < template.length && depth > 0) {
                if (template[j] === '[') depth++;
                else if (template[j] === ']') depth--;
                j++;
            }
            // j is now one past the closing ]
            const tokenEnd = j; // position of char after ']'
            // Check for a trailing 'a' suffix (Oxford "and") written outside the token
            // e.g. [@mars, fallback, 3]a   — consume the 'a' so it isn't emitted literally.
            // Guard: only consume when 'a' is not immediately followed by another word char
            // (so we don't eat the start of a real word like "ability").
            let forceOxfordAnd = false;
            if (template[tokenEnd] === 'a' && !/[a-zA-Z0-9_]/.test(template[tokenEnd + 1] ?? '')) {
                forceOxfordAnd = true;
                j++; // consume the 'a'
            }
            const tokenBody = template.slice(i + 1, tokenEnd - 1);
            let resolved = parseSynastryToken(tokenBody, aspects, { forceOxfordAnd });

            // Sentence-start capitalisation: uppercase if preceded by nothing,
            // or by . or ! or ? followed by optional whitespace
            const preceding = result.replace(/\s+$/, '');
            if (preceding.length === 0 || /[.!?]$/.test(preceding)) {
                resolved = resolved.charAt(0).toUpperCase() + resolved.slice(1);
            }

            result += resolved;
            i = j;
        } else {
            result += template[i];
            i++;
        }
    }

    return result;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    loadProfileList();
    loadBlurbList();
    
    // Load aspect data
    try {
        const [synastryResponse, natalResponse] = await Promise.all([
            fetch('/lib/synastry_aspects.json'),
            fetch('/lib/planet_aspects.json')
        ]);
        const synastryData = await synastryResponse.json();
        const natalData = await natalResponse.json();
        synastryCalculator = new AspectCalculator(synastryData);
        natalCalculator = new AspectCalculator(natalData);
    } catch (error) {
        console.error('Error loading aspect data:', error);
    }
    
    // If we have profiles, show blurbs section and auto-generate
    if (profileManager.profiles.length > 0) {
        document.getElementById('blurbsSection').style.display = 'block';
        document.getElementById('loading').style.display = 'block';
        try {
            await autoGenerateAllBlurbs();
        } catch (error) {
            console.error('Error auto-generating blurbs:', error);
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }
    
    refreshGeneratedBlurbs();
    setupEventListeners();
    handleRoute();
});

// Routing
function handleRoute() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    
    if (parts[0] === 'chart' && parts[1]) {
        const profileId = parts[1];
        if (profileManager.getProfile(profileId)) {
            viewChart(profileId, false);
        } else {
            history.replaceState(null, '', '/');
        }
    } else if (parts[0] === 'synastry') {
        showSynastry(false);
    } else {
        // Default to blurbs view
        if (currentView !== 'blurbs') {
            backToBlurbs(false);
        }
    }
}

window.addEventListener('popstate', () => {
    handleRoute();
});

function setupEventListeners() {
    document.getElementById('newProfileBtn').addEventListener('click', showProfileForm);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);
    document.getElementById('cancelProfile').addEventListener('click', hideProfileForm);
    document.getElementById('location').addEventListener('input', handleLocationSearch);
    document.getElementById('synastryBtn').addEventListener('click', showSynastry);
    
    // Blurb creation - now using modal
    document.getElementById('newBlurbBtn').addEventListener('click', showBlurbForm);
}

// Profile UI
function showProfileForm() {
    document.getElementById('profileFormCard').style.display = 'block';
    document.getElementById('profilesList').style.display = 'none';
}

function hideProfileForm() {
    document.getElementById('profileFormCard').style.display = 'none';
    document.getElementById('profilesList').style.display = 'block';
    document.getElementById('profileForm').reset();
    selectedLocationData = null;
    document.getElementById('selectedLocation').innerHTML = '';
}

function loadProfileList() {
    const container = document.getElementById('profilesContainer');
    const profiles = profileManager.profiles;
    
    if (profiles.length === 0) {
        container.innerHTML = '<p class="empty-state">No profiles yet. Create your first one!</p>';
        document.getElementById('blurbsSection').style.display = 'none';
        return;
    }
    
    container.innerHTML = profiles.map(profile => {
        const date = new Date(profile.datetime);
        const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        return `
        <div class="profile-card">
            <h3>${profile.name}</h3>
            <p>${dateStr}</p>
            <p class="location-small">${profile.location.split(',')[0]}</p>
            <div class="profile-actions">
                <button onclick="viewChart('${profile.id}')" class="btn-small btn-secondary">View Chart</button>
                <button onclick="deleteProfile('${profile.id}')" class="btn-small btn-danger">Delete</button>
            </div>
        </div>
    `;
    }).join('');
    
    // Show blurbs section if we have profiles
    document.getElementById('blurbsSection').style.display = 'block';
}

// Auto-generate blurbs for all profiles and all templates
async function autoGenerateAllBlurbs() {
    const profiles = profileManager.profiles;
    if (profiles.length === 0) return;
    
    // Get all active templates
    const activeDefaultBlurbs = DEFAULT_BLURBS.filter(b => !deletedDefaultBlurbIds.includes(b.id));
    const activeCustomBlurbs = customBlurbs.filter(b => !deletedBlurbs.find(d => d.id === b.id));
    const allTemplates = [...activeDefaultBlurbs, ...activeCustomBlurbs];
    
    // Generate blurbs for each profile × template combination
    for (const profile of profiles) {
        // Get chart for this profile
        const response = await fetch('/api/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                datetime: profile.datetime,
                latitude: profile.latitude,
                longitude: profile.longitude,
                timezone: profile.timezone,
                location: profile.location
            })
        });
        
        if (!response.ok) continue;
        
        const chart = await response.json();
        chart.profileName = profile.name;
        chart.profileId = profile.id;
        
        // Generate with each template
        for (const template of allTemplates) {
            // Check if this combination already exists
            const exists = generatedBlurbs.some(gb => 
                gb.profileId === profile.id && 
                gb.blurbTemplate.id === template.id
            );
            
            if (!exists) {
                await generateBlurbForProfile(chart, template);
            }
        }
    }
}

// Generate a single blurb for a profile with a template
async function generateBlurbForProfile(chart, blurbObj) {
    try {
        const response = await fetch('/api/blurb/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chart: chart,
                blurbTemplate: blurbObj.text,
                replacements: blurbObj.replacements || {}
            })
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        
        const blurbData = {
            id: Date.now() + Math.random(), // Ensure unique ID
            text: data.blurb,
            original: blurbObj.text,
            profileName: chart.profileName,
            profileId: chart.profileId,
            blurbTemplate: blurbObj,
            timestamp: new Date().toISOString()
        };
        
        generatedBlurbs.unshift(blurbData);
        localStorage.setItem('generated_blurbs', JSON.stringify(generatedBlurbs));
    } catch (error) {
        console.error('Error generating blurb:', error);
    }
}

// Generate blurbs for a newly added profile
async function generateBlurbsForNewProfile(profile) {
    // Get all active templates
    const activeDefaultBlurbs = DEFAULT_BLURBS.filter(b => !deletedDefaultBlurbIds.includes(b.id));
    const activeCustomBlurbs = customBlurbs.filter(b => !deletedBlurbs.find(d => d.id === b.id));
    const allTemplates = [...activeDefaultBlurbs, ...activeCustomBlurbs];
    
    // Get chart for this profile
    const response = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            datetime: profile.datetime,
            latitude: profile.latitude,
            longitude: profile.longitude,
            timezone: profile.timezone,
            location: profile.location
        })
    });
    
    if (!response.ok) return;
    
    const chart = await response.json();
    chart.profileName = profile.name;
    chart.profileId = profile.id;
    
    // Generate with each template
    for (const template of allTemplates) {
        await generateBlurbForProfile(chart, template);
    }
}

// Generate blurbs for a newly added template across all profiles
async function generateBlurbsForNewTemplate(template) {
    const profiles = profileManager.profiles;
    if (profiles.length === 0) return;
    
    // Generate blurbs for each profile with this template
    for (const profile of profiles) {
        // Get chart for this profile
        const response = await fetch('/api/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                datetime: profile.datetime,
                latitude: profile.latitude,
                longitude: profile.longitude,
                timezone: profile.timezone,
                location: profile.location
            })
        });
        
        if (!response.ok) continue;
        
        const chart = await response.json();
        chart.profileName = profile.name;
        chart.profileId = profile.id;
        
        await generateBlurbForProfile(chart, template);
    }
}

function deleteProfile(id) {
    if (confirm('Are you sure you want to delete this profile?')) {
        const profile = profileManager.getProfile(id);
        const profileName = profile?.name;
        
        // Delete the profile
        profileManager.deleteProfile(id);
        
        // Remove all generated blurbs for this profile
        if (profileName) {
            generatedBlurbs = generatedBlurbs.filter(blurb => blurb.profileId !== id);
            localStorage.setItem('generated_blurbs', JSON.stringify(generatedBlurbs));
            
            // Remove from profile filters
            delete profileFilters[profileName];
        }
        
        // Refresh UI
        loadProfileList();
        refreshGeneratedBlurbs();
        
        // If this was the current chart, hide blurbs section
        if (currentChart?.profileId === id) {
            currentChart = null;
            document.getElementById('blurbsSection').style.display = 'none';
            document.getElementById('chartSection').style.display = 'none';
        }
    }
}

async function handleProfileSubmit(e) {
    e.preventDefault();
    
    if (!selectedLocationData) {
        alert('Please select a location from the search results');
        return;
    }
    
    const profile = {
        name: document.getElementById('profileName').value,
        datetime: `${document.getElementById('date').value}T${document.getElementById('time').value}`,
        latitude: selectedLocationData.lat,
        longitude: selectedLocationData.lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        location: selectedLocationData.name
    };
    
    const newProfile = profileManager.addProfile(profile);
    loadProfileList();
    hideProfileForm();
    
    // Auto-generate blurbs for the new profile
    document.getElementById('loading').style.display = 'block';
    try {
        await generateBlurbsForNewProfile(newProfile);
        refreshGeneratedBlurbs();
    } catch (error) {
        console.error('Error generating blurbs for new profile:', error);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// Location search (same as before)
let selectedLocationData = null;
let searchTimeout = null;

function handleLocationSearch(e) {
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        document.getElementById('locationResults').innerHTML = '';
        return;
    }
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchLocation(query), 500);
}

async function searchLocation(query) {
    const resultsDiv = document.getElementById('locationResults');
    resultsDiv.innerHTML = '<div class="loading-small">Searching...</div>';
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        
        if (data.length === 0) {
            resultsDiv.innerHTML = '<div class="no-results">No locations found</div>';
            return;
        }
        
        resultsDiv.innerHTML = data.map(location => `
            <div class="location-item" data-location='${JSON.stringify({
                name: location.display_name,
                lat: parseFloat(location.lat),
                lon: parseFloat(location.lon)
            })}'>
                <strong>${location.display_name.split(',')[0]}</strong>
                <br><small>${location.display_name}</small>
            </div>
        `).join('');
        
        document.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', () => selectLocation(item));
        });
    } catch (error) {
        resultsDiv.innerHTML = '<div class="error">Error searching locations</div>';
    }
}

function selectLocation(item) {
    selectedLocationData = JSON.parse(item.dataset.location);
    document.getElementById('selectedLocation').innerHTML = `
        <div class="selected-info">
            <strong>📍 Selected:</strong> ${selectedLocationData.name}<br>
            <small>Lat: ${selectedLocationData.lat.toFixed(4)}, Lon: ${selectedLocationData.lon.toFixed(4)}</small>
        </div>
    `;
    document.getElementById('locationResults').innerHTML = '';
    document.getElementById('location').value = selectedLocationData.name.split(',')[0];
}

// Blurbs UI
function loadBlurbList() {
    // Switch between natal and synastry template databases
    let activeDefaults, activeCustom;
    if (synastryBlurbMode) {
        activeDefaults = DEFAULT_SYNASTRY_BLURBS.filter(b => !deletedDefaultSynastryBlurbIds.includes(b.id));
        activeCustom = customSynastryBlurbs.filter(b => !deletedSynastryBlurbs.find(d => d.id === b.id));
    } else {
        activeDefaults = DEFAULT_BLURBS.filter(b => !deletedDefaultBlurbIds.includes(b.id));
        activeCustom = customBlurbs.filter(b => !deletedBlurbs.find(d => d.id === b.id));
    }
    const allBlurbs = [...activeDefaults, ...activeCustom];
    const container = document.getElementById('blurbTemplates');
    
    container.innerHTML = allBlurbs.map((blurb, index) => {
        const isCustom = blurb.createdAt !== undefined;
        const displayText = blurb.text.length > 360 ? blurb.text.substring(0, 360) + '...' : blurb.text;
        const filterState = templateFilters[blurb.id] || null;
        
        let filterClass = 'blurb-template-clickable';
        let filterLabel = '';
        
        if (filterState === 'exclude') {
            filterClass += ' filter-exclude';
            filterLabel = '<span class="filter-indicator">🚫 Hidden</span>';
        } else if (filterState === 'include') {
            filterClass += ' filter-include';
            filterLabel = '<span class="filter-indicator">✓ Only</span>';
        }
        
        return `
            <div class="${filterClass}" data-blurb-id="${blurb.id}" data-blurb-index="${index}">
                <p class="blurb-text">${displayText}${filterLabel}</p>
                <div class="blurb-meta">
                    <span class="blurb-author">by ${blurb.author}</span>
                    <button class="btn-delete" data-blurb-id="${blurb.id}" data-is-custom="${isCustom}">Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add click listeners for template filtering
    document.querySelectorAll('.blurb-template-clickable').forEach((el) => {
        const blurbId = parseInt(el.dataset.blurbId);
        el.addEventListener('click', (e) => {
            // Don't toggle filter if clicking delete button
            if (!e.target.classList.contains('btn-delete')) {
                toggleTemplateFilter(blurbId);
            }
        });
    });
    
    // Add delete button listeners
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const blurbId = parseInt(btn.dataset.blurbId);
            const isCustom = btn.dataset.isCustom === 'true';
            deleteBlurb(blurbId, isCustom);
        });
    });
}

// Toggle template filter: null -> exclude -> include -> null
function toggleTemplateFilter(templateId) {
    const currentState = templateFilters[templateId] || null;
    
    if (currentState === null) {
        templateFilters[templateId] = 'exclude';
    } else if (currentState === 'exclude') {
        templateFilters[templateId] = 'include';
    } else {
        templateFilters[templateId] = null;
    }
    
    loadBlurbList(); // Refresh template display
    refreshGeneratedBlurbs(); // Refresh filtered blurbs
}

function copyBlurb(btn) {
    const text = btn.parentElement.querySelector('.blurb-result').textContent;
    navigator.clipboard.writeText(text);
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
}

// Delete & Bin functionality
function deleteBlurb(blurbId, isCustom) {
    if (confirm('Move this blurb to the bin?')) {
        if (isCustom) {
            const blurb = customBlurbs.find(b => b.id === blurbId);
            if (blurb) {
                deletedBlurbs.push(blurb);
                customBlurbs = customBlurbs.filter(b => b.id !== blurbId);
                localStorage.setItem('custom_blurbs', JSON.stringify(customBlurbs));
                localStorage.setItem('deleted_blurbs', JSON.stringify(deletedBlurbs));
            }
        } else {
            // Default blurb - just track its ID
            if (!deletedDefaultBlurbIds.includes(blurbId)) {
                deletedDefaultBlurbIds.push(blurbId);
                localStorage.setItem('deleted_default_blurb_ids', JSON.stringify(deletedDefaultBlurbIds));
            }
        }
        
        // Remove all generated blurbs for this template
        generatedBlurbs = generatedBlurbs.filter(gb => gb.blurbTemplate?.id !== blurbId);
        localStorage.setItem('generated_blurbs', JSON.stringify(generatedBlurbs));
        
        loadBlurbList();
        refreshGeneratedBlurbs();
    }
}

function showBin() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'binModal';
    
    const deletedDefaults = DEFAULT_BLURBS.filter(b => deletedDefaultBlurbIds.includes(b.id));
    const allDeleted = [...deletedDefaults, ...deletedBlurbs];
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🗑️ Deleted Blurbs</h3>
                <button class="close-modal" onclick="closeBin()">×</button>
            </div>
            <div class="modal-body">
                ${allDeleted.length === 0 ? '<p class="empty-message">Bin is empty</p>' : ''}
                ${allDeleted.map(blurb => {
                    const isCustom = blurb.createdAt !== undefined;
                    return `
                        <div class="bin-item">
                            <p class="blurb-text">${blurb.text}</p>
                            <div class="bin-actions">
                                <small>by ${blurb.author}</small>
                                <button class="btn-small" onclick="restoreBlurb(${blurb.id}, ${isCustom})">Restore</button>
                                <button class="btn-small btn-danger" onclick="permanentlyDeleteBlurb(${blurb.id}, ${isCustom})">Permanent Delete</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeBin() {
    const modal = document.getElementById('binModal');
    if (modal) modal.remove();
}

function restoreBlurb(blurbId, isCustom) {
    if (isCustom) {
        const blurb = deletedBlurbs.find(b => b.id === blurbId);
        if (blurb) {
            customBlurbs.push(blurb);
            deletedBlurbs = deletedBlurbs.filter(b => b.id !== blurbId);
            localStorage.setItem('custom_blurbs', JSON.stringify(customBlurbs));
            localStorage.setItem('deleted_blurbs', JSON.stringify(deletedBlurbs));
        }
    } else {
        deletedDefaultBlurbIds = deletedDefaultBlurbIds.filter(id => id !== blurbId);
        localStorage.setItem('deleted_default_blurb_ids', JSON.stringify(deletedDefaultBlurbIds));
    }
    loadBlurbList();
    closeBin();
    showBin(); // Refresh bin view
}

function permanentlyDeleteBlurb(blurbId, isCustom) {
    if (confirm('Permanently delete this blurb? This cannot be undone.')) {
        if (isCustom) {
            deletedBlurbs = deletedBlurbs.filter(b => b.id !== blurbId);
            localStorage.setItem('deleted_blurbs', JSON.stringify(deletedBlurbs));
        } else {
            // For default blurbs, keeping them in the deleted list is the "permanent" delete
            // since we can't actually delete them from DEFAULT_BLURBS constant
        }
        closeBin();
        showBin(); // Refresh bin view
    }
}

// Profile filtering
function refreshGeneratedBlurbs() {
    const container = document.getElementById('generatedBlurbs');
    const blurbsList = document.getElementById('blurbsList');
    if (!container || !blurbsList) return;
    
    // Use synastry blurbs when in synastry blurb mode
    const sourceBlurbs = synastryBlurbMode ? generatedSynastryBlurbs : generatedBlurbs;
    
    // Apply profile filters first
    let filteredBlurbs = sourceBlurbs;
    const activeProfileFilters = Object.entries(profileFilters).filter(([_, state]) => state !== null);
    
    if (activeProfileFilters.length > 0) {
        filteredBlurbs = filteredBlurbs.filter(blurb => {
            const filterState = profileFilters[blurb.profileName];
            if (filterState === 'include') return true;
            if (filterState === 'exclude') return false;
            // null or undefined - show if no other profile is set to 'include'
            const hasIncludeFilter = Object.values(profileFilters).some(s => s === 'include');
            return !hasIncludeFilter;
        });
    }
    
    // Apply template filters
    const activeTemplateFilters = Object.entries(templateFilters).filter(([_, state]) => state !== null);
    
    if (activeTemplateFilters.length > 0) {
        filteredBlurbs = filteredBlurbs.filter(blurb => {
            const templateId = blurb.blurbTemplate?.id;
            const filterState = templateFilters[templateId];
            if (filterState === 'include') return true;
            if (filterState === 'exclude') return false;
            // null or undefined - show if no other template is set to 'include'
            const hasIncludeFilter = Object.values(templateFilters).some(s => s === 'include');
            return !hasIncludeFilter;
        });
    }
    
    blurbsList.innerHTML = filteredBlurbs.map(blurbData => `
        <div class="generated-blurb" data-blurb-id="${blurbData.id}">
            <div class="blurb-header">
                <span class="profile-label">${blurbData.profileName}</span>
                <button class="btn-edit" data-blurb-id="${blurbData.id}">Edit</button>
            </div>
            <p class="blurb-result">${blurbData.text}</p>
            <p class="blurb-original"><small>From: ${blurbData.original}</small></p>
            <button class="btn-copy" data-blurb-id="${blurbData.id}">Copy</button>
        </div>
    `).join('');
    
    // Show message if all blurbs are filtered out
    if (sourceBlurbs.length > 0 && filteredBlurbs.length === 0) {
        blurbsList.innerHTML = '<p class="filter-message">All blurbs are filtered out. Adjust filters to see blurbs.</p>';
    }
    
    // Add event listeners for edit and copy buttons
    blurbsList.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const blurbId = btn.dataset.blurbId;
            openEditModal(isNaN(blurbId) ? blurbId : parseFloat(blurbId));
        });
    });
    
    blurbsList.querySelectorAll('.btn-copy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const blurbId = btn.dataset.blurbId;
            copyBlurbText(isNaN(blurbId) ? blurbId : parseFloat(blurbId), e.target);
        });
    });
    
    // Show/hide the container based on whether we're in a blurbs section or have blurbs
    const blurbsSection = document.getElementById('blurbsSection');
    const shouldShow = (blurbsSection && blurbsSection.style.display === 'block') || sourceBlurbs.length > 0;
    
    container.style.display = (shouldShow && sourceBlurbs.length > 0) ? 'block' : 'none';
    
    // Update filter buttons
    updateFilterButtons();
}

function updateFilterButtons() {
    const container = document.getElementById('profileFilters');
    if (!container) return;

    if (synastryBlurbMode) {
        // Two dropdowns to swap the active synastry pair
        const profiles = profileManager.profiles;
        if (profiles.length < 2) {
            container.style.display = 'none';
            return;
        }

        const p1Id = selectedSynastryProfiles.profile1?.id || '';
        const p2Id = selectedSynastryProfiles.profile2?.id || '';

        const options = profiles.map(p =>
            `<option value="${p.id}"${p.id === p1Id ? ' selected' : ''}>${p.name}</option>`
        ).join('');
        const options2 = profiles.map(p =>
            `<option value="${p.id}"${p.id === p2Id ? ' selected' : ''}>${p.name}</option>`
        ).join('');

        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '8px';
        container.innerHTML = `
            <select id="synPairSelect1" class="syn-pair-select">${options}</select>
            <span class="syn-pair-sep">&amp;</span>
            <select id="synPairSelect2" class="syn-pair-select">${options2}</select>
        `;

        const onChange = async () => {
            const id1 = document.getElementById('synPairSelect1').value;
            const id2 = document.getElementById('synPairSelect2').value;
            if (id1 === id2) return;
            await selectSynastryPair(id1, id2);
        };

        document.getElementById('synPairSelect1').addEventListener('change', onChange);
        document.getElementById('synPairSelect2').addEventListener('change', onChange);
        return;
    }

    const sourceBlurbs = generatedBlurbs;
    const uniqueProfiles = [...new Set(sourceBlurbs.map(b => b.profileName))].sort();

    // Only hide if there are no generated blurbs at all
    if (uniqueProfiles.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    // Show filters even with just 1 profile (useful to see what profile generated the blurbs)
    container.style.display = 'flex';
    container.innerHTML = uniqueProfiles.map(profileName => {
        const state = profileFilters[profileName] || null;
        let className = 'filter-btn';
        let label = profileName;

        if (state === 'exclude') {
            className += ' filter-exclude';
            label = '🚫 ' + profileName;
        } else if (state === 'include') {
            className += ' filter-include';
            label = '✓ ' + profileName;
        }

        return `<button class="${className}" data-profile-name="${profileName}">${label}</button>`;
    }).join('');

    // Add event listeners to filter buttons
    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            toggleProfileFilter(btn.dataset.profileName);
        });
    });
}

// Switch the active synastry pair from the blurbs page dropdowns
async function selectSynastryPair(id1, id2) {
    const loadProfile = async (id) => {
        const profile = profileManager.getProfile(id);
        if (!profile.chart) {
            const response = await fetch('/api/chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    datetime: profile.datetime,
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                    timezone: profile.timezone,
                    location: profile.location
                })
            });
            profile.chart = await response.json();
            profileManager.profiles = profileManager.profiles.map(p =>
                p.id === profile.id ? profile : p
            );
        }
        return profile;
    };

    document.getElementById('loading').style.display = 'block';
    try {
        const [p1, p2] = await Promise.all([loadProfile(id1), loadProfile(id2)]);
        selectedSynastryProfiles = { profile1: p1, profile2: p2 };
        // Re-render synastry aspects if the synastry section is visible
        if (document.getElementById('synastrySection').style.display !== 'none') {
            renderSynastryProfileCards();
        }
        await generateSynastryReport();
    } catch (error) {
        alert('Error loading charts: ' + error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}


function toggleProfileFilter(profileName) {
    const currentState = profileFilters[profileName] || null;
    
    // Cycle: null -> exclude -> include -> null
    if (currentState === null) {
        profileFilters[profileName] = 'exclude';
    } else if (currentState === 'exclude') {
        profileFilters[profileName] = 'include';
    } else {
        profileFilters[profileName] = null;
    }
    
    refreshGeneratedBlurbs();
}

function copyBlurbText(blurbId, button) {
    const blurb = generatedBlurbs.find(b => b.id === blurbId)
        || generatedSynastryBlurbs.find(b => b.id === blurbId);
    if (blurb) {
        navigator.clipboard.writeText(blurb.text);
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 2000);
    }
}

// Edit modal functionality
function openEditModal(blurbId) {
    const blurbData = generatedBlurbs.find(b => b.id === blurbId)
        || generatedSynastryBlurbs.find(b => b.id === blurbId);
    if (!blurbData) return;
    
    modalCounter++;
    const modalId = `editModal_${modalCounter}`;
    const offset = (modalCounter - 1) * 30;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = modalId;
    modal.style.zIndex = 1000 + modalCounter;
    
    const blurbTemplate = blurbData.blurbTemplate;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Blurb</h3>
                <button class="close-modal" onclick="closeEditModal('${modalId}')">×</button>
            </div>
            <div class="modal-body">
                <form id="editForm_${modalCounter}" onsubmit="event.preventDefault(); saveEditedBlurb('${modalId}', ${modalCounter})">
                    <div class="form-group">
                        <label>Blurb Template:</label>
                        <textarea id="editText_${modalCounter}" rows="4" required>${blurbTemplate.text}</textarea>
                    </div>
                    <div id="editReplacements_${modalCounter}">
                        ${generateReplacementFields(blurbTemplate, modalCounter)}
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-submit">Save as New</button>
                        <button type="button" class="btn btn-secondary" onclick="closeEditModal('${modalId}')">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add listener to close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal(modalId);
        }
    });
}

function generateReplacementFields(blurbTemplate, counter) {
    if (!blurbTemplate.replacements || !blurbTemplate.text) return '';
    
    // Extract @variables from text in order
    const matches = blurbTemplate.text.match(/@\w+/g) || [];
    
    // Build lookup for replacement values
    const replacementLookup = {};
    Object.entries(blurbTemplate.replacements).forEach(([varName, values]) => {
        const isMultiple = Array.isArray(values[0]);
        replacementLookup[varName] = {
            values: isMultiple ? values : [values],
            currentIndex: 0
        };
    });
    
    // Generate fields in text order
    return matches.map((match, idx) => {
        const varName = match.substring(1);
        const isOrdinalHouse = varName.match(/[A-Za-z]+(H|house)th$/);
        
        // Get the appropriate values for this occurrence
        const lookup = replacementLookup[varName];
        if (!lookup) return '';
        
        const valArray = lookup.values[lookup.currentIndex] || lookup.values[0];
        lookup.currentIndex++;
        
        const joinedValues = Array.isArray(valArray) ? valArray.join(', ') : valArray;
        
        return `
        <div class="replacement-group">
            <label>@${varName}:</label>
            <textarea 
                id="editReplace_${counter}_${idx}" 
                rows="2" 
                ${isOrdinalHouse ? 'readonly style="background-color: #f0f0f0; cursor: not-allowed;"' : 'required'}
            >${joinedValues}</textarea>
        </div>
        `;
    }).join('');
}

function closeEditModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}

function saveEditedBlurb(modalId, formCounter) {
    const text = document.getElementById(`editText_${formCounter}`).value;
    const replacements = {};
    
    // Extract all @variables in order
    const matches = text.match(/@\w+/g) || [];
    
    // Build replacements object with each @variable as a key, storing arrays of values
    for (let idx = 0; idx < matches.length; idx++) {
        const match = matches[idx];
        const varName = match.substring(1);
        const input = document.getElementById(`editReplace_${formCounter}_${idx}`);
        
        if (input) {
            const values = input.value.split(',').map(v => v.trim());
            const isLifePath = varName === 'LP' || varName === 'lifepath';
            const isOrdinalHouse = varName.match(/[A-Za-z]+(H|house)th$/);
            
            // Skip validation for ordinal house placeholders (they're fixed)
            if (!isOrdinalHouse) {
                if (isLifePath && (values.length < 9 || values.length > 12)) {
                    alert(`@${varName} needs 9-12 comma-separated values (1-9, optionally 11, 22, 33)`);
                    return;
                } else if (!isLifePath && values.length !== 12) {
                    alert(`@${varName} needs exactly 12 comma-separated values`);
                    return;
                }
            }
            
            // Store each occurrence's values - if varName already exists, store as array
            if (!replacements[varName]) {
                replacements[varName] = values;
            } else {
                // Convert to array of arrays if not already
                if (!Array.isArray(replacements[varName][0])) {
                    replacements[varName] = [replacements[varName]];
                }
                replacements[varName].push(values);
            }
        }
    }
    
    const newBlurb = {
        id: Date.now(),
        text: text,
        author: 'You (edited)',
        replacements: replacements,
        createdAt: new Date().toISOString()
    };
    
    customBlurbs.push(newBlurb);
    localStorage.setItem('custom_blurbs', JSON.stringify(customBlurbs));
    
    loadBlurbList();
    closeEditModal(modalId);
    
    // Auto-generate blurbs for all profiles with this edited template
    document.getElementById('loading').style.display = 'block';
    generateBlurbsForNewTemplate(newBlurb).then(() => {
        refreshGeneratedBlurbs();
        document.getElementById('loading').style.display = 'none';
        alert('Blurb saved and generated for all profiles!');
    }).catch(error => {
        console.error('Error generating blurbs for edited template:', error);
        document.getElementById('loading').style.display = 'none';
        alert('Blurb saved, but there was an error generating variations.');
    });
}

// Custom blurbs
function showBlurbForm() {
    modalCounter++;
    const modalId = `createModal_${modalCounter}`;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = modalId;
    modal.style.zIndex = 1000 + modalCounter;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create Custom Blurb</h3>
                <button class="close-modal" onclick="closeCreateModal('${modalId}')">×</button>
            </div>
            <div class="modal-body">
                <form id="createForm_${modalCounter}" onsubmit="event.preventDefault(); handleCreateBlurbSubmit('${modalId}', ${modalCounter})">
                    <div class="form-group">
                        <label for="createBlurbText_${modalCounter}">Blurb Template:</label>
                        <textarea id="createBlurbText_${modalCounter}" rows="4" placeholder="Use @sun, @moon, @rising, @venus, @mars, @mercury, @jupiter, @saturn, @mc, @sunH, @moonhouse, etc." required></textarea>
                        <small>Signs: @sun, @moon, @mercury, @venus, @mars, @jupiter, @saturn, @uranus, @neptune, @pluto, @chiron, @ceres, @pallas, @juno, @vesta, @lilith, @pholus, @eris, @northnode (@NN), @rising (@ascendant), @mc</small><br>
                        <small>Houses: @sunhouse (@sunH), @moonhouse (@moonH), @plutoH, @northnodeH, etc.</small><br>
                        <small>Numerology: @LP (@lifepath) - Life Path number 1-9, 11, 22, 33 (11, 22 & 33 are optional)</small>
                    </div>
                    <div id="createReplacements_${modalCounter}"></div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-submit">Save Blurb</button>
                        <button type="button" class="btn btn-secondary" onclick="closeCreateModal('${modalId}')">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add input listener for dynamic replacement fields
    const textarea = document.getElementById(`createBlurbText_${modalCounter}`);
    textarea.addEventListener('input', () => updateCreateReplacementFields(modalCounter));
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCreateModal(modalId);
        }
    });
}

function closeCreateModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}

function updateCreateReplacementFields(counter) {
    const text = document.getElementById(`createBlurbText_${counter}`).value;
    const replacementsContainer = document.getElementById(`createReplacements_${counter}`);
    
    // Extract all @variable placeholders in order, keeping duplicates
    const matches = text.match(/@\w+/g) || [];
    
    // Generate input fields for each occurrence in order
    replacementsContainer.innerHTML = matches.map((match, idx) => {
        const varName = match.substring(1);
        const isLifePath = varName === 'LP' || varName === 'lifepath';
        // Check if it's an ordinal house placeholder (ends with "Hth" or "houseth")
        const isOrdinalHouse = varName.match(/[A-Za-z]+(H|house)th$/);
        const isHouse = !isOrdinalHouse && varName.match(/[A-Za-z]+(H|house)$/);
        
        let hint = 'Aries-Pisces';
        let defaultValues = 'Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces';
        let isReadonly = false;
        
        if (isOrdinalHouse) {
            hint = 'Ordinal houses (fixed)';
            defaultValues = '1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th, 11th, 12th';
            isReadonly = true;
        } else if (isLifePath) {
            hint = 'Life Path 1-9, optionally 11, 22, 33';
            defaultValues = '1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33';
        } else if (isHouse) {
            hint = 'Houses 1-12';
            defaultValues = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12';
        }
        
        return `
        <div class="replacement-group">
            <label for="createReplace_${counter}_${idx}">
                <strong>${match}</strong> replacements
                <small>(${isOrdinalHouse ? 'Fixed ordinal values' : (isLifePath ? '9-12' : '12')} ${isOrdinalHouse ? '' : 'comma-separated values for '}${hint})</small>
            </label>
            <textarea 
                id="createReplace_${counter}_${idx}" 
                rows="2" 
                placeholder="${defaultValues}"
                ${isReadonly ? 'readonly style="background-color: #f0f0f0; cursor: not-allowed;"' : 'required'}
            >${defaultValues}</textarea>
        </div>
        `;
    }).join('');
}

function handleCreateBlurbSubmit(modalId, formCounter) {
    const text = document.getElementById(`createBlurbText_${formCounter}`).value;
    const replacements = {};
    
    // Extract all @variables in order
    const matches = text.match(/@\w+/g) || [];
    
    // Build replacements object with each @variable as a key, storing arrays of values
    for (let idx = 0; idx < matches.length; idx++) {
        const match = matches[idx];
        const varName = match.substring(1);
        const input = document.getElementById(`createReplace_${formCounter}_${idx}`);
        
        if (input) {
            const values = input.value.split(',').map(v => v.trim());
            const isLifePath = varName === 'LP' || varName === 'lifepath';
            const isOrdinalHouse = varName.match(/[A-Za-z]+(H|house)th$/);
            
            // Skip validation for ordinal house placeholders (they're fixed)
            if (!isOrdinalHouse) {
                if (isLifePath && (values.length < 9 || values.length > 12)) {
                    alert(`@${varName} needs 9-12 comma-separated values (1-9, optionally 11, 22, 33)`);
                    return;
                } else if (!isLifePath && values.length !== 12) {
                    alert(`@${varName} needs exactly 12 comma-separated values`);
                    return;
                }
            }
            
            // Store each occurrence's values - if varName already exists, store as array
            if (!replacements[varName]) {
                replacements[varName] = values;
            } else {
                // Convert to array of arrays if not already
                if (!Array.isArray(replacements[varName][0])) {
                    replacements[varName] = [replacements[varName]];
                }
                replacements[varName].push(values);
            }
        }
    }
    
    const newBlurb = {
        id: Date.now(),
        text: text,
        author: 'You',
        replacements: replacements,
        createdAt: new Date().toISOString()
    };
    
    customBlurbs.push(newBlurb);
    localStorage.setItem('custom_blurbs', JSON.stringify(customBlurbs));
    
    loadBlurbList();
    closeCreateModal(modalId);
    
    // Auto-generate blurbs for all profiles with this new template
    document.getElementById('loading').style.display = 'block';
    generateBlurbsForNewTemplate(newBlurb).then(() => {
        refreshGeneratedBlurbs();
        document.getElementById('loading').style.display = 'none';
    }).catch(error => {
        console.error('Error generating blurbs for new template:', error);
        document.getElementById('loading').style.display = 'none';
    });
}

// Chart View Functions
async function viewChart(id, updateUrl = true) {
    const profile = profileManager.getProfile(id);
    if (!profile) return;
    
    document.getElementById('loading').style.display = 'block';
    
    try {
        const response = await fetch('/api/chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                datetime: profile.datetime,
                latitude: profile.latitude,
                longitude: profile.longitude,
                timezone: profile.timezone,
                location: profile.location
            })
        });
        
        if (!response.ok) throw new Error('Chart calculation failed');
        
        currentChart = await response.json();
        currentChart.profileName = profile.name;
        currentChart.profileId = profile.id;
        
        // Show chart section, hide blurbs section
        document.getElementById('blurbsSection').style.display = 'none';
        document.getElementById('chartSection').style.display = 'block';
        currentView = 'chart';
        
        // Update URL
        if (updateUrl) {
            history.pushState({ view: 'chart', profileId: id }, '', `/chart/${id}`);
        }
        
        // Update chart display
        displayChart(currentChart);
        updateChartProfileSelector(profile.id);
        
        document.getElementById('chartSection').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        alert('Error calculating chart: ' + error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

function convertChartDataForAstroChart(chart) {
    // Convert our chart data format to AstroChart library format
    const astroData = {
        planets: {},
        cusps: []
    };
    
    // Map planet names to AstroChart format and extract longitudes
    const planetMapping = {
        'SUN': 'Sun',
        'MOON': 'Moon',
        'MERCURY': 'Mercury',
        'VENUS': 'Venus',
        'MARS': 'Mars',
        'JUPITER': 'Jupiter',
        'SATURN': 'Saturn',
        'URANUS': 'Uranus',
        'NEPTUNE': 'Neptune',
        'PLUTO': 'Pluto',
        'N. NODE': 'NNode'
    };
    
    // Add planets
    for (const [ourName, astroName] of Object.entries(planetMapping)) {
        if (chart.planets?.[ourName]?.longitude !== undefined) {
            astroData.planets[astroName] = [chart.planets[ourName].longitude];
        }
    }
    
    // Add house cusps
    if (chart.houses?.cusps) {
        astroData.cusps = chart.houses.cusps.map(cusp => cusp.longitude);
    }
    
    return astroData;
}

function displayChart(chart) {
    const chartDisplay = document.getElementById('chartDisplay');
    document.getElementById('chartProfileName').textContent = chart.profileName;
    
    // Render birth chart wheel using AstroChart library
    const chartWheel = document.getElementById('chartWheel');
    chartWheel.innerHTML = ''; // Clear previous chart
    
    try {
        const astroData = convertChartDataForAstroChart(chart);
        console.log('AstroChart data:', astroData); // Debug
        console.log('Astrochart object:', typeof astrochart, window.astrochart); // Debug
        
        // Configure aspects to show
        const settings = {
            ASPECTS: {
                conjunction: { enabled: true, angle: 0, orb: 8 },
                opposition: { enabled: true, angle: 180, orb: 8 },
                trine: { enabled: true, angle: 120, orb: 8 },
                square: { enabled: true, angle: 90, orb: 8 },
                sextile: { enabled: true, angle: 60, orb: 6 },
                quincunx: { enabled: true, angle: 150, orb: 3 }
            }
        };
        
        const astroChart = new astrochart.Chart('chartWheel', 600, 600, settings);
        astroChart.radix(astroData);
    } catch (error) {
        console.error('Error rendering chart wheel:', error);
        chartWheel.innerHTML = '<p style="text-align: center; color: #666;">Chart wheel unavailable: ' + error.message + '</p>';
    }
    
    const planets = [
        { name: 'Sun', key: 'SUN' },
        { name: 'Moon', key: 'MOON' },
        { name: 'Mercury', key: 'MERCURY' },
        { name: 'Venus', key: 'VENUS' },
        { name: 'Mars', key: 'MARS' },
        { name: 'Jupiter', key: 'JUPITER' },
        { name: 'Saturn', key: 'SATURN' },
        { name: 'Uranus', key: 'URANUS' },
        { name: 'Neptune', key: 'NEPTUNE' },
        { name: 'Pluto', key: 'PLUTO' },
        { name: 'Chiron', key: 'CHIRON' },
        { name: 'Ceres', key: 'CERES' },
        { name: 'Pallas', key: 'PALLAS' },
        { name: 'Juno', key: 'JUNO' },
        { name: 'Vesta', key: 'VESTA' },
        { name: 'Lilith', key: 'LILITH' },
        { name: 'Pholus', key: 'PHOLUS' },
        { name: 'Eris', key: 'ERIS' },
        { name: 'North Node', key: 'N. NODE' }
    ];
    
    let html = '<table class="chart-table"><thead><tr><th>Planet</th><th>Sign</th><th>House</th></tr></thead><tbody>';
    
    planets.forEach(planet => {
        const data = chart.planets?.[planet.key];
        if (data) {
            const sign = data.zodiac?.sign || '—';
            const house = data.house || '—';
            html += `<tr><td>${planet.name}</td><td>${sign}</td><td>${house}</td></tr>`;
        }
    });
    
    // Add Ascendant and MC
    const ascendant = chart.houses?.angles?.ascendant?.zodiac?.sign || '—';
    const mc = chart.houses?.angles?.mc?.zodiac?.sign || '—';
    html += `<tr><td><strong>Ascendant</strong></td><td>${ascendant}</td><td>—</td></tr>`;
    html += `<tr><td><strong>MC (Midheaven)</strong></td><td>${mc}</td><td>—</td></tr>`;
    
    // Add Life Path if available
    if (chart.lifePath) {
        html += `<tr><td><strong>Life Path</strong></td><td colspan="2">${chart.lifePath}</td></tr>`;
    }
    
    html += '</tbody></table>';
    
    chartDisplay.innerHTML = html;
    
    // Display natal aspects
    displayNatalAspects(chart);
}

function updateChartProfileSelector(currentProfileId) {
    const selector = document.getElementById('chartProfileSelector');
    const profiles = profileManager.profiles;
    
    selector.innerHTML = profiles.map(profile => `
        <option value="${profile.id}" ${profile.id === currentProfileId ? 'selected' : ''}>
            ${profile.name}
        </option>
    `).join('');
    
    // Add change listener
    selector.onchange = (e) => {
        viewChart(e.target.value);
    };
}

function backToBlurbs(updateUrl = true) {
    document.getElementById('chartSection').style.display = 'none';
    document.getElementById('synastrySection').style.display = 'none';
    document.getElementById('blurbsSection').style.display = 'block';
    currentView = 'blurbs';
    
    // Exit synastry blurb mode
    synastryBlurbMode = false;
    currentSynastryAspects = [];
    generatedSynastryBlurbs = [];
    document.getElementById('blurbSectionTitle').textContent = 'Blurb Templates';
    
    // Update URL
    if (updateUrl) {
        history.pushState({ view: 'blurbs' }, '', '/');
    }
    
    // Clear filters when navigating away
    natalKeywordFilters.clear();
    synastryKeywordFilters.clear();
    
    loadBlurbList();
    refreshGeneratedBlurbs();
    document.getElementById('blurbsSection').scrollIntoView({ behavior: 'smooth' });
}

// Synastry Functions
function showSynastry(updateUrl = true) {
    currentView = 'synastry';
    selectedSynastryProfiles = { profile1: null, profile2: null };
    document.getElementById('blurbsSection').style.display = 'none';
    document.getElementById('chartSection').style.display = 'none';
    document.getElementById('synastrySection').style.display = 'block';
    document.getElementById('synastryResults').style.display = 'none';
    
    // Update URL
    if (updateUrl) {
        history.pushState({ view: 'synastry' }, '', '/synastry');
    }
    
    renderSynastryProfileCards();
}

function renderSynastryProfileCards() {
    const container = document.getElementById('synastryProfileSelector');
    const profiles = profileManager.profiles;
    
    if (profiles.length < 2) {
        container.innerHTML = '<p class="empty-state">You need at least 2 profiles to generate a synastry report</p>';
        return;
    }
    
    container.innerHTML = profiles.map(profile => {
        const isProfile1 = selectedSynastryProfiles.profile1?.id === profile.id;
        const isProfile2 = selectedSynastryProfiles.profile2?.id === profile.id;
        const selectedClass = isProfile1 ? 'synastry-selected-1' : isProfile2 ? 'synastry-selected-2' : '';
        const date = new Date(profile.datetime);
        const dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        
        return `
            <div class="profile-card ${selectedClass}" data-profile-id="${profile.id}">
                <h3>${profile.name}</h3>
                <p>${dateStr}</p>
                <p class="location-small">${profile.location.split(',')[0]}</p>
            </div>
        `;
    }).join('');
    
    // Add click event listeners to profile cards
    container.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('click', () => {
            const profileId = card.dataset.profileId;
            toggleSynastryProfile(profileId);
        });
    });
}

async function toggleSynastryProfile(id) {
    const profile = profileManager.getProfile(id);
    
    // Ensure profile has chart data
    if (!profile.chart) {
        document.getElementById('loading').style.display = 'block';
        try {
            const response = await fetch('/api/chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    datetime: profile.datetime,
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                    timezone: profile.timezone,
                    location: profile.location
                })
            });
            profile.chart = await response.json();
            profileManager.profiles = profileManager.profiles.map(p => 
                p.id === profile.id ? profile : p
            );
        } catch (error) {
            alert('Error loading chart: ' + error.message);
            document.getElementById('loading').style.display = 'none';
            return;
        }
        document.getElementById('loading').style.display = 'none';
    }
    
    if (!selectedSynastryProfiles.profile1) {
        selectedSynastryProfiles.profile1 = profile;
    } else if (!selectedSynastryProfiles.profile2 && profile.id !== selectedSynastryProfiles.profile1.id) {
        selectedSynastryProfiles.profile2 = profile;
        await generateSynastryReport();
    } else {
        // Reset and start over
        selectedSynastryProfiles = { profile1: profile, profile2: null };
        document.getElementById('synastryResults').style.display = 'none';
    }
    
    renderSynastryProfileCards();
}

// Truncate description to at most 4 sentences
function truncateDescription(text) {
    const match = text.match(/([^.!]+[.!]){0,4}/);
    return match ? match[0].trim() : text;
}

// Shared aspect rendering utilities
function renderAspectCards(aspects, keywordFilters, keywordToggleFn, options = {}) {
    const { showProfileNames = false } = options;
    
    return aspects.map((asp, i) => {
        const keywordList = asp.keywords ? asp.keywords.split(',').map(k => {
            const trimmed = k.trim();
            return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        }) : [];
        
        const planetHeader = showProfileNames 
            ? `${asp.planet1} (${asp.profile1Name}) ${asp.aspectType.toLowerCase()} ${asp.planet2} (${asp.profile2Name})`
            : `${asp.planet1} ${asp.aspectType.toLowerCase()} ${asp.planet2}`;
        
        const description = shorterDescriptions ? truncateDescription(asp.description) : asp.description;
        
        return `
            <div class="generated-blurb">
                <div class="blurb-header">
                    <h4>${i + 1}. ${planetHeader}</h4>
                    <small>Angle: ${asp.angle}° | Orb: ${asp.orb}°</small>
                </div>
                <p class="blurb-result">${description}</p>
                ${keywordList.length > 0 ? `
                    <div style="margin-top: 10px;">
                        <strong>KEYWORDS:</strong>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                            ${keywordList.map(keyword => {
                                const isActive = Array.from(keywordFilters).some(f => f.toLowerCase() === keyword.toLowerCase());
                                return `<div class="btn-small btn-secondary ${isActive ? 'keyword-active' : ''}" 
                                    onclick="${keywordToggleFn}('${keyword.replace(/'/g, "\\'")}')"
                                    style="cursor: pointer;">
                                    ${keyword}
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function renderAspectSection(allAspects, keywordFilters, keywordToggleFn, options = {}) {
    const { title = '', showProfileNames = false } = options;
    
    // Apply keyword filters
    let aspects = allAspects;
    if (keywordFilters.size > 0) {
        aspects = allAspects.filter(asp => {
            if (!asp.keywords) return false;
            const aspKeywords = asp.keywords.toLowerCase().split(',').map(k => k.trim());
            return Array.from(keywordFilters).some(filter => 
                aspKeywords.some(k => k.includes(filter.toLowerCase()))
            );
        });
    }
    
    // Split into harmonious and challenging
    const harmoniousTypes = ['Conjunction', 'Trine', 'Sextile'];
    const challengingTypes = ['Square', 'Opposition', 'Inconjunct'];
    const harmonious = aspects.filter(asp => harmoniousTypes.includes(asp.aspectType));
    const challenging = aspects.filter(asp => challengingTypes.includes(asp.aspectType));
    
    const filterStatus = keywordFilters.size > 0 ? 
        `<p style="text-align: center; color: #667eea; margin-bottom: 10px;">Filtering by: ${Array.from(keywordFilters).join(', ')} (${aspects.length}/${allAspects.length} aspects)</p>` : '';
    
    return `
        ${title ? `<h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>` : ''}
        ${filterStatus}
        
        ${harmonious.length > 0 ? `
            <h3 style="color: #4CAF50; margin-top: 2rem; margin-bottom: 1rem;">Harmonious Aspects (${harmonious.length})</h3>
            ${renderAspectCards(harmonious, keywordFilters, keywordToggleFn, { showProfileNames })}
        ` : ''}
        
        ${challenging.length > 0 ? `
            <h3 style="color: #f5576c; margin-top: 2rem; margin-bottom: 1rem;">Challenging Aspects (${challenging.length})</h3>
            ${renderAspectCards(challenging, keywordFilters, keywordToggleFn, { showProfileNames })}
        ` : ''}
        
        ${aspects.length === 0 && keywordFilters.size > 0 ? `
            <p style="text-align: center; color: #999; margin-top: 2rem;">No aspects match the selected keywords.</p>
        ` : ''}
    `;
}

async function generateSynastryReport() {
    const { profile1, profile2 } = selectedSynastryProfiles;
    
    if (!synastryCalculator) {
        alert('Synastry data not loaded yet. Please try again.');
        return;
    }
    
    document.getElementById('loading').style.display = 'block';
    
    try {
        const allAspects = synastryCalculator.calculate(profile1, profile2);
        
        // Cache aspects for synastry blurb resolution
        currentSynastryAspects = allAspects;
        
        const resultsContainer = document.getElementById('synastryAspectsList');
        
        resultsContainer.innerHTML = renderAspectSection(
            allAspects, 
            synastryKeywordFilters, 
            'toggleSynastryKeyword',
            { 
                title: `${profile1.name} & ${profile2.name}`,
                showProfileNames: true 
            }
        );
        
        document.getElementById('synastryResults').style.display = 'block';
        
        // Activate synastry blurb mode on the blurbs page
        synastryBlurbMode = true;
        generateSynastryBlurbs();
        loadBlurbList();
        refreshGeneratedBlurbs();
        
        // Update heading and show blurbs section alongside synastry results
        document.getElementById('blurbSectionTitle').textContent =
            `Synastry Blurbs: ${profile1.name} & ${profile2.name}`;
        document.getElementById('blurbsSection').style.display = 'block';
    } catch (error) {
        alert('Error generating synastry report: ' + error.message);
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// Generate resolved synastry blurbs from all active synastry templates
function generateSynastryBlurbs() {
    const activeDefaults = DEFAULT_SYNASTRY_BLURBS.filter(b => !deletedDefaultSynastryBlurbIds.includes(b.id));
    const activeCustom = customSynastryBlurbs.filter(b => !deletedSynastryBlurbs.find(d => d.id === b.id));
    const allTemplates = [...activeDefaults, ...activeCustom];
    const { profile1, profile2 } = selectedSynastryProfiles;
    const pairLabel = `${profile1.name} & ${profile2.name}`;
    
    generatedSynastryBlurbs = allTemplates.map(template => {
        const resolved = resolveSynastryBlurb(template.text, currentSynastryAspects);
        return {
            id: template.id + '_syn_' + Date.now(),
            text: resolved,
            original: template.text,
            profileName: pairLabel,
            blurbTemplate: template,
            timestamp: new Date().toISOString()
        };
    });
}

function toggleSynastryKeyword(keyword) {
    // Find existing keyword with case-insensitive match
    const existing = Array.from(synastryKeywordFilters).find(f => f.toLowerCase() === keyword.toLowerCase());
    
    if (existing) {
        synastryKeywordFilters.delete(existing);
    } else {
        synastryKeywordFilters.add(keyword);
    }
    
    // Regenerate the report with new filters
    generateSynastryReport();
}

function toggleShorterDescriptions() {
    shorterDescriptions = !shorterDescriptions;
    const btn = document.getElementById('shorterDescBtn');
    if (btn) {
        btn.textContent = shorterDescriptions ? 'Full Descriptions' : 'Shorter Descriptions';
    }
    // Re-render synastry report if active
    if (selectedSynastryProfiles.profile1 && selectedSynastryProfiles.profile2) {
        generateSynastryReport();
    }
}

function toggleNatalKeyword(keyword) {
    // Find existing keyword with case-insensitive match
    const existing = Array.from(natalKeywordFilters).find(f => f.toLowerCase() === keyword.toLowerCase());
    
    if (existing) {
        natalKeywordFilters.delete(existing);
    } else {
        natalKeywordFilters.add(keyword);
    }
    
    // Regenerate the natal aspects display
    displayNatalAspects(currentChart);
}

function displayNatalAspects(chart) {
    if (!natalCalculator || !chart) return;
    
    const allAspects = natalCalculator.calculateNatal({ chart, name: chart.profileName });
    const resultsContainer = document.getElementById('natalAspectsList');
    
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = renderAspectSection(
        allAspects,
        natalKeywordFilters,
        'toggleNatalKeyword',
        { showProfileNames: false }
    );
}


