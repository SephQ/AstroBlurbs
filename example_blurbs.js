// Blurb Templates (just an example file, not used in the app.)
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
            moonH: ["who I am", "what I have", "what I say", "where I belong", "what I create", "my daily life", "my partnerships", "my transformations", "my philosophy", "my work life", "my friendships", "my subconscious"],
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
            moon: ["fighter", "creature of comfort", "chameleon", "mother hen", "spotlight seeker", "helper", "people pleaser", "phoenix", "wanderer", "mountain", "alien", "ocean"],
            venus: ["wildfire", "romantic traditionalist", "flirt", "devoted protector", "dramatic lover", "perfectionist partner", "harmonious soul", "all-or-nothing lover", "free spirit", "steady partner", "unconventional heart", "selfless romantic"]
        }
    }
];

// @planet and @planetH formats are preferred.

// Planet IDs
const PLANETS = {
	SUN: 0,
	MOON: 1,
	MERCURY: 2,
	VENUS: 3,
	MARS: 4,
	JUPITER: 5,
	SATURN: 6,
	URANUS: 7,
	NEPTUNE: 8,
	PLUTO: 9,
	'N. NODE': 10,
	LILITH: 12,
	CHIRON: 15,
	CERES: 17,
	PALLAS: 2,
	JUNO: 3,
	VESTA: 4,
	PHOLUS: 5145,
	ERIS: 136199
};
