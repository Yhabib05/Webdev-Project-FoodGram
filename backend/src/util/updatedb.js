const userModel = require('../models/users.js')
const postModel = require('../models/posts.js')
const likeModel = require('../models/likes.js')
const adminModel = require('../models/admins.js')
const jws = require('jws')
const bcrypt = require('bcrypt');

// Ajouter ici les nouveaux require des nouveaux modèles
// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true })
  console.log('Base de données créée.')
  // Initialise la base avec quelques données
  // const passhash = await bcrypt.hash('123456',0)
  const TOKENSECRET  = "phelma"
  const passhash = jws.sign({header: { alg: 'HS256' }, payload: "123456", secret:TOKENSECRET});

  // NOTE: do not forget to put the actual backend url for the pictures once deployed!
  await userModel.create({
    name: 'sebastien viardot',
    email: 'Sebastien.Viardot@grenoble-inp.fr',
    passhash: passhash
  })
  await userModel.create({
    name: 'Isabele Mangini',
    email: 'Isabele.Mangini@grenoble-inp.fr',
    passhash: passhash
  })
  await userModel.create({
    name: 'Adrien Sonot',
    email: 'Adrien.Sonot@grenoble-inp.org',
    passhash: passhash
  })
  await postModel.create({
    user_id: 1,
    title: 'riz cantonnais',
    description: "Portez une casserole emplie d’eau salée à ébullition. Plongez-y le riz et laissez le cuire le temps indiqué sur l’emballage. Egouttez-le et rafraîchissez-le sous l’eau froide.Pendant ce temps, ciselez l’oignon et coupez la gousse d’ail en deux. Taillez le jambon en dés et la carotte en brunoise. Ebouillantez la brunoise de carottes 2 à 3 minutes dans de l’eau salée puis égouttez-la et rafraichissez-la.  Procédez de même avec les petits pois.Faites chauffer l’huile à feu vif dans un wok pour y faire frire les oignons et l’ail 2 à 3 minutes. Ajoutez la brunoise de carottes et laissez revenir environ 3 minutes en remuant sans cesse.  Ajoutez le jambon et les petits pois puis mélangez.  Cassez les oeufs dans le wok. Quand les blancs sont pris, brouillez les oeufs avec une spatule pour les mélanger avec les autres ingrédients. Ajoutez enfin le riz et faites frire doucement pendant 2 à 3 minutes. Déglacez avec la sauce soja puis ajoutez les cébettes ciselées. Mélangez et servez.",
    category: 'astiatique',
    difficulty: '2',
    // picture: 'http://127.0.0.1:3000/pictures/1.jpg',
    picture: 'https://foodgram.osc-fr1.scalingo.io/pictures/1.jpg',
    like_count: 2,
  })
  await postModel.create({
    user_id: 2,
    title: 'steak frites',
    description: 'Mettez les steaks à température ambiante.Pelez, lavez et taillez les pommes de terre en frites d’1 cm de section. Rincez-les et épongez-les dans un torchon propre.Faites chauffer le bain d’huile à 160 °C. faites précuire les frites 5 min sans les laisser colorer. Egouttez-les.Faites chauffer l’huile d’olive dans une poêle. Saisissez les steaks 1 min de chaque côté. Baissez le feu puis ajoutez le beurre en parcelles. Laissez reposer la viande 2 à 3 min hors du feu. Assaisonnez.Portez le bain de friture à 180 °C. Replongez les frites et laissez dorer. Egouttez sur du papier absorbant, salez et servez aussitôt avec les steaks.',
    category: 'français',
    difficulty: 1,
    // picture: 'http://127.0.0.1:3000/pictures/2.jpg',
    picture: 'https://foodgram.osc-fr1.scalingo.io/pictures/2.jpg',
    like_count: 0,
  })
  await postModel.create({
    user_id: 3,
    title: 'ile flottante',
    description: ' Séparez les blancs d’œufs des jaunes. Montez les blancs en neige bien ferme en y ajoutant une pincée de sel, puis 70 g de sucre.2 Faites frémir le lait et la vanille, et plongez-y les quenelles de blancs battus réalisées à l\'aide de deux cuillères. Laissez-les pocher 1 à 2 minutes en les retournant, puis sortez-les à l\'écumoire et posez-les sur du papier absorbant.Mal au genou après 50 ans ? Faites ceci 2 fois par jour (regardez ça). 3 Battez les jaunes d\'oeufs et le reste du sucre (100 g) jusqu\'à ce que le mélange blanchisse et soit mousseux.4 Mélangez cet appareil au lait (auquel vous avez retirez la gousse de vanille) en fouettant énergiquement. Sans jamais arriver à ébullition, chauffez à feu doux en remuant jusqu\'à ce que la crème épaississe et nappe le dos d\'une cuillère en bois. Une fois que la crème est à consistance, transvasez-la dans un plat de service ou un saladier pour que la cuisson s\'arrête. Pour finir Versez les 50 g de sucre restants dans une casserole et faites chauffer à feu doux jusqu\'à obtention d\'un caramel (vous pouvez également utiliser du caramel déjà prêt).',
    category: 'français',
    difficulty: 3,
    // picture: 'http://127.0.0.1:3000/pictures/3.jpg',
    picture: 'https://foodgram.osc-fr1.scalingo.io/pictures/3.jpg',
    like_count: 1,
  })
  await postModel.create({
    user_id: 3,
    title: 'Galette des rois',
    description: 'Fouettez le sucre et le beurre mou, puis ajoutez la poudre d\'amande. Grattez les graines de la gousse de vanille et ajoutez-les à la préparation. Ajoutez 2 oeufs entiers et le rhum ou autre (fleur d\'oranger, amande amère..). Disposez un cercle de pâte, déposez de la crème amande dessus en laissant 2 cm de pâte tout autour que vous mouillez légèrement avec un pinceau et de l\'eau. Placez la fève et recouvrez avec le deuxième disque de pâte feuilletée légèrement plus grand, souder les bords en appuyant tout autour. Battez un oeuf entier avec une pincée de sel, attendez 2 minutes et badigeonnez le dessus de la galette avec un pinceau (On peut utiliser un jaune d\'oeuf uniquement pour un résultat plus doré, ou du lait). Placez la galette au frigo 30 minutes ou 15 minutes au congélateur, sortez la, dessinez vos motifs avec une lame de couteau sans percer la pâte, dorez une seconde fois. Cuire à 180°C (four déjà chaud) pendant 30 à 40 minutes , un peu plus si la galette est grande ou si la pâte feuilletée est faite maison. Vérifiez que votre galette est cuite en la soulevant délicatement, la pâte doit être cuite en dessous, sinon prolongez',
    category: 'français',
    difficulty: 4,
    // picture: 'http://127.0.0.1:3000/pictures/4.jpg',
    picture: 'https://foodgram.osc-fr1.scalingo.io/pictures/4.jpg',
    like_count: 0,
  }),
  await likeModel.create({
    user_id: 3,
    recipe_id: 1,
  }),
  await likeModel.create({
    user_id: 2,
    recipe_id: 1,
  }),
  await likeModel.create({
    user_id: 3,
    recipe_id: 3,
  })
  await adminModel.create({
    user_id: 3,
  })

})()
