import { Story } from '../types';

// ─── Cover images (gradient data-URIs so no external deps) ───
const COVERS = [
  'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
  'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
  'linear-gradient(135deg,#0d0d0d,#1a1a2e,#16213e)',
  'linear-gradient(135deg,#0b0c10,#1f2833,#45a29e)',
  'linear-gradient(135deg,#10002b,#240046,#3c096c)',
];

export const SEED_STORIES: Story[] = [
  {
    id: 'story-001',
    title: 'The Last Filecoin Node',
    content: `In the year 2042, data is the most precious resource on Earth. The great server farms of Virginia and Oregon are silent now — casualties of the energy wars and corporate collapses that nobody predicted.

Only one node remained active in the deep archives of Svalbard, running on solar panels and the sheer stubbornness of its keeper. Every day, she checks the proof submissions. Every thirty seconds, a cryptographic heartbeat pulses through the permafrost — proof that the data still exists, that the memories are still there.

The Filecoin protocol doesn't care about politics. It doesn't care about borders or blackouts. It only cares about the math: did you submit your proof? Is your storage deal still valid? Has the community tipped enough to keep your payment rails open?

She received a 2 USDFC tip from someone in Lagos last night. That bought another four days.

"Thank you," she whispered to no one in particular, watching the epoch counter tick forward in the dim glow of her monitor. "Thank you for keeping the lights on."

Outside, the Aurora Borealis painted the frozen sky in emerald and cyan — the same colors as the Filecoin explorer dashboard she kept on her secondary screen at all times. A reminder that the network was alive, even when the world felt dead.

She uploaded another batch: 47GB of digitized newspaper archives from 2019, back when the internet was still mostly centralized and people thought it would last forever. They were wrong. She was making sure the record survived anyway.`,
    coverImage: COVERS[0],
    author: '0xAlice...f4b2',
    authorFull: '0xAlicef4b2e8a1d3c2b9e7f6a5d4c3b2a1e9f8d7c6',
    authorAvatar: '🧊',
    authorBio: 'Arctic data archivist. Keeping the record alive one epoch at a time.',
    status: 'ACTIVE',
    hoursRemaining: 192,
    maxHours: 240,
    likes: 9400,
    views: 14200,
    tipsReceived: 89,
    tipsUSDFC: 45,
    filecoinCID: 'bafybeihykld7uyxzogax6vgyvag42y7464eywpf55gxi54ivy2vcvhpyfq',
    tags: ['sci-fi', 'archive', 'filecoin'],
    publishedAt: '2026-06-14',
    wordCount: 287,
    readMinutes: 2,
    chapters: [
      {
        title: 'The Last Node',
        content: `In the year 2042, data is the most precious resource on Earth. The great server farms of Virginia and Oregon are silent now — casualties of the energy wars and corporate collapses that nobody predicted.

Only one node remained active in the deep archives of Svalbard, running on solar panels and the sheer stubbornness of its keeper.`
      },
      {
        title: 'The Proof',
        content: `Every day, she checks the proof submissions. Every thirty seconds, a cryptographic heartbeat pulses through the permafrost — proof that the data still exists, that the memories are still there.

The Filecoin protocol doesn't care about politics. It only cares about the math: did you submit your proof? Is your storage deal still valid?`
      },
      {
        title: 'The Thank You',
        content: `She received a 2 USDFC tip from someone in Lagos last night. That bought another four days.

"Thank you," she whispered to no one in particular, watching the epoch counter tick forward in the dim glow of her monitor. "Thank you for keeping the lights on."

Outside, the Aurora Borealis painted the frozen sky in emerald and cyan — the same colors as the Filecoin explorer dashboard.`
      },
    ],
  },
  {
    id: 'story-002',
    title: 'The Archivist of Neo-Istanbul',
    content: `The Bosphorus rose three meters between 2031 and 2038. The data centers in Levent went dark on a Tuesday afternoon when the floodwaters reached the backup generators. Nobody had a plan for that.

From my studio high in the Beyoğlu hills, I've spent the last two years digitizing what the water didn't take: vinyl records from the 1970s — Erkin Koray, Selda Bağcan, Cem Karaca. The kind of music that makes your chest ache with something you can't name.

Every waveform I encode gets pinned to IPFS and anchored to a Filecoin storage deal. The CID goes into a public registry. A few USDFC tips from readers around the world — mostly from the diaspora in Berlin, London, Toronto — keep the deal alive month after month.

I don't know most of my tippers. I know their wallet addresses, which tells me almost nothing. But every month when I see the tips arrive, I feel less alone in this.

Istanbul's soul floats above the flood line now, safe in the decentralized cloud. The servers may drown. The music will not.

Last week I uploaded Selda Bağcan's 1973 album. The file is 847MB. The storage cost is roughly $0.12 per month. Twelve cents to keep one woman's voice alive for another month. It seems like the best deal I've ever made.

If you're reading this, you're already part of it. The network is all of us.`,
    coverImage: COVERS[1],
    author: '0xArchivist...99e1',
    authorFull: '0xArchivist99e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
    authorAvatar: '🎵',
    authorBio: 'Digitizing the cultural memory of Neo-Istanbul, one vinyl at a time.',
    status: 'ACTIVE',
    hoursRemaining: 67,
    maxHours: 168,
    likes: 9995,
    views: 18400,
    tipsReceived: 112,
    tipsUSDFC: 78,
    filecoinCID: 'bafybeid4a7zrfkpajlcrbqkbksdakqpxnr5fxomncvwjlbnhq4m6r3i32e',
    tags: ['culture', 'archive', 'music', 'istanbul'],
    publishedAt: '2026-06-15',
    wordCount: 312,
    readMinutes: 2,
  },
  {
    id: 'story-003',
    title: 'Journal from the Deep Sea Node',
    content: `Day 412 in the Mariana Trench Data Capsule.

The cooling is perfect down here at 4,000 meters. Pressure acts as a natural electromagnetic shield. We run 8 petabytes of archival nodes powered by thermal vents — a gift from the Earth itself.

Every 30 seconds, the system submits a PDP storage proof to the Filecoin network. Each proof is a heartbeat. If we miss three consecutive epochs, the deal terminates. The backup pumps will flood the drives. That is a feature, not a bug: better data erasure than data leakage.

The hardest part isn't the isolation. It's the maintenance schedule. Last week, ROV-7 developed a pressure fault at 3,200m. I had to manually reroute the network stack through the secondary array while fixing the housing seal. Seven hours of work in a pressurized suit, in the dark.

Someone tipped us 2 USDFC last night. That buys another week of storage. I don't know who you are, but thank you. You just extended the storage deal that holds the 2029 Amazon biodiversity survey — 47,000 species catalogued before the second wave of deforestation hit.

That data doesn't exist anywhere else. Not anymore.

Day 413: Connection stable. Proofs submitting normally. Depth: 4,012m. Pressure: nominal. Spirits: better than yesterday.`,
    coverImage: COVERS[2],
    author: '0xDeepNode...22d2',
    authorFull: '0xDeepNode22d2a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
    authorAvatar: '🌊',
    authorBio: 'Operator of the Mariana Deep Archive. 4000m below the surface, keeping data alive.',
    status: 'EXPIRING',
    hoursRemaining: 11,
    maxHours: 168,
    likes: 4200,
    views: 6800,
    tipsReceived: 18,
    tipsUSDFC: 12,
    filecoinCID: 'bafybeib3a5qnctxqwiryjuniccnkxdm4z3bpw7qpizfkvhwkp4rdjpn4rq',
    tags: ['sci-fi', 'ocean', 'survival', 'archive'],
    publishedAt: '2026-06-10',
    wordCount: 321,
    readMinutes: 2,
  },
  {
    id: 'story-004',
    title: 'Echoes of the IPFS Protocol',
    content: `We thought the internet was permanent. We were wrong.

GeoCities: gone. Myspace: gone. Vine, Orkut, Google+, Flash games, a thousand chat apps, the entire social graph of the early 2000s — gone. Every time a company goes bankrupt or pivots or simply stops caring, a slice of digital culture vanishes permanently.

We are living in the age of digital amnesia, and most people don't even notice.

HTTP is a promise. A URL is a pointer that can be redirected, broken, or 404'd at any moment. IPFS is a fact. A Content Identifier (CID) is derived from the data itself — it cannot be changed without changing the CID. You cannot fake it. You cannot corrupt it silently.

And with Filecoin's economic incentive layer, storage providers are paid in FIL to keep it alive. They submit cryptographic proofs — Proof of Replication, Proof of Spacetime — every 30 seconds. The network verifies. The deal continues.

This story lives on content-addressed storage. It cannot die unless humanity forgets to tip.

Think about that for a moment. The survival of information is no longer a corporate decision. It's a collective one. Every tip is a vote. Every tip is a small act of saying: this matters, this should survive, this is worth the twelve cents a month it costs to keep it alive.

What will you vote for today?`,
    coverImage: COVERS[3],
    author: '0xBob...99a1',
    authorFull: '0xBob99a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    authorAvatar: '📡',
    authorBio: 'Protocol philosopher. Writing about the permanence of decentralized data.',
    status: 'EXPIRED',
    hoursRemaining: 0,
    maxHours: 168,
    likes: 12000,
    views: 23400,
    tipsReceived: 45,
    tipsUSDFC: 12,
    filecoinCID: 'bafybeifqtjnvsmtmqqoghbx3qajhqz5lpmtrkzyliqbp7akjwnbchqfbza',
    tags: ['philosophy', 'web3', 'history', 'ipfs'],
    publishedAt: '2026-06-01',
    wordCount: 298,
    readMinutes: 2,
  },
  {
    id: 'story-005',
    title: 'Code as Poetry, Storage as Time',
    content: `Civilizations are remembered by the durability of their recording materials.

The Sumerians pressed wedge marks into clay and those tablets survived 5,000 years. The Egyptians painted on papyrus — some of it still readable today. The Romans carved into stone. The medieval monks copied manuscripts onto vellum.

And we? We store our memories on magnetic platters that degrade in a decade, in data centers that depend on continuous power, cooling, and corporate solvency. We store them behind proprietary APIs that can revoke access at any moment.

The digital renaissance is happening right now, and we are recording it on sand.

But there is another way. Smart contracts that self-fund their own storage. Content addresses that cannot be changed without changing the proof. Economic incentives that align the interests of storage providers with the longevity of data.

Writing a Filecoin storage deal is, in a sense, a form of poetry. You are saying: this data matters enough to lock in a contract. This data deserves to survive. I am putting value on the line — my FIL, my USDFC — as a pledge that this content is worth preserving.

Every epoch that passes and finds your deal still valid, your proofs still submitting, your data still intact — that is a line of verse. That is the meter and rhyme of permanent memory.

We write code today, hoping the decentralized network keeps execution alive tomorrow. And tomorrow. And a thousand tomorrows after that.`,
    coverImage: COVERS[4],
    author: '0xPoet...33b2',
    authorFull: '0xPoet33b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    authorAvatar: '🖊️',
    authorBio: 'Writing at the intersection of code, poetry, and permanence.',
    status: 'ACTIVE',
    hoursRemaining: 128,
    maxHours: 168,
    likes: 3200,
    views: 5500,
    tipsReceived: 22,
    tipsUSDFC: 15,
    filecoinCID: 'bafybeidqwertyu1234567890abcdefghijklmnopqrst',
    tags: ['philosophy', 'poetry', 'filecoin', 'web3'],
    publishedAt: '2026-06-16',
    wordCount: 302,
    readMinutes: 2,
  },
];

export const TIP_HISTORY_SEED = [
  { 
    storyId: 'story-001', 
    storyTitle: 'The Last Filecoin Node', 
    amount: 5, 
    timestamp: '2026-06-17T10:22:00Z', 
    txHash: '0xabc...123',
    tipperAddress: '0xbob99a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    authorAddress: '0xalicef4b2e8a1d3c2b9e7f6a5d4c3b2a1e9f8d7c6'
  },
  { 
    storyId: 'story-002', 
    storyTitle: 'The Archivist of Neo-Istanbul', 
    amount: 1, 
    timestamp: '2026-06-16T14:05:00Z', 
    txHash: '0xdef...456',
    tipperAddress: '0xalicef4b2e8a1d3c2b9e7f6a5d4c3b2a1e9f8d7c6',
    authorAddress: '0xarchivist99e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6'
  },
];
