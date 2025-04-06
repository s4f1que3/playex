import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '../utils/api';
import MediaGrid from '../components/media/MediaGrid';
import Pagination from '../components/common/Pagnation';
import { Select, Tag } from '../components/ui';
import RequestForm from '../components/requests/RequestForm';

const CollectionsIndexPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [isGridView, setIsGridView] = useState(true);
  const itemsPerPage = 36; // 6x6 grid

  const categories = [
    { id: 'all', name: 'All Collections' },
    { id: 'superhero', name: 'Superhero' },
    { id: 'animation', name: 'Animation' },
    { id: 'action', name: 'Action' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'horror', name: 'Horror' },
    { id: 'scifi', name: 'Sci-Fi' },
    { id: 'thriller', name: 'Thriller' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'western', name: 'Western' },
    { id: 'war', name: 'War' },
    { id: 'martial-arts', name: 'Martial Arts' },
    { id: 'musical', name: 'Musical' },
    { id: 'spy', name: 'Spy' },
    { id: 'crime', name: 'Crime' },
    { id: 'documentary', name: 'Documentary' },
    { id: 'sports', name: 'Sports' }
  ];

  const categoryKeywords = {
    superhero: [
      'marvel', 'dc comics', 'x-men', 'spider-man', 'batman', 'superman', 'iron man', 
      'thor', 'captain america', 'avengers', 'guardians of the galaxy', 'ant man', 
      'black panther', 'wonder woman', 'aquaman', 'justice league', 'green lantern',
      'deadpool', 'suicide squad', 'hulk', 'fantastic four', 'hellboy',
      'venom', 'wolverine', 'doctor strange', 'black widow', 'shazam',
      'teen titans', 'daredevil', 'punisher', 'spawn', 'watchmen',
      'birds of prey', 'captain marvel', 'flash', 'hawk', 'supergirl',
      'legion', 'agents of shield', 'gotham', 'arrow', 'titans',
      'morbius', 'eternals', 'doom patrol', 'power rangers', 'ninja turtles',
      'kick-ass', 'umbrella academy', 'the boys', 'invincible', 'jupiter\'s legacy',
      'hancock', 'darkman', 'meteor man', 'steel', 'green hornet',
      'sky high', 'chronicle', 'glass', 'unbreakable', 'super',
      'defendor', 'hero', 'megamind', 'mystery men', 'thunderbolt'
    ],

    animation: [
      'toy story', 'shrek', 'how to train your dragon', 'despicable me', 'ice age', 
      'kung fu panda', 'madagascar', 'pixar', 'dreamworks', 'disney', 'frozen', 
      'moana', 'coco', 'big hero 6', 'zootopia', 'inside out', 'incredibles',
      'finding nemo', 'cars', 'monsters inc', 'brave', 'up', 'wall-e', 'ratatouille',
      'minions', 'hotel transylvania', 'tangled', 'wreck it ralph',
      'spirit', 'antz', 'megamind', 'croods', 'boss baby', 'puss in boots',
      'princess and the frog', 'emperors new groove', 'atlantis',
      'treasure planet', 'lilo & stitch', 'bolt', 'meet the robinsons',
      'home', 'turbo', 'sing', 'trolls', 'onward', 'soul', 'luca',
      'ghibli', 'laika', 'aardman', 'wallace and gromit', 'chicken run',
      'coraline', 'kubo', 'boxtrolls', 'paranorman', 'flushed away',
      'blue sky', 'rio', 'ferdinand', 'spies in disguise', 'scoob',
      'smallfoot', 'captain underpants', 'over the hedge', 'open season',
      'surfs up', 'polar express', 'rise of the guardians', 'dragon prince',
      'sausage party', 'food fight', 'emoji movie', 'nut job', 'uglydolls',
      'playmobil', 'rock dog', 'norm of the north', 'wonder park'
    ],

    action: [
      'james bond', 'fast and furious', 'mission impossible', 'john wick', 'indiana jones', 
      'matrix', 'terminator', 'transformers', 'die hard', 'jason bourne', 'kingsman',
      'expendables', 'mad max', 'jack reacher', 'predator', 'robocop', 'tomb raider',
      'atomic blonde', 'salt', 'olympus has fallen', 'ocean\'s', 'the equalizer',
      'bourne', 'taken', 'john wick', 'commando', 'rambo', 'rocky',
      'top gun', 'lethal weapon', 'bad boys', 'the rock', 'con air',
      'speed', 'point break', '300', 'gladiator', 'triple x',
      'national treasure', 'riptide', 'transporter', 'mechanic',
      'rush hour', 'italian job', 'lock stock', 'snatch',
      'black hawk down', 'atomic blonde', 'black widow', 'charlie\'s angels',
      'crank', 'dredd', 'equilibrium', 'hardcore henry', 'hitman',
      'ip man', 'machete', 'metro', 'xxx', 'olympus has fallen',
      'real steel', 'red', 'safe', 'salt', 'shoot em up',
      'smoking aces', 'sucker punch', 'wanted', 'warrior', 'waterworld',
      'geostorm', 'battleship', 'true lies', 'cliffhanger', 'demolition man'
    ],

    fantasy: [
      'harry potter', 'lord of the rings', 'fantastic beasts', 'narnia', 'hobbit',
      'pirates of the caribbean', 'alice in wonderland', 'maleficent', 'percy jackson',
      'golden compass', 'neverending story', 'conan', 'willow', 'stardust', 'eragon',
      'dungeons and dragons', 'seventh son', 'mortal instruments',
      'inkheart', 'bridge to terabithia', 'spiderwick chronicles',
      'chronicles of riddick', 'pan', 'oz', 'the last witch hunter',
      'bright', 'immortals', 'clash of titans', 'doctor strange',
      'warcraft', 'artemis fowl', 'miss peregrine', 'dark tower',
      'xanadu', 'krull', '10th kingdom', 'pagemaster', 'labyrinth',
      'dark crystal', 'neverending story', 'excalibur', 'willow',
      'seventh son', 'dragonheart', 'legend', 'ladyhawke', 'highlander',
      'time bandits', 'princess bride', 'brothers grimm', 'van helsing',
      'solomon kane', 'seventh voyage of sinbad', 'clash of titans',
      'wrath of titans', 'gods of egypt', 'immortals', 'beowulf'
    ],

    horror: [
      'halloween', 'friday the 13th', 'nightmare on elm street', 'saw', 'conjuring', 
      'insidious', 'final destination', 'paranormal activity', 'purge', 'sinister',
      'annabelle', 'it', 'alien', 'resident evil', 'underworld', 'blade', 'hellraiser',
      'child\'s play', 'scream', 'evil dead', 'texas chainsaw', 'hannibal', 'poltergeist',
      'the nun', 'grudge', 'ring', 'silent hill', 'jeepers creepers',
      'blair witch', 'candyman', 'trick r treat', 'babadook', 'midsommar',
      'hereditary', 'pet sematary', 'carrie', 'hostel', 'the thing',
      'brightburn', 'dracula', 'wolf man', 'mummy', 'exorcist',
      'paranormal', 'ouija', 'lights out', 'us', 'quiet place',
      'puppet master', 'wishmaster', 'leprechaun', 'tremors', 'critters',
      'gremlins', 'pumpkinhead', 'phantasm', 'basket case', 'troll',
      'ghoulies', 'slither', 'thirteen ghosts', 'house on haunted hill',
      'return of the living dead', 'night of the demons', 'scanners',
      'event horizon', 'videodrome', 'reanimator', 'from beyond',
      'species', 'cube', 'the descent', 'session 9', 'martyrs'
    ],

    scifi: [
      'star wars', 'star trek', 'blade runner', 'tron', 'pacific rim',
      'hunger games', 'divergent', 'maze runner', 'ender\'s game',
      'ready player one', 'valerian', 'fifth element', 'arrival',
      'interstellar', 'inception', 'edge of tomorrow', 'oblivion',
      'jupiter ascending', 'district 9', 'elysium', 'chappie',
      'alien vs predator', 'godzilla', 'king kong', 'jurassic park', 'terminator',
      'back to the future', 'matrix', 'planet of the apes', 'avatar',
      'prometheus', 'cloverfield', 'dark matter', 'dune', '12 monkeys',
      'snowpiercer', 'looper', 'passengers', 'gravity', 'sunshine',
      'serenity', 'firefly', 'event horizon', 'riddick', 'source code',
      'aeon flux', 'pandorum', 'pitch black', 'moon', 'sphere',
      'timeline', 'dark city', 'existenz', 'equilibrium', 'surrogates',
      'vice', 'virtuosity', 'hardware', 'screamers', 'impostor',
      'a.i.', 'bicentennial man', 'babylon a.d.', 'lockout', 'dredd',
      'equalizer', 'upgrade', 'freaks', 'brightburn', 'possessor'
    ],

    thriller: [
      'gone girl', 'seven', 'silence of the lambs', 'shutter island',
      'fight club', 'prestige', 'memento', 'usual suspects',
      'da vinci code', 'girl with dragon tattoo', 'knives out',
      'no country for old men', 'departed', 'prisoners', 'zodiac',
      'bourne', 'mission impossible', 'ocean\'s', 'now you see me',
      'james bond', 'sherlock holmes', 'jack ryan', 'manchurian candidate',
      'basic instinct', 'fatal attraction', 'cape fear', 'bone collector',
      'angel heart', 'vertigo', 'rear window', 'butterfly effect',
      'gone baby gone', 'heat', 'inside man', 'italian job', 'momento',
      'old boy', 'panic room', 'primal fear', 'reservoir dogs'
    ],

    comedy: [
      'hangover', 'superbad', 'american pie', 'anchorman', 'zoolander',
      'austin powers', 'ace ventura', 'dumb and dumber', 'scary movie',
      'hot shots', 'naked gun', 'police academy', 'rush hour',
      'men in black', '21 jump street', 'wayne\'s world', 'bill and ted',
      'bridesmaids', 'pitch perfect', 'mean girls', 'home alone'
    ],
    
    drama: [
      'godfather', 'scarface', 'goodfellas', 'schindler\'s list',
      'shawshank redemption', 'green mile', 'forrest gump',
      'saving private ryan', 'gladiator', 'braveheart',
      'pianist', 'beautiful mind', 'theory of everything',
      'imitation game', 'social network', 'wolf of wall street',
      'cast away', 'revenant', 'inception', 'departed'
    ],
    western: [
      'magnificent seven', 'django', 'good bad ugly', 'true grit',
      'unforgiven', 'tombstone', 'once upon time west', 'wild wild west',
      'quick and dead', 'hateful eight', 'bone tomahawk', 'rango',
      'ballad of buster scruggs', '3:10 to yuma', 'open range',
      'silverado', 'pale rider', 'outlaw josey wales', 'dances with wolves',
      'assassination jesse james', 'young guns', 'maverick', 'lone ranger'
    ],
  
    war: [
      'apocalypse now', 'platoon', 'full metal jacket', 'thin red line',
      'letters from iwo jima', 'black hawk down', 'hurt locker',
      'zero dark thirty', 'dunkirk', '1917', 'hacksaw ridge',
      'longest day', 'bridge on river kwai', 'kelly heroes',
      'where eagles dare', 'guns of navarone', 'dirty dozen',
      'inglourious basterds', 'valkyrie', 'fury', 'midway'
    ],
  
    martial_arts: [
      'enter the dragon', 'fist of fury', 'drunken master',
      'once upon time china', 'iron monkey', 'hero', 'fearless',
      'house of flying daggers', 'crouching tiger', 'raid',
      'ong bak', 'warrior', 'undisputed', 'bloodsport',
      'kickboxer', 'mortal kombat', 'american ninja',
      'ninja assassin', 'karate kid', 'kung fu panda'
    ],

    musical: [
      'les miserables', 'phantom opera', 'chicago', 'moulin rouge',
      'mamma mia', 'greatest showman', 'la la land', 'rock of ages',
      'sweeney todd', 'into woods', 'dreamgirls', 'grease',
      'sound of music', 'mary poppins', 'west side story',
      'annie', 'hairspray', 'rent', 'jersey boys', 'cats'
    ],
  
    spy: [
      'mission impossible', 'bourne', 'james bond', 'kingsman',
      'salt', 'atomic blonde', 'red sparrow', 'bridge of spies',
      'tinker tailor', 'man from uncle', 'johnny english',
      'austin powers', 'true lies', 'spies like us',
      'spy game', 'body of lies', 'munich', 'spy kids',
      'triple x', 'clear and present danger'
    ],
  
    crime: [
      'godfather', 'goodfellas', 'casino', 'scarface',
      'untouchables', 'heat', 'departed', 'donnie brasco',
      'carlitos way', 'once upon time america', 'miller\'s crossing',
      'road to perdition', 'american gangster', 'public enemies',
      'legend', 'irishman', 'city of god', 'snatch',
      'lock stock', 'layer cake', 'lucky number slevin'
    ],
  
    sports: [
      'rocky', 'creed', 'raging bull', 'fighter',
      'million dollar baby', 'cinderella man', 'remember titans',
      'friday night lights', 'moneyball', 'field of dreams',
      'bull durham', 'major league', 'mighty ducks',
      'sandlot', 'bad news bears', 'caddyshack',
      'happy gilmore', 'tin cup', 'rush', 'coach carter'
    ]
  };

  // Create debounced search
  const debouncedSearch = useCallback((value) => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, []);

  const { data: collections, isLoading } = useQuery({
    queryKey: ['allCollections'],
    queryFn: async () => {
      const queries = [
        // Superhero Collections
        'marvel', 'dc comics', 'x-men', 'spider-man', 'batman', 'superman', 'iron man', 
        'thor', 'captain america', 'avengers', 'guardians of the galaxy', 'ant man', 
        'black panther', 'wonder woman', 'aquaman', 'justice league', 'green lantern',
        'deadpool', 'suicide squad', 'hulk', 'fantastic four', 'hellboy',
        'venom', 'wolverine', 'doctor strange', 'black widow', 'shazam',
        'teen titans', 'daredevil', 'punisher', 'spawn', 'watchmen',
        'birds of prey', 'captain marvel', 'flash', 'hawk', 'supergirl',
        'legion', 'agents of shield', 'gotham', 'arrow', 'titans',
        'morbius', 'eternals', 'doom patrol', 'power rangers', 'ninja turtles',
        'kick-ass', 'umbrella academy', 'the boys', 'invincible', 'jupiter\'s legacy',
        'hancock', 'darkman', 'meteor man', 'steel', 'green hornet',
        'sky high', 'chronicle', 'glass', 'unbreakable', 'super',
        'defendor', 'hero', 'megamind', 'mystery men', 'thunderbolt',

        // Animation Collections
        'toy story', 'shrek', 'how to train your dragon', 'despicable me', 'ice age', 
        'kung fu panda', 'madagascar', 'pixar', 'dreamworks', 'disney', 'frozen', 
        'moana', 'coco', 'big hero 6', 'zootopia', 'inside out', 'incredibles',
        'finding nemo', 'cars', 'monsters inc', 'brave', 'up', 'wall-e', 'ratatouille',
        'minions', 'hotel transylvania', 'tangled', 'wreck it ralph',
        'spirit', 'antz', 'megamind', 'croods', 'boss baby', 'puss in boots',
        'princess and the frog', 'emperors new groove', 'atlantis',
        'treasure planet', 'lilo & stitch', 'bolt', 'meet the robinsons',
        'home', 'turbo', 'sing', 'trolls', 'onward', 'soul', 'luca',
        'ghibli', 'laika', 'aardman', 'wallace and gromit', 'chicken run',
        'coraline', 'kubo', 'boxtrolls', 'paranorman', 'flushed away',
        'blue sky', 'rio', 'ferdinand', 'spies in disguise', 'scoob',
        'smallfoot', 'captain underpants', 'over the hedge', 'open season',
        'surfs up', 'polar express', 'rise of the guardians', 'dragon prince',
        'sausage party', 'food fight', 'emoji movie', 'nut job', 'uglydolls',
        'playmobil', 'rock dog', 'norm of the north', 'wonder park',

        // Action Collections
        'james bond', 'fast and furious', 'mission impossible', 'john wick', 'indiana jones', 
        'matrix', 'terminator', 'transformers', 'die hard', 'jason bourne', 'kingsman',
        'expendables', 'mad max', 'jack reacher', 'predator', 'robocop', 'tomb raider',
        'atomic blonde', 'salt', 'olympus has fallen', 'ocean\'s', 'the equalizer',
        'bourne', 'taken', 'john wick', 'commando', 'rambo', 'rocky',
        'top gun', 'lethal weapon', 'bad boys', 'the rock', 'con air',
        'speed', 'point break', '300', 'gladiator', 'triple x',
        'national treasure', 'riptide', 'transporter', 'mechanic',
        'rush hour', 'italian job', 'lock stock', 'snatch',
        'black hawk down', 'atomic blonde', 'black widow', 'charlie\'s angels',
        'crank', 'dredd', 'equilibrium', 'hardcore henry', 'hitman',
        'ip man', 'machete', 'metro', 'xxx', 'olympus has fallen',
        'real steel', 'red', 'safe', 'salt', 'shoot em up',
        'smoking aces', 'sucker punch', 'wanted', 'warrior', 'waterworld',
        'geostorm', 'battleship', 'true lies', 'cliffhanger', 'demolition man',
        
        // Fantasy Collections
        'harry potter', 'lord of the rings', 'fantastic beasts', 'narnia', 'hobbit',
        'pirates of the caribbean', 'alice in wonderland', 'maleficent', 'percy jackson',
        'golden compass', 'neverending story', 'conan', 'willow', 'stardust', 'eragon',
        'dungeons and dragons', 'seventh son', 'mortal instruments',
        'inkheart', 'bridge to terabithia', 'spiderwick chronicles',
        'chronicles of riddick', 'pan', 'oz', 'the last witch hunter',
        'bright', 'immortals', 'clash of titans', 'doctor strange',
        'warcraft', 'artemis fowl', 'miss peregrine', 'dark tower',
        'xanadu', 'krull', '10th kingdom', 'pagemaster', 'labyrinth',
        'dark crystal', 'neverending story', 'excalibur', 'willow',
        'seventh son', 'dragonheart', 'legend', 'ladyhawke', 'highlander',
        'time bandits', 'princess bride', 'brothers grimm', 'van helsing',
        'solomon kane', 'seventh voyage of sinbad', 'clash of titans',
        'wrath of titans', 'gods of egypt', 'immortals', 'beowulf',

        // Horror Collections
        'halloween', 'friday the 13th', 'nightmare on elm street', 'saw', 'conjuring', 
        'insidious', 'final destination', 'paranormal activity', 'purge', 'sinister',
        'annabelle', 'it', 'alien', 'resident evil', 'underworld', 'blade', 'hellraiser',
        'child\'s play', 'scream', 'evil dead', 'texas chainsaw', 'hannibal', 'poltergeist',
        'the nun', 'grudge', 'ring', 'silent hill', 'jeepers creepers',
        'blair witch', 'candyman', 'trick r treat', 'babadook', 'midsommar',
        'hereditary', 'pet sematary', 'carrie', 'hostel', 'the thing',
        'brightburn', 'dracula', 'wolf man', 'mummy', 'exorcist',
        'paranormal', 'ouija', 'lights out', 'us', 'quiet place',
        'puppet master', 'wishmaster', 'leprechaun', 'tremors', 'critters',
        'gremlins', 'pumpkinhead', 'phantasm', 'basket case', 'troll',
        'ghoulies', 'slither', 'thirteen ghosts', 'house on haunted hill',
        'return of the living dead', 'night of the demons', 'scanners',
        'event horizon', 'videodrome', 'reanimator', 'from beyond',
        'species', 'cube', 'the descent', 'session 9', 'martyrs',

        // Sci-Fi Collections
        'star wars', 'star trek', 'blade runner', 'tron', 'pacific rim',
        'hunger games', 'divergent', 'maze runner', 'ender\'s game',
        'ready player one', 'valerian', 'fifth element', 'arrival',
        'interstellar', 'inception', 'edge of tomorrow', 'oblivion',
        'jupiter ascending', 'district 9', 'elysium', 'chappie',
        'alien vs predator', 'godzilla', 'king kong', 'jurassic park', 'terminator',
        'back to the future', 'matrix', 'planet of the apes', 'avatar',
        'prometheus', 'cloverfield', 'dark matter', 'dune', '12 monkeys',
        'snowpiercer', 'looper', 'passengers', 'gravity', 'sunshine',
        'serenity', 'firefly', 'event horizon', 'riddick', 'source code',
        'aeon flux', 'pandorum', 'pitch black', 'moon', 'sphere',
        'timeline', 'dark city', 'existenz', 'equilibrium', 'surrogates',
        'vice', 'virtuosity', 'hardware', 'screamers', 'impostor',
        'a.i.', 'bicentennial man', 'babylon a.d.', 'lockout', 'dredd',
        'equalizer', 'upgrade', 'freaks', 'brightburn', 'possessor',

        // Thriller Collections
        'gone girl', 'seven', 'silence of the lambs', 'shutter island',
        'fight club', 'prestige', 'memento', 'usual suspects',
        'da vinci code', 'girl with dragon tattoo', 'knives out',
        'no country for old men', 'departed', 'prisoners', 'zodiac',
        'bourne', 'mission impossible', 'ocean\'s', 'now you see me',
        'james bond', 'sherlock holmes', 'jack ryan', 'manchurian candidate',
        'basic instinct', 'fatal attraction', 'cape fear', 'bone collector',
        'angel heart', 'vertigo', 'rear window', 'butterfly effect',
        'gone baby gone', 'heat', 'inside man', 'italian job', 'momento',
        'old boy', 'panic room', 'primal fear', 'reservoir dogs',

        // Comedy Collections
        'hangover', 'superbad', 'american pie', 'anchorman', 'zoolander',
        'austin powers', 'ace ventura', 'dumb and dumber', 'scary movie',
        'hot shots', 'naked gun', 'police academy', 'rush hour',
        'men in black', '21 jump street', 'wayne\'s world', 'bill and ted',
        'bridesmaids', 'pitch perfect', 'mean girls', 'home alone',

        // Drama Collections
        'godfather', 'scarface', 'goodfellas', 'schindler\'s list',
        'shawshank redemption', 'green mile', 'forrest gump',
        'saving private ryan', 'gladiator', 'braveheart',
        'pianist', 'beautiful mind', 'theory of everything',
        'imitation game', 'social network', 'wolf of wall street',
        'cast away', 'revenant', 'inception', 'departed',

        // Western
        'magnificent seven', 'django', 'good bad ugly', 'true grit',
        'unforgiven', 'tombstone', 'once upon time west', 'wild wild west',
        'quick and dead', 'hateful eight', 'bone tomahawk', 'rango',
        'ballad of buster scruggs', '3:10 to yuma', 'open range',
        'silverado', 'pale rider', 'outlaw josey wales', 'dances with wolves',
        'assassination jesse james', 'young guns', 'maverick', 'lone ranger',

        // War
        'apocalypse now', 'platoon', 'full metal jacket', 'thin red line',
        'letters from iwo jima', 'black hawk down', 'hurt locker',
        'zero dark thirty', 'dunkirk', '1917', 'hacksaw ridge',
        'longest day', 'bridge on river kwai', 'kelly heroes',
        'where eagles dare', 'guns of navarone', 'dirty dozen',
        'inglourious basterds', 'valkyrie', 'fury', 'midway',
      
        // Martial Arts
        'enter the dragon', 'fist of fury', 'drunken master',
        'once upon time china', 'iron monkey', 'hero', 'fearless',
        'house of flying daggers', 'crouching tiger', 'raid',
        'ong bak', 'warrior', 'undisputed', 'bloodsport',
        'kickboxer', 'mortal kombat', 'american ninja',
        'ninja assassin', 'karate kid', 'kung fu panda',
      
        // Musicals
        'les miserables', 'phantom opera', 'chicago', 'moulin rouge',
        'mamma mia', 'greatest showman', 'la la land', 'rock of ages',
        'sweeney todd', 'into woods', 'dreamgirls', 'grease',
        'sound of music', 'mary poppins', 'west side story',
        'annie', 'hairspray', 'rent', 'jersey boys', 'cats',
    
        // Spy
        'mission impossible', 'bourne', 'james bond', 'kingsman',
        'salt', 'atomic blonde', 'red sparrow', 'bridge of spies',
        'tinker tailor', 'man from uncle', 'johnny english',
        'austin powers', 'true lies', 'spies like us',
        'spy game', 'body of lies', 'munich', 'spy kids',
        'triple x', 'clear and present danger',
    
        // Crime
        'godfather', 'goodfellas', 'casino', 'scarface',
        'untouchables', 'heat', 'departed', 'donnie brasco',
        'carlitos way', 'once upon time america', 'miller\'s crossing',
        'road to perdition', 'american gangster', 'public enemies',
        'legend', 'irishman', 'city of god', 'snatch',
        'lock stock', 'layer cake', 'lucky number slevin',

        // Sports 
        'rocky', 'creed', 'raging bull', 'fighter',
        'million dollar baby', 'cinderella man', 'remember titans',
        'friday night lights', 'moneyball', 'field of dreams',
        'bull durham', 'major league', 'mighty ducks',
        'sandlot', 'bad news bears', 'caddyshack',
        'happy gilmore', 'tin cup', 'rush', 'coach carter',
      ];
      
      const collectionsPromises = queries.map(query => 
        tmdbApi.get('/search/collection', {
          params: {
            query,
            include_adult: false,
            language: 'en-US',
            page: 1
          }
        })
      );
      
      const responses = await Promise.all(collectionsPromises);
      
      const allCollections = responses.flatMap(response => 
        response.data.results.map(collection => {
          // Determine collection category
          let category = 'all';
          const lowerName = collection.name.toLowerCase();
          
          // Check each category's keywords
          Object.entries(categoryKeywords).forEach(([cat, keywords]) => {
            if (keywords.some(keyword => lowerName.includes(keyword.toLowerCase()))) {
              category = cat;
            }
          });

          return {
            ...collection,
            media_type: 'collection',
            poster_path: collection.poster_path,
            title: collection.name,
            id: collection.id,
            category: category // Add category to collection object
          };
        })
      );
      
      // Remove duplicates
      const uniqueCollections = [...new Map(allCollections.map(item => [item.id, item])).values()];
      return uniqueCollections;
    },
    staleTime: 600000
  });

  // Update search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Enhanced filtering logic
  const filteredAndSortedCollections = useMemo(() => {
    let result = [...(collections || [])];
    
    if (selectedCategory !== 'all') {
      result = result.filter(collection => collection.category === selectedCategory);
    }
    
    if (debouncedQuery) {
      result = result.filter(collection => 
        collection.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    
    return result.sort((a, b) => {
      switch (selectedSort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'rating': return b.vote_average - a.vote_average;
        default: return b.popularity - a.popularity;
      }
    });
  }, [collections, selectedCategory, debouncedQuery, selectedSort]);

  // Update pagination calculations to use filtered results
  const totalCollections = filteredAndSortedCollections?.length || 0;
  const totalPages = Math.ceil(totalCollections / itemsPerPage);
  
  // Get current page collections
  const getCurrentPageCollections = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCollections?.slice(startIndex, endIndex) || [];
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#161616] pt-16 sm:pt-20 md:pt-24">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="relative min-h-screen">
          {/* Parallax Hero Section */}
          <div className="relative -mx-2 sm:-mx-4 overflow-hidden mb-32 sm:mb-40"> {/* Added margin bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] flex items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616] z-20" />
              <div className="absolute inset-0 bg-[#161616]">
                <div className="absolute inset-0 opacity-5 animate-pulse">
                  <div className="absolute inset-0 bg-pattern-grid transform rotate-45 scale-150" />
                </div>
              </div>

              <div className="container relative z-30 mx-auto px-3 sm:px-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-4 sm:mb-6 backdrop-blur-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                    </span>
                    <span className="text-[#82BC87] font-medium">Browse Collections</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                    Discover
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                      Movie Collections
                    </span>
                  </h1>

                  <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed">
                    From epic franchises to complete series, explore our curated collection of movie universes.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="container mx-auto px-2 sm:px-4 -mt-24 sm:-mt-32 relative z-30"> {/* Adjusted negative margin */}
            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-gray-900/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/5 shadow-2xl mb-6 sm:mb-8"
            >
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search collections..."
                  className="w-full bg-black/30 text-white placeholder-gray-400 border border-white/10 rounded-xl px-5 py-2.5 pl-11 focus:outline-none focus:border-[#82BC87]/50 transition-all text-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mt-4 sm:mt-6">
                <Select 
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                  className="w-full sm:w-auto sm:min-w-[180px]"
                />
                <Select
                  value={selectedSort}
                  onChange={setSelectedSort}
                  options={[
                    { id: 'popularity', name: 'Most Popular' },
                    { id: 'rating', name: 'Highest Rated' },
                    { id: 'name', name: 'Alphabetical' }
                  ]}
                  className="w-full sm:w-auto sm:min-w-[180px]"
                />
                <button
                  onClick={() => setIsGridView(!isGridView)}
                  className="w-full sm:w-auto p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  {/* View toggle icon */}
                </button>
              </div>
            </motion.div>

            {/* Results Counter */}
            {filteredAndSortedCollections && filteredAndSortedCollections.length > 0 && (
              <motion.div 
                layout
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-black/20 mb-4 sm:mb-6 w-fit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
                </svg>
                <span className="text-gray-400">
                  Found <span className="text-[#82BC87] font-medium">{totalCollections.toLocaleString()}</span> collections
                </span>
              </motion.div>
            )}

            {/* Main Content Grid */}
            <motion.div 
              className="bg-gray-900/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-white/5 shadow-2xl"
              layout
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${debouncedQuery}-${selectedSort}`}
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  layout
                >
                  <MediaGrid 
                    items={getCurrentPageCollections()}
                    loading={isLoading}
                    showType={true}
                    gridView={isGridView}
                    onHover={(item) => {
                      // Show preview tooltip
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="mt-8 sm:mt-12 backdrop-blur-md bg-black/20 p-3 sm:p-4 rounded-xl sm:rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="pagination-modern"
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Request Form - Add this before the final closing divs */}
            <div className="mt-12 sm:mt-20">
              <RequestForm 
                title="Missing a Collection?"
                description="Can't find your favorite movie collection or franchise? Let us know and we'll add it to our database!"
                placeholder="Enter the name of the movie collection you'd like to see..."
                buttonText="Request Collection"
              />
            </div>
          </div>

          {/* Scroll to Top Button - Adjusted for better mobile placement */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 bg-[#82BC87] hover:bg-[#6da972] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 sm:h-6 sm:w-6 transform group-hover:-translate-y-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsIndexPage;
