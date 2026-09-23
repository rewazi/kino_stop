import { pool } from './config.js';

export const curatedChallenges = [
  {
    title: 'Hingeldades',
    year: '1960',
    director: 'Jean-Luc Godard',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85',
    hint1: 'Ajastu: 1960. aastad, Prantsuse uus laine ja nooruslik mäss.',
    hint2: 'Žanr: Kriminaaldraama, käsikaamera tänaval ja kuulus jump-cut montaaž.',
    hint3: 'Režissöör: Jean-Luc Godard; peaosades Jean-Paul Belmondo ja Jean Seberg.',
    hint4: 'Ikooniline tsitaat: „Elu ja surma vahel valin ma alati kire.“',
    articleSlug: 'nouvelle',
    fact: 'Godardi debüütfilm muutis jäädavalt arusaama filmikeelest, loobudes akadeemilisest montaažist.'
  },
  {
    title: 'Reis kuule',
    year: '1902',
    director: 'Georges Méliès',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
    hint1: 'Ajastu: 1900. aastate algus, tummfilmi ja kino algusaastad.',
    hint2: 'Žanr: Esimene tõeline teadusulme ja fantaasiafilm lavastatud efektidega.',
    hint3: 'Lavastaja: Prantsuse mustkunstnik ja visuaalsete illusioonide meister Georges Méliès.',
    hint4: 'Võtmekujund: Kahurimürsk, mis maandub otse naeratava Kuu silmas.',
    articleSlug: 'silent',
    fact: 'Méliès kasvatas filmikunstist trikkide, stop-motioni ja topeltsärituse maagia.'
  },
  {
    title: 'Lõuad',
    year: '1975',
    director: 'Steven Spielberg',
    image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=85',
    hint1: 'Ajastu: 1970. aastad, esimese suve-kassahiti sünd Hollywoodis.',
    hint2: 'Žanr: Põnevik ookeanist, mis hoidis terve põlvkonna rannast eemal.',
    hint3: 'Lavastaja: Steven Spielberg; meeldejääv kahe noodi motiiv John Williamsilt.',
    hint4: 'Ikooniline tsitaat: „Meil läheb vaja suuremat paati.“ (You\'re gonna need a bigger boat)',
    articleSlug: 'blockbuster',
    fact: 'Film teenis esimesena üle 100 miljoni dollari ja lõi suvise kinolevi mudeli.'
  },
  {
    title: 'Metropolis',
    year: '1927',
    director: 'Fritz Lang',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85',
    hint1: 'Ajastu: 1920. aastate lõpp, Saksa ekspressionismi tippteos.',
    hint2: 'Žanr: Tulevikulinn, monumentaalne arhitektuur, töölised ja robot-naine.',
    hint3: 'Lavastaja: Fritz Lang, ulmeline megalopolis ja futuristlik sotsiaaldraama.',
    hint4: 'Moraal: „Vahendaja pea ja käte vahel peab olema süda.“',
    articleSlug: 'silent',
    fact: 'Metropolis oli oma aja kalleim filmiprojekt, mille visuaalne disain inspireeris hiljem „Blade Runnerit“.'
  },
  {
    title: 'Soomuslaev Potjomkin',
    year: '1925',
    director: 'Sergei Eisenstein',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=85',
    hint1: 'Ajastu: 1920. aastate tummfilm ja Nõukogude montaažikoolkond.',
    hint2: 'Žanr: Ajalooline revolutsiooniline draama ja intellektuaalne montaaž.',
    hint3: 'Lavastaja: Sergei Eisenstein, montaaž kui visuaalsete konfliktide kokkupõrge.',
    hint4: 'Võtmekaader: Odessa treppidel allaveerev lapsevanker.',
    articleSlug: 'silent',
    fact: 'Odessa treppide montaažiseeria kuulub kinoloo enim tsiteeritud ja analüüsitud episoodide hulka.'
  },
  {
    title: 'Tagaaken',
    year: '1954',
    director: 'Alfred Hitchcock',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=85',
    hint1: 'Ajastu: 1950. aastate kuldajastu põnevusfilm.',
    hint2: 'Žanr: Psühholoogiline müsteerium, voyeurism ja vaatlemise kunst.',
    hint3: 'Lavastaja: Alfred Hitchcock; peaosades James Stewart ja Grace Kelly.',
    hint4: 'Võtmekujund: Ratastoolis fotograaf teleobjektiiviga vaatamas naabermaja akendesse.',
    articleSlug: null,
    fact: 'Film uurib kino olemust ennast — vaataja on samamoodi piiluja nagu loo peategelane.'
  }
];

export const allMovieTitles = curatedChallenges.map((c) => c.title).concat([
  'Kodanik Kane',
  'Päikesetõus',
  'Suurlinna tuled',
  'Kuninglik lahing',
  'Blade Runner',
  'Kasablanca',
  '2001: Kosmoseodüsseia',
  'Seitse samuraid',
  'Hingetu',
  'Neljasada lööki',
  'Taksist',
  'Apokalüpsis täna'
]).sort((a, b) => a.localeCompare(b, 'et'));

export function getTodayChallengeIndex(date = new Date()) {
  const start = new Date(2026, 0, 1);
  const diffTime = Math.abs(date.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays % curatedChallenges.length;
}

export function getChallengeDayNumber(date = new Date()) {
  const start = new Date(2026, 0, 1);
  const diffTime = Math.abs(date.getTime() - start.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export async function getDailyChallengeHandler(req, res) {
  try {
    const todayIndex = getTodayChallengeIndex();
    const dayNumber = getChallengeDayNumber();
    const challenge = curatedChallenges[todayIndex];

    const todayStr = new Date().toISOString().slice(0, 10);

    res.json({
      dayNumber,
      date: todayStr,
      image: challenge.image,
      allTitles: allMovieTitles,
      maxAttempts: 5,
      hints: [
        challenge.hint1,
        challenge.hint2,
        challenge.hint3,
        challenge.hint4
      ]
    });
  } catch {
    res.status(500).json({ error: 'Päeva kaadri laadimine ebaõnnestus.' });
  }
}

export async function guessDailyChallengeHandler(req, res) {
  try {
    const guess = String(req.body?.guess || '').trim().toLowerCase();
    const todayIndex = getTodayChallengeIndex();
    const challenge = curatedChallenges[todayIndex];
    const isCorrect = guess === challenge.title.toLowerCase();

    if (isCorrect) {
      return res.json({
        isCorrect: true,
        title: challenge.title,
        year: challenge.year,
        director: challenge.director,
        articleSlug: challenge.articleSlug,
        fact: challenge.fact,
        message: `Õige! See on „${challenge.title}“ (${challenge.year}, rež. ${challenge.director}).`
      });
    }

    res.json({
      isCorrect: false,
      message: 'Vale vastus. Proovi uuesti või ava järgmine vihje!'
    });
  } catch {
    res.status(500).json({ error: 'Pakkumise kontrollimine ebaõnnestus.' });
  }
}
