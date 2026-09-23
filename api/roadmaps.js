export const modernBridges = [
  {
    id: 'oppenheimer-potemkin',
    modern: 'Oppenheimer (2023)',
    modernDirector: 'Christopher Nolan',
    modernImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    classic: 'Soomuslaev Potjomkin (1925)',
    classicDirector: 'Sergei Eisenstein',
    classicImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    connectionTitle: 'Montaaž kui visuaalne ahelreaktsioon ja ajaline konflikt',
    whyWatch: 'Christopher Nolani meisterlikkus luua pinget läbi eri ajaliinide ja sekundiliste lõigete toetub otse Sergei Eisensteini loodud intellektuaalse montaaži teooriale. Kui sind kütkestas tuumapommi ootuse visuaalne sümfoonia, näed „Potjomkinis“, kuidas sama efekt sündis ilma arvutite ja helita.',
    articleSlug: 'silent',
    mood: 'Eepiline pinge',
    tags: ['montaaž', 'pinge', 'ajalugu']
  },
  {
    id: 'batman-metropolis',
    modern: 'Blade Runner 2049 / The Batman',
    modernDirector: 'Denis Villeneuve / Matt Reeves',
    modernImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    classic: 'Metropolis (1927)',
    classicDirector: 'Fritz Lang',
    classicImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    connectionTitle: 'Sünge suurlinn, ekspressionistlikud varjud ja inimese masinastumine',
    whyWatch: 'Gothami vihmamärjad neoontänavad ja Blade Runneri düstoopiline pilvelõhkujate meri on otsene kummardus Saksa ekspressionismile. Fritz Langi „Metropolis“ lõi visuaalse keele, mida ulmefilmid ja neo-noir kasutavad tänaseni.',
    articleSlug: 'silent',
    mood: 'Sünge psühholoogia',
    tags: ['ulme', 'ekspressionism', 'arhitektuur']
  },
  {
    id: 'lalaland-nouvelle',
    modern: 'La La Land (2016) / Barbie (2023)',
    modernDirector: 'Damien Chazelle / Greta Gerwig',
    modernImage: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80',
    classic: 'Hingeldades & Jacques Demy muusikalid',
    classicDirector: 'Jean-Luc Godard, Jacques Demy',
    classicImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    connectionTitle: 'Prantsuse uue laine vaba hingus, jazz ja julge koloriit',
    whyWatch: 'Damien Chazelle ei varja, et „La La Land“ on armastuskiri Prantsuse uuele lainele. Käsikaamera liikumine tänaval, improvisatsiooniline energia ja peategelaste melanhoolne armastuslugu on otseühenduses Jean-Luc Godardi ja Jacques Demy loominguga.',
    articleSlug: 'nouvelle',
    mood: 'Melanhoolne mäss',
    tags: ['uus laine', 'jazz', 'vabadus']
  },
  {
    id: 'strangerthings-jaws',
    modern: 'Stranger Things / Super 8',
    modernDirector: 'Duffer Brothers / J. J. Abrams',
    modernImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    classic: 'Lõuad (1975) & Kolmanda astme lähikontaktid',
    classicDirector: 'Steven Spielberg',
    classicImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    connectionTitle: 'Suveblokbasterite kuldajastu: lapselik ime kohtub tundmatu ohuga',
    whyWatch: 'Kogu kaasaegne 80ndate nostalgiabuum põhineb Steven Spielbergi suvefilmide valemil: tavalised inimesed silmitsi millegi müstilise ja hirmuäratavaga, mida saadab emotsionaalne orkestrimuusika.',
    articleSlug: 'blockbuster',
    mood: 'Nostalgiline seiklus',
    tags: ['kassahitid', 'põnevik', 'nostalgia']
  }
];

export const curatedRoadmaps = [
  {
    slug: 'weekend-crash-course',
    title: 'Kinomaani kiirkursus nädalavahetuseks',
    subtitle: 'Kuidas mõista filmikunsti arengut kolme suure pöördepunkti kaudu.',
    category: 'curated_list',
    steps: [
      {
        step: 1,
        era: '1895—1927',
        title: 'Õpi vaatama vaikust',
        targetArticle: 'silent',
        film: 'Reis Kuule (1902) & Metropolis (1927)',
        focus: 'Märka, kuidas valgus, grimass ja montaaž asendavad sõnu.'
      },
      {
        step: 2,
        era: '1958—1968',
        title: 'Mura reegleid kaameraga',
        targetArticle: 'nouvelle',
        film: 'Hingeldades (1960)',
        focus: 'Koge hüppelist montaaži (jump cut) ja vabadust stuudio reeglitest.'
      },
      {
        step: 3,
        era: '1975—1999',
        title: 'Tunneta suurt ekraani',
        targetArticle: 'blockbuster',
        film: 'Lõuad (1975)',
        focus: 'Analüüsi, kuidas heli ja tempo loovad globaalse massielamuse.'
      }
    ]
  },
  {
    slug: 'rebel-auteurs',
    title: 'Mässajate ja visionääride teekond',
    subtitle: 'Režissöörid, kes muutsid filmikunsti igaveseks reeglite purustamisega.',
    category: 'curated_list',
    steps: [
      {
        step: 1,
        era: '1920ndad',
        title: 'Ekspressionistlik hullus',
        targetArticle: 'silent',
        film: 'Doktor Caligari kabinet (1920)',
        focus: 'Moonutatud reaalsus ja subjektiivne psühholoogia.'
      },
      {
        step: 2,
        era: '1960ndad',
        title: 'Pariisi boheemlaste mäss',
        targetArticle: 'nouvelle',
        film: 'Neljasada lööki (1959)',
        focus: 'Tõeline elu ilma lavastatud võltshääleta.'
      }
    ]
  }
];

export const roadmapsMoods = ['Kõik meeleolud', 'Eepiline pinge', 'Sünge psühholoogia', 'Melanhoolne mäss', 'Nostalgiline seiklus'];

export async function getRoadmapsHandler(req, res) {
  try {
    res.json({
      bridges: modernBridges,
      roadmaps: curatedRoadmaps,
      moods: roadmapsMoods
    });
  } catch {
    res.status(500).json({ error: 'Kinoteede laadimine ebaõnnestus.' });
  }
}

export async function getRoadmapDetailHandler(req, res) {
  const { slug } = req.params;
  const roadmap = curatedRoadmaps.find((r) => r.slug === slug);
  if (!roadmap) {
    return res.status(404).json({ error: 'Kinoteed ei leitud.' });
  }
  res.json({ roadmap });
}
