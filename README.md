# Processarium

**Un petit monde pour comprendre le travail.**

Processarium accompagne des guides avec un atelier miniature animé. On suit les rôles, les échanges, les tâches en parallèle et les décisions humaines. Chaque guide terminé enrichit une collection locale.

Le nom est un nom de travail, sans vérification de disponibilité commerciale.

## Les trois niveaux

| Niveau | Guides | Ce qu’on découvre |
| --- | --- | --- |
| Simple | Une idée → un post ; un message → une réponse | Transmissions, rédaction et relecture |
| Intermédiaire | Une réunion → un plan ; comparer pour choisir | Coordination, informations manquantes, analyses parallèles |
| Complexe | Calque ; CoachOS ; Les Royaumes de l’Éclipse | Branches, métiers, intégration, tests et corrections |

Les exemples complexes s’appuient sur les documentations publiques de [Calque](https://github.com/mativ117/calque), [CoachOS](https://github.com/mativ117/coachOS-dashboard) et [Les Royaumes de l’Éclipse](https://github.com/mativ117/royaumes-eclipse). Les fonctions documentées sont des références ; les équipes, incidents et durées sont une adaptation pédagogique, pas la reconstitution d’exécutions réelles.

## Utiliser l’atelier

- Choisir un niveau puis un guide.
- Lancer la lecture automatique ou avancer étape par étape.
- Inspecter un poste en le touchant dans la scène ou en choisissant son rôle sous la carte.
- Déplacer la carte au doigt ou à la souris ; utiliser les boutons pour zoomer et recentrer.
- À la fin, valider le guide ou demander une correction, puis vérifier à nouveau.
- Retrouver les personnages et les guides terminés dans « Ma collection ».

La lecture s’arrête aux étapes de validation humaine. La préférence système de réduction des mouvements supprime les déplacements animés. Les contrôles et les résultats restent utilisables au clavier sans interagir avec le canevas.

## Ce que la démonstration mesure

Les secondes sont des valeurs fictives de scénario. La durée d’une étape parallèle correspond à son temps écoulé ; le travail cumulé additionne les contributions. Les secondes affichées ne correspondent pas au temps de lecture accéléré de l’animation. Aucun coût réel ni consommation mémoire mesurée n’est affiché.

Le simulateur n’exécute aucun agent IA et ne modifie aucun projet, document ou dépôt. Les personnages du parcours Calque représentent notamment des moteurs et outils locaux, pas tous des agents IA conversationnels.

## Lancer en local

Node.js 22+ pour les vérifications et la construction ; Python 3 pour le serveur local.

```sh
npm run dev
```

Ouvrir http://127.0.0.1:8000. Aucun `npm install` n’est nécessaire : l’application n’a pas de dépendance JavaScript externe.

Après construction, `dist/preview.html` est aussi un aperçu autonome qui peut s’ouvrir directement dans un navigateur, sans serveur. La version publiée utilise les modules séparés de `index.html`.

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

Un Chromium système peut être utilisé avec `CHROMIUM_PATH=/usr/bin/chromium npm test`. Les tests couvrent les sept guides, les corrections, la persistance, les branches PDF, la lecture/pause et les formats mobile/ordinateur. Les captures sont écrites dans `test-results/` et ne sont pas versionnées. Les essais Chromium ne remplacent pas une validation Safari sur iPhone réel.

## Publier sur GitHub Pages

Le dépôt du projet est [mativ117/processarium_ia](https://github.com/mativ117/processarium_ia). Pour récupérer les sources :

```sh
git clone https://github.com/mativ117/processarium_ia.git
cd processarium_ia
npm run dev
```

Dans **Settings → Pages → Source**, choisir **GitHub Actions**. Le workflow inclus construit le dossier `dist` puis le publie. Si le premier workflow a démarré avant l’activation de Pages, le relancer depuis Actions. Les chemins sont relatifs : le site fonctionne sous `/processarium_ia/`. L’adresse prévue est https://mativ117.github.io/processarium_ia/ ; sa disponibilité dépend d’un déploiement Pages réussi.

## Données et confidentialité

Aucun CDN, suivi, compte ou appel d’IA. Les modules, polices système et dessins sont locaux au site. La collection et les étapes sont enregistrées dans `localStorage` sur cet appareil, sans synchronisation. Effacer les données du navigateur efface la collection. Si le stockage est indisponible, l’atelier fonctionne en mémoire et le signale dans la collection. L’hébergeur peut journaliser les visites.

## Structure

```text
index.html             Interface et contrôles accessibles
src/style.css          Identité visuelle et mise en page adaptative
src/world.js           Monde en perspective, dessins et déplacements
src/processes.js       Rôles, guides et données pédagogiques
src/app.js             Simulation, décisions et collection
scripts/build.mjs      Construction statique sans dépendance
tests/browser.py       Parcours de validation dans Chromium
.github/workflows/     Publication GitHub Pages
```

Les dessins sont créés dans le code ; aucun visuel de la vidéo de référence n’est réutilisé. Aucune licence de redistribution n’a encore été choisie pour ce projet.
