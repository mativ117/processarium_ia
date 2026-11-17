# Processarium

**Un petit monde pour comprendre le travail.**

**[Ouvrir le site](https://mativ117.github.io/processarium_ia/)** · [Dépôt](https://github.com/mativ117/processarium_ia) · [Vérifications](https://github.com/mativ117/processarium_ia/actions)

[English documentation](README.en.md) · [Application in English](https://mativ117.github.io/processarium_ia/?lang=en)

Processarium accompagne des guides avec un atelier miniature animé. On suit les rôles, les échanges, les tâches en parallèle et les décisions humaines. Chaque guide terminé enrichit une collection locale.

Le nom est un nom de travail, sans vérification de disponibilité commerciale.

## Les quatre niveaux

| Niveau | Guides | Ce qu’on découvre |
| --- | --- | --- |
| 1 · Simple | Une idée → un post ; un message → une réponse | 3 rôles, 3 étapes, un poste à la fois |
| 2 · Intermédiaire | Une réunion → un plan ; comparer pour choisir | 5 rôles, 4 étapes, 2 postes en parallèle |
| 3 · Avancé | Calque ; CoachOS | 5–6 rôles, 5 étapes, branches, intégration et contrôles |
| 4 · Expert | Production d’une évolution de jeu 3D ; assistant documentaire à grande échelle | 10–12 rôles, 9–10 étapes, jusqu’à 5 postes simultanés et plusieurs décisions humaines |

Les exemples complexes s’appuient sur les documentations publiques de [Calque](https://github.com/mativ117/calque), [CoachOS](https://github.com/mativ117/coachOS-dashboard) et [Les Royaumes de l’Éclipse](https://github.com/mativ117/royaumes-eclipse). Les fonctions documentées sont des références ; les équipes, incidents et durées sont une adaptation pédagogique, pas la reconstitution d’exécutions réelles.

L’assistant documentaire est un cas d’architecture fictif : extraction/OCR, préparation des données, recherche avec citations, droits d’accès, évaluation, charge et exploitation. Il ne décrit pas un projet déjà réalisé. Le guide expert du jeu propose une chaîne de production pédagogique, sans prétendre que ces équipes existent dans le dépôt source.

Chaque niveau contient exactement deux guides. Les prérequis aident à choisir, sans verrouiller les parcours. Le plan indique le maximum de postes simultanés et le travail prévu, calculés à partir des valeurs fictives du scénario. Les compteurs du déroulé restent distincts de ce plan. La carte s’agrandit pour les grandes équipes.

## Une scène plus facile à lire

Par défaut, l’écran privilégie la scène et le changement produit : « Ce qui arrive » puis « Ce qui a changé ». Les ressources, le glossaire et les descriptions longues sont accessibles via « Comprendre les détails ». Les rôles ont des signes et accessoires distincts. Pendant le travail, des vues animées montrent leur action : trier des fiches, écrire, scanner, vérifier, coder, assembler, concevoir ou manipuler un modèle. Ces vues illustrent les opérations, elles ne sont pas des exécutions réelles. Le travail occupe davantage de temps que la simple transmission du dossier.

## Utiliser l’atelier

- Choisir un niveau puis un guide.
- Lancer la lecture continue ou avancer étape par étape. Les personnages conservent leur position et vont chercher le dossier avant de le traiter ; aucune pause fixe ne sépare les scènes.
- Régler la vitesse entre 0,75× et 2× ; mettre en pause puis reprendre au même endroit.
- Inspecter un poste en le touchant dans la scène ou en choisissant son rôle sous la carte.
- Déplacer la carte au doigt ou à la souris ; utiliser les boutons pour zoomer et recentrer.
- À la fin, valider le guide ou demander une correction, puis vérifier à nouveau.
- Retrouver les personnages et les guides terminés dans « Ma collection ».

La lecture s’arrête aux étapes de validation humaine. La préférence système de réduction des mouvements supprime les déplacements animés. Les contrôles et les résultats restent utilisables au clavier sans interagir avec le canevas.

La scène distingue **transmission**, **travail** et **résultat**. Un résumé explique qui intervient et ce qui change. La carte reste à sa place pendant les transitions ; sur téléphone, les explications détaillées se trouvent sous la lecture. Un glossaire explique notamment OCR, CPU/GPU, index et tests de non-régression.

## Plein écran et inventaire

Le bouton « Plein écran » conserve la lecture, la pause et la vitesse. On sort par le bouton ou Échap ; si le plein écran natif est indisponible ou refusé, une vue agrandie avec gestion du focus et du défilement prend le relais. Les contrôles du navigateur permettent aussi de quitter le mode natif.

L’inventaire de chaque étape distingue agents rédactionnels, techniques, coordinateurs, de recherche, de conception, de contrôle et de livraison, et rôles logiciels locaux. Les outils sont nommés séparément. Les quantités affichées proviennent du scénario : effectifs, nombre d’outils, secondes de travail prévues et, pour Calque, pages texte/OCR selon la variante choisie. CPU, GPU et mémoire sont des types de ressources à prévoir ; aucune quantité matérielle ni coût réel n’est mesuré.

## Langues

Les versions **française et anglaise** sont rédigées pour l’application : interface, guides, rôles, résultats, ressources et aides. Les boutons FR/EN changent la langue sans recommencer le processus ni effacer la collection. `?lang=fr` et `?lang=en` donnent des liens partageables ; le choix est enregistré dans ce navigateur.

**Autres langues** propose de générer une édition avec l’API `Translator` du navigateur, lorsqu’elle est disponible. Saisir un code de langue, par exemple `es`, `de`, `ar` ou `ja`. La disponibilité dépend du navigateur, de l’appareil et du couple de langues ; **la prise en charge de toutes les langues n’est pas garantie**. Le navigateur peut demander de télécharger un modèle. Certains navigateurs, notamment ceux sans cette API, ne pourront pas générer de traduction depuis l’application ; ils peuvent proposer leur propre commande « Traduire la page ».

Une édition automatique porte un avertissement permanent : elle peut comporter des erreurs et n’a pas le statut des références FR/EN. Elle n’est activée qu’après traduction complète, pour éviter une interface partiellement traduite. Annulation, langue non prise en charge, échec ou délai dépassé conservent la langue précédente. Les codes, identifiants, nombres et liens du scénario ne sont pas traduits. Les langues de droite à gauche adaptent le sens de lecture. Les éditions générées restent en mémoire pour la session ; un rechargement revient à la langue principale choisie. Aucun service tiers ou clé d’API n’est nécessaire.

## Ce que la démonstration mesure

Les secondes sont des valeurs fictives de scénario. La durée d’une étape parallèle correspond à son temps écoulé ; le travail cumulé additionne les contributions. Les secondes affichées ne correspondent pas au temps de lecture accéléré de l’animation. Aucun coût réel ni consommation mémoire mesurée n’est affiché.

Le simulateur n’exécute aucun agent IA et ne modifie aucun projet, document ou dépôt. Les personnages du parcours Calque représentent notamment des moteurs et outils locaux, pas tous des agents IA conversationnels.

## Lancer en local

Node.js 22+ pour les vérifications et la construction ; Python 3 pour le serveur local.

```sh
npm run dev
```

Ouvrir http://127.0.0.1:8000. Aucun `npm install` n’est nécessaire : l’application n’a pas de dépendance JavaScript externe.

Après construction, `dist/preview.html` est aussi un aperçu autonome qui peut s’ouvrir directement dans un navigateur, sans serveur. La version publiée regroupe les modules dans un script et utilise des noms de fichiers liés au contenu pour que les mises à jour ne mélangent pas anciens scripts et nouvelle interface dans le cache du navigateur.

```sh
npm run check
npm run build
python3 -m http.server 8000 --directory dist --bind 127.0.0.1
```

## Tests navigateur

```sh
python3 -m pip install -r tests/requirements.txt
python3 -m playwright install chromium
npm test
```

Un Chromium système peut être utilisé avec `CHROMIUM_PATH=/usr/bin/chromium npm test`. Les tests couvrent les huit guides, les corrections, la persistance, les branches PDF et les formats mobile/ordinateur, ainsi que la continuité des positions entre scènes, la pause/reprise, les vitesses, les références FR/EN et le changement de langue pendant la lecture. Des doublures de l’API navigateur vérifient succès, indisponibilité, échec partiel, annulation et interface RTL ; elles ne certifient ni la qualité d’une traduction automatique réelle ni les langues proposées par un appareil. Les captures sont écrites dans `test-results/` et ne sont pas versionnées. Les essais Chromium ne remplacent pas une validation Safari sur iPhone réel.

## Publier sur GitHub Pages

Le dépôt du projet est [mativ117/processarium_ia](https://github.com/mativ117/processarium_ia). Pour récupérer les sources :

```sh
git clone https://github.com/mativ117/processarium_ia.git
cd processarium_ia
npm run dev
```

Le dépôt est configuré pour **Deploy from a branch → `main` → `/docs`**. Le dossier `docs/` contient le site construit et le fichier `.nojekyll` : GitHub sert les fichiers directement, sans générer de site Jekyll. Le site public est https://mativ117.github.io/processarium_ia/.

Après une modification des sources, préparer l’export puis vérifier les parcours :

```sh
npm run check
npm run pages
npm test
git add src index.html favicon.svg docs
git commit -m "Update Processarium"
git push
```

Versionner les sources modifiées et `docs/` ensemble. Le workflow « Vérifier Processarium » reconstruit le site, vérifie que `docs/` correspond exactement au résultat et exécute les tests navigateur. GitHub gère ensuite la publication de `main /docs` avec son workflow Pages. Les chemins relatifs permettent de servir l’application sous `/processarium_ia/`.

## Données et confidentialité

Aucun CDN, suivi, compte ou appel à un service d’IA distant dans l’application. Les modules, polices système et dessins sont servis avec le site. La traduction optionnelle est traitée par l’API locale du navigateur, qui gère ses éventuels téléchargements de modèles. La collection, les étapes, la langue principale et la vitesse sont enregistrées dans `localStorage` sur cet appareil, sans synchronisation. Effacer les données du navigateur efface la collection. Si le stockage est indisponible, l’atelier fonctionne en mémoire et le signale dans la collection. L’hébergeur peut journaliser les visites.

## Structure

```text
index.html             Interface et contrôles accessibles
src/style.css          Identité visuelle et mise en page adaptative
src/world.js           Monde en perspective, dessins et déplacements
src/processes.js       Rôles, guides et données pédagogiques
src/content-en.js      Textes anglais des rôles et des huit guides
src/i18n.js            Références FR/EN et traduction locale optionnelle
src/app.js             Simulation, décisions et collection
scripts/build.mjs      Construction statique sans dépendance
scripts/pages.mjs      Export et vérification du site publié
docs/                  Site construit, versionné et servi par GitHub Pages
tests/browser.py       Parcours de validation dans Chromium
tests/motion.test.mjs   Continuité des déplacements et couverture linguistique
tests/languages.py     Langues, lecture continue et cas d’échec de traduction
.github/workflows/     Publication GitHub Pages
```

Les dessins sont créés dans le code ; aucun visuel de la vidéo de référence n’est réutilisé. Aucune licence de redistribution n’a encore été choisie pour ce projet.
