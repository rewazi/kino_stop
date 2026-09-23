export const quizData = {
  archetypes: {
    nouvelle: {
      id: 'nouvelle',
      title: 'Prantsuse Uue Laine Mässaja',
      subtitle: 'Jean-Luc Godardi ja François Truffaut’ vaimusugulane',
      motto: '„Film ei pea järgima reegleid. Film peab elama.“',
      description: 'Sinu jaoks on filmikunst vahetu, isiklik ja vaba akadeemilistest ahelatest. Sa eelistad loomulikku valgust stuudiolampidele, tänavakohvikuid suletud võtteplatsidele ja julgeid hüppeid montaažis siledale jutustusele. Sa tead, et kunst sünnib seal, kus reegleid rikutakse.',
      strengths: ['Spontaansus ja julgus', 'Ikooniline stiilitunnetus', 'Filosoofiline sügavus argielus'],
      directors: 'Jean-Luc Godard, Agnès Varda, François Truffaut',
      relatedSlug: 'nouvelle',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=85'
    },
    expressionist: {
      id: 'expressionist',
      title: 'Saksa Ekspressionismi Visionäär',
      subtitle: 'Fritz Langi ja Robert Wiene mantlipärija',
      motto: '„Kaader peab peegeldama inimese hinge sügavamaid labürinte.“',
      description: 'Sinu maailm on täis teravaid nurki, dramaatilisi varje ja psühholoogilist pinget. Sind paeluvad alateadvus, müstika, suurlinna külm arhitektuur ja inimese sisemine heitlus valguse ja pimeduse vahel. Iga kaader sinu nägemuses on nagu ekspressionistlik maal.',
      strengths: ['Visuaalne meisterlikkus ja varjudemäng', 'Ruumitaju ja arhitektuur', 'Sügav psühholoogiline alltekst'],
      directors: 'Fritz Lang, F. W. Murnau, Robert Wiene, Tim Burton',
      relatedSlug: 'silent',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=85'
    },
    pioneer: {
      id: 'pioneer',
      title: 'Tummfilmi Teerajaja',
      subtitle: 'Georges Mélièsi ja Sergei Eisensteini maagia kandja',
      motto: '„Pilt on võimsam kui tuhat sõna. Montaaž on filmi pulss.“',
      description: 'Sa usud kino puhtasse visuaalsesse jõudu. Sinu jaoks ei vaja tõeline emotsioon pikki dialooge — piisab näitleja pilgust, rütmilisest kaadrite kõrvutamisest ja visuaalsest illusioonist. Sa oled looja ja leiutaja, kes näeb kaameras imede lavastamise vahendit.',
      strengths: ['Puhas visuaalne jutustamisoskus', 'Montaažirütmi täiuslik valdamine', 'Mängulisus ja illusioon'],
      directors: 'Georges Méliès, Buster Keaton, Sergei Eisenstein, Charlie Chaplin',
      relatedSlug: 'silent',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1000&q=85'
    },
    maestro: {
      id: 'maestro',
      title: 'Klassikalise Kinokunsti Meisterlavastaja',
      subtitle: 'Steven Spielbergi ja Alfred Hitchcocki koolkond',
      motto: '„Kino on kollektiivne unistus suurel ekraanil.“',
      description: 'Sa valdad suure ekraani emotsioone, mastaapi ja narratiivi laitmatult. Sa tead täpselt, millal panna vaataja süda puperdama, millal tuua sisse sümfooniaorkestri võimas crescendo ja kuidas luua universaalseid lugusid, mis liidavad saalitäie võõraid inimesi ühtseks tervikuks.',
      strengths: ['Suurejooneline mastaabitunnetus', 'Pingekruvimise meisterlikkus', 'Universaalne emotsionaalne side'],
      directors: 'Alfred Hitchcock, Steven Spielberg, Stanley Kubrick, Christopher Nolan',
      relatedSlug: 'blockbuster',
      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1000&q=85'
    }
  },
  questions: [
    {
      id: 1,
      text: 'Milline valgus ja visuaalne atmosfäär kõnetab sind filmis kõige rohkem?',
      options: [
        {
          text: 'Pariisi tänavate loomulik päevavalgus, käsikaamera kerge värin ja vahetu elutunnetus.',
          archetype: 'nouvelle'
        },
        {
          text: 'Mustvalge terav kontrast, moonutatud varjud ja geomeetriliselt ranged ruumid.',
          archetype: 'expressionist'
        },
        {
          text: 'Salapärane teatraalne valgus, maagilised suitsuefektid ja käsitsi maalitud dekoratsioonid.',
          archetype: 'pioneer'
        },
        {
          text: 'Laiaekraaniline lopsakas kinematograafia, sügav fookus ja suurejooneline Hollywoodi sära.',
          archetype: 'maestro'
        }
      ]
    },
    {
      id: 2,
      text: 'Kuidas peaks sinu meelest toimima filmi montaaž?',
      options: [
        {
          text: 'Ootamatud hüpped (jump cut), reegleid eirav vaba rütm, mis tuletab meelde, et vaatad filmi.',
          archetype: 'nouvelle'
        },
        {
          text: 'Rõhuv ja pingestatud rütm, mis kruvib hirmu ning rõhutab ruumi klaustrofoobiat.',
          archetype: 'expressionist'
        },
        {
          text: 'Intellektuaalne kaadrite põrkumine — kahe pildi liitmisest sünnib peas kolmas mõte.',
          archetype: 'pioneer'
        },
        {
          text: 'Täiuslikult sujuv, nähtamatu narratiivne montaaž, mis haarab vaataja täielikult loo sisse.',
          archetype: 'maestro'
        }
      ]
    },
    {
      id: 3,
      text: 'Mis on filmi kõige olulisem ülesanne?',
      options: [
        {
          text: 'Väljakutse esitamine ühiskonna ja kunsti tardunud normidele; vabaduse tähistamine.',
          archetype: 'nouvelle'
        },
        {
          text: 'Inimese alateadvuse ja psühholoogiliste kriiside peegeldamine visuaalses vormis.',
          archetype: 'expressionist'
        },
        {
          text: 'Ime ja illusiooni loomine: viia inimene uude visuaalsesse dimensiooni ilma sõnadeta.',
          archetype: 'pioneer'
        },
        {
          text: 'Kollektiivse katarsise pakkumine ja unustamatu mastaapse elamuse loomine tuhandetele.',
          archetype: 'maestro'
        }
      ]
    },
    {
      id: 4,
      text: 'Vali oma ideaalne võttepaik:',
      options: [
        {
          text: 'Kohvikunurk Boulevard Saint-Germainil või vihmane Seine’i kallas.',
          archetype: 'nouvelle'
        },
        {
          text: 'Sünge futuristlik stuudio, labürintlikud trepid ja gootilikud tornid.',
          archetype: 'expressionist'
        },
        {
          text: 'Võlukunstniku ateljee, liikuv rong või unikaalselt ehitatud trikilava.',
          archetype: 'pioneer'
        },
        {
          text: 'Avameri, kosmosejaam või mastaapne ajalooline linnatänav.',
          archetype: 'maestro'
        }
      ]
    },
    {
      id: 5,
      text: 'Milline helimaailm viib filmi täiuslikkuseni?',
      options: [
        {
          text: 'Spontaanne jazz, taustal kostuv tänavakära ja kohvikutasside klirin.',
          archetype: 'nouvelle'
        },
        {
          text: 'Kõhedust tekitav vaikus, mida katkestavad kummalised kajad ja teravad akordid.',
          archetype: 'expressionist'
        },
        {
          text: 'Elav klaverisaade kinosaalis, kus vaikus kõneleb valjemini kui ükski dialoog.',
          archetype: 'pioneer'
        },
        {
          text: 'Täies koosseisus sümfooniaorkestri võimas, unustamatu juhtmotiiv.',
          archetype: 'maestro'
        }
      ]
    }
  ]
};

export async function getQuizHandler(req, res) {
  try {
    res.json(quizData);
  } catch {
    res.status(500).json({ error: 'Kinoarhetüüpide testi laadimine ebaõnnestus.' });
  }
}
