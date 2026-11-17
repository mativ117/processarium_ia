(()=>{
const agents={
      tri:{name:'Le trieur',icon:'list-filter',detail:'Repère les informations utiles, les demandes et ce qui manque.'},
      red:{name:'Le rédacteur',icon:'pencil',detail:'Transforme les éléments retenus en un brouillon adapté au destinataire.'},
      rel:{name:'Le relecteur',icon:'check-check',detail:'Vérifie la cohérence, signale les incertitudes et prépare la validation humaine.'},
      plan:{name:'Le coordinateur',icon:'route',detail:'Découpe le travail, distribue les tâches et attend les dépendances.'},
      rech:{name:'Le chercheur',icon:'search',detail:'Rassemble les sources disponibles et distingue les faits des hypothèses.'},
      design:{name:'Le concepteur',icon:'panels-top-left',detail:'Prépare la structure, les interactions ou les règles à implémenter.'},
      code:{name:'Le développeur',icon:'code',detail:'Implémente une fonction à partir de la conception et corrige les défauts signalés.'},
      test:{name:'Le testeur',icon:'flask-conical',detail:'Teste des cas normaux et des cas limites ; un test réussi reste limité à ce qui a été vérifié.'},
      lecture:{name:'Le lecteur PDF',icon:'scan-text',kind:'Moteur local',detail:'Extrait le texte natif ou reconnaît les caractères des pages scannées. Ce poste représente un moteur, pas un agent IA conversationnel.'},
      export:{name:'L’assembleur',icon:'package',kind:'Outil local',detail:'Assemble une sortie et vérifie sa structure ; cela ne garantit pas sa fidélité visuelle.'},
      art:{name:'L’artiste 3D',icon:'box',detail:'Prépare les modèles, les animations et leur intégration dans la scène.'},
      arch:{name:'L’architecte',icon:'network',detail:'Définit les interfaces, les dépendances et les choix de structure avant que les équipes construisent.'},
      data:{name:'L’ingénieur données',icon:'database',detail:'Nettoie les données, conserve leur provenance et prépare des index reproductibles.'},
      perf:{name:'Le spécialiste performance',icon:'gauge',detail:'Étudie le temps de calcul, les allocations mémoire et les limites des appareils ; mesure avant d’optimiser.'},
      ops:{name:'Le responsable livraison',icon:'rocket',detail:'Prépare une version, ses contrôles, son suivi et un retour arrière ; la décision de publier reste humaine.'},
      security:{name:'L’auditeur sécurité',icon:'shield-check',detail:'Vérifie les accès, la séparation des données et les comportements face aux contenus non fiables.'},
      eval:{name:'L’évaluateur',icon:'clipboard-check',detail:'Prépare des questions et des résultats attendus, compare les variantes et repère les régressions.'}
    };
    const stage=(name,actors,output,seconds,effort,resource,human=false)=>({name,actors,output,seconds,effort,resource,human});
const guides=[
      {id:'publication',level:0,name:'D’une note à une publication',shape:'Une chaîne courte',input:'Une idée de départ : regrouper ses petites tâches pour limiter les interruptions. Ajouter un exemple concret.',steps:[
        stage('Trier',['tri'],'Idée retenue : regrouper les tâches similaires. Exemple : répondre aux messages dans un créneau dédié.',12,12,'Un appel IA illustratif.'),
        stage('Rédiger',['red'],'Les petites tâches fragmentent la journée. Essayez de les regrouper : un créneau pour les messages, un autre pour les démarches.',24,24,'Un appel IA illustratif.'),
        stage('Relire',['rel'],'Pour limiter les interruptions, regroupez les tâches similaires dans un créneau dédié. À adapter aux urgences de votre activité.',12,12,'Un appel IA illustratif ; contenu à valider.')],fix:'Version raccourcie : regroupez les petites tâches similaires, en gardant une exception pour les urgences.',result:'Publication prête'},
      {id:'reponse',level:0,name:'D’un message à une réponse',shape:'Une chaîne courte',input:'Bonjour, avez-vous reçu mon dossier ? Quelles pièces dois-je encore fournir ?',steps:[
        stage('Trier',['tri'],'Deux demandes : réception du dossier et pièces manquantes. Ces deux informations ne sont pas fournies.',12,12,'Un appel IA illustratif.'),
        stage('Rédiger',['red'],'Bonjour, je vérifie la réception de votre dossier et la liste des pièces à fournir, puis reviens vers vous.',24,24,'Un appel IA illustratif.'),
        stage('Relire',['rel'],'La réponse ne prétend pas que le dossier a été reçu. Il reste à vérifier les faits avant un envoi réel.',12,12,'Un appel IA illustratif ; aucun message envoyé.')],fix:'Réponse courte : Bonjour, je vérifie ces deux points et reviens vers vous. Bonne journée.',result:'Réponse prête, non envoyée'},
      {id:'reunion',level:1,name:'D’une réunion à un plan d’action',shape:'Répartition → travail parallèle → synthèse',input:'Notes fictives : préparer une démo vendredi. Lina vérifie les chiffres. La page d’accueil est à revoir ; personne n’est encore désigné.',steps:[
        stage('Découper',['plan'],'Séparer les décisions, les tâches et les points qui demandent une confirmation.',15,15,'Un appel IA illustratif.'),
        stage('Analyser en parallèle',['tri','rech'],'Décision : démo vendredi. Action : chiffres à vérifier par Lina. Point manquant : responsable de la page d’accueil.',25,45,'Deux appels IA illustratifs ; les deux postes partagent les notes.'),
        stage('Assembler',['red'],'Plan : Lina vérifie les chiffres ; la page d’accueil reste à attribuer ; l’horaire de la démo est à préciser.',22,22,'Un appel IA illustratif.'),
        stage('Confirmer',['rel','plan'],'Les informations absentes restent indiquées « à confirmer ». Le plan peut être validé sans inventer d’engagement.',18,30,'Deux appels IA illustratifs ; validation humaine ensuite.')],fix:'Correction : distinguer « avant vendredi » et « vendredi ». L’échéance précise des chiffres reste à confirmer.',result:'Plan d’action prêt'},
      {id:'comparatif',level:1,name:'Comparer des solutions avant de choisir',shape:'Sources → analyses parallèles → arbitrage',input:'Choisir un outil de prise de notes avec trois critères : export, accès hors ligne et coût. Les données de cet exemple sont fictives.',steps:[
        stage('Cadrer',['plan'],'Critères retenus : récupérer ses données, travailler sans réseau et connaître les frais récurrents.',18,18,'Un appel IA illustratif.'),
        stage('Rassembler',['rech'],'Fiches fictives : A exporte en Markdown, B exporte en PDF ; le fonctionnement hors ligne et les prix restent à vérifier.',30,30,'Consultation de documents représentée, sans recherche réelle.'),
        stage('Comparer en parallèle',['tri','red'],'Analyse fonctionnelle : A facilite la réutilisation du texte. Analyse du budget : aucune conclusion sans tarifs confirmés.',28,48,'Deux analyses IA illustratives.'),
        stage('Contrôler',['rel'],'Recommandation conditionnelle : A si l’export est prioritaire ; vérifier hors ligne et tarifs avant de choisir.',16,16,'Un appel IA illustratif ; décision humaine.')],fix:'Le comparatif précise désormais la date de vérification à renseigner pour chaque tarif.',result:'Comparatif prêt à discuter'},
      {id:'calque',level:2,name:'Calque · du PDF au Word',shape:'Branchement texte / scan → contrôle → export',source:'calque',revision:2,input:'Exemple fictif : un PDF de douze pages, quatre avec du texte natif et huit scannées. Aucun document réel n’est chargé.',steps:[
        stage('Vérifier l’entrée',['plan'],'Vérifier le format, le nombre de pages et la taille. Une entrée invalide serait refusée avant conversion.',5,5,'Lecture du fichier dans le navigateur ; limites documentées : 50 Mo, 150 pages.'),
        stage('Choisir la lecture',['tri'],'Quatre pages : extraction du texte natif. Huit pages : reconnaissance de caractères. Les chemins convergent vers un texte par page.',4,4,'Rendu PDF et détection des pages ; mémoire du navigateur.'),
        stage('Lire les pages',['lecture'],'Les quatre pages de texte sont extraites ; les huit scans sont reconnus. Les mots incertains sont signalés pour relecture.',280,280,'PDF.js et Tesseract locaux ; calcul processeur et mémoire ; aucun appel à une IA distante.'),
        stage('Assembler et contrôler',['export','rel'],'Un Word est assemblé ; sa structure est vérifiée. La comparaison signale les mots incertains et la mise en page simplifiée.',12,20,'Assemblage Word et contrôle de structure. Les personnages représentent ici des fonctions du logiciel.'),
        stage('Relire les incertitudes',['rel'],'À vérifier par une personne : mot incertain, contenu manquant éventuel et présentation. Les tableaux complexes ne sont pas reconstruits.',20,20,'Temps humain simulé ; la structure valide ne garantit pas la fidélité.',true)],fix:'Le mot incertain est corrigé après comparaison avec l’original ; le Word doit être réassemblé et contrôlé.',result:'Sortie Word simulée prête'},
      {id:'coachos',level:2,name:'CoachOS · créer une fonction d’éditeur',shape:'Conception parallèle → intégration → tests → retour',source:'coachOS-dashboard',input:'Scénario pédagogique : ajouter une interaction au terrain tactile tout en préservant les systèmes sauvegardés et la présentation animée.',steps:[
        stage('Cadrer',['plan','rech'],'Relire la spécification et les formats existants. Définir ce que le geste doit changer et les données qu’il doit préserver.',35,60,'Documentation, sources et exemples de systèmes.'),
        stage('Concevoir en parallèle',['design','test'],'Conception : geste explicite sur le terrain. Cas de test : tactile, souris, annulation et conservation des anciens systèmes.',40,70,'Deux postes travaillent sur le même contrat ; outils de conception et de test.'),
        stage('Implémenter',['code'],'Interaction reliée à l’état du système ; sauvegarde locale et annulation à préserver. Une animation ne doit pas inventer de déplacement.',70,70,'React, TypeScript, stockage IndexedDB ; build local représenté.'),
        stage('Vérifier en parallèle',['test','rel'],'Vérifications : logique, formats sauvegardés et parcours Chromium. Les essais Safari et iPhone réels restent distincts.',45,80,'Tests unitaires et navigateur ; deux tâches parallèles.'),
        stage('Préparer la revue',['plan'],'Une version est prête à être revue ; publication manuelle après décision. Cette scène ne modifie ni ne publie le projet.',15,15,'Bilan de tests et aperçu ; aucune publication réelle.')],fix:'Cas illustratif : un geste annule mal le dernier tracé. Le développeur corrige, puis le testeur rejoue le cas et les vérifications liées.',result:'Fonction simulée prête pour revue'},
      {id:'eclipse',level:3,revision:2,name:'Les Royaumes de l’Éclipse · produire une évolution complète',shape:'Architecture → quatre métiers en parallèle → intégration → performance → recette',source:'royaumes-eclipse',requires:'Savoir décomposer un projet, lire un bilan de tests et distinguer calcul CPU, GPU et mémoire.',input:'Scénario expert inspiré du jeu : préparer une évolution jouable sur PC et téléphone. Il faut coordonner règles, modèles 3D, animations, sauvegarde et performance. Cette organisation est pédagogique, pas un historique réel du projet.',steps:[
        stage('Cadrer l’évolution',['plan','rech'],'Définir les objectifs, les appareils cibles et les critères d’acceptation. Distinguer le périmètre livré des idées futures.',60,100,'Conception et documentation ; deux rôles rapprochent les contraintes.'),
        stage('Dessiner les dépendances',['arch','code','perf'],'Fixer les interfaces entre campagne, combat, animation et reprise locale. Identifier les charges à mesurer sur téléphone avant de choisir des optimisations.',100,240,'Architecture, code existant et hypothèses de profilage ; trois postes en parallèle.'),
        stage('Valider le périmètre',['plan'],'Décision humaine : confirmer une tranche réalisable avant les travaux coûteux. Une idée hors périmètre retourne au carnet de conception.',45,45,'Premier point d’arbitrage humain ; aucun travail externe lancé.',true),
        stage('Construire en parallèle',['design','art','code','test'],'Quatre chantiers : règles et lisibilité ; modèles et animations ; logique de jeu ; scénarios de tests. Chacun respecte les interfaces communes.',300,980,'Blender, Three.js, sources et préparation des tests ; quatre contributions simultanées.'),
        stage('Intégrer les livrables',['arch','code','art'],'Relier modèles, contacts de combat et états de progression. Une incompatibilité d’interface bloque l’intégration et doit être corrigée avant les tests globaux.',180,450,'Reconstruction des ressources et du site ; calcul, modèles et mémoire de travail.'),
        stage('Tester et profiler',['test','perf','rel'],'Vérifier progression, reprise et commandes pendant que les performances sont étudiées. Séparer les observations Chromium des essais sur appareils réels.',240,620,'Tests navigateur, captures, temps de trame et allocations ; CPU, GPU et mémoire à mesurer réellement.'),
        stage('Corriger et vérifier',['code','art','test','perf'],'Cas fictif : un impact précède le contact et une allocation se répète. Recaler le contact, traiter l’allocation, puis reprendre les essais concernés et la non-régression.',180,580,'Quatre postes ; nouvelle construction, tests et profilage ciblé.'),
        stage('Jouer sur les appareils cibles',['plan','design'],'Recette humaine : vérifier sensations, lisibilité et fluidité sur PC et téléphone réel. Un échec renvoie à l’intégration ; les tests automatisés seuls ne suffisent pas.',120,200,'Temps humain et matériel de test ; deuxième point de décision.',true),
        stage('Préparer une version réversible',['ops','test','rel'],'Préparer une version identifiable, les preuves de test et le retour à la version précédente. La simulation ne publie rien ; la livraison réelle reste une décision explicite.',90,210,'Artefact de version, contrôle de publication et procédure de retour arrière.')],fix:'Retour expert : corriger le contact de l’arme, reconstruire les ressources et refaire les essais combat, reprise et performance avant décision.',result:'Évolution complète simulée prête pour décision'},
      {id:'documentaire',level:3,name:'Un assistant documentaire fiable à grande échelle',shape:'Accès → ingestion → index → recherche → évaluation → déploiement contrôlé',requires:'Comprendre les droits d’accès, les données, la recherche documentaire et les limites des modèles de langage.',input:'Projet expert fictif : concevoir un assistant pour un fonds documentaire volumineux et des équipes aux droits différents. Il doit citer ses sources, gérer les mises à jour et s’abstenir quand les preuves manquent. Aucun document ni service réel n’est utilisé.',steps:[
        stage('Cadrer l’usage et les limites',['plan','rech','security'],'Définir les utilisateurs, les sources autorisées, les réponses attendues et les cas où l’assistant doit s’abstenir.',90,220,'Trois rôles ; inventaire des besoins, des documents et des règles d’accès.'),
        stage('Concevoir le système et les essais',['arch','data','eval','perf'],'Définir ingestion, index, filtres d’accès et jeu d’évaluation. Planifier les essais de charge et le suivi des coûts avant d’ajouter des modèles plus lourds.',180,560,'Quatre rôles ; architecture, schémas, données d’essai et hypothèses de capacité.'),
        stage('Valider les accès et le périmètre',['plan','security'],'Décision humaine : confirmer qui peut consulter quelles sources et quelles données peuvent être traitées. Les informations non autorisées restent hors du système.',60,100,'Premier point humain ; validation des accès et du périmètre.',true),
        stage('Préparer le corpus',['data','lecture','rech'],'Extraire le texte, repérer les doublons et conserver version, source et droits sur chaque fragment. Les pages illisibles vont dans une file de vérification.',300,760,'Extraction PDF, OCR, stockage et mémoire ; lots de documents représentés, sans fichiers réels.'),
        stage('Indexer et préparer le service',['data','code','ops'],'Construire l’index de recherche et le service avec filtres d’accès. Définir invalidation et réindexation pour éviter de répondre à partir d’une ancienne version.',360,900,'Index textuel/vectoriel, calcul d’embeddings, stockage et service de recherche ; appels éventuels à prévoir dans un vrai projet.'),
        stage('Produire une réponse traçable',['code','rech','rel'],'Retrouver des passages autorisés, construire une réponse et relier chaque affirmation à ses preuves. Sans preuve suffisante, demander une précision ou s’abstenir.',180,460,'Recherche, contexte et génération ; volume de texte et appels au modèle à suivre en production.'),
        stage('Évaluer quatre dimensions',['eval','security','test','perf'],'Quatre évaluations en parallèle : citations et exactitude ; séparation des accès et contenus hostiles ; non-régression ; latence, charge, mémoire et coût observé.',420,1380,'Jeu d’évaluation, tests d’accès et de charge, journaux ; mesures nécessaires, aucun score ni coût réel inventé.'),
        stage('Corriger et réévaluer',['arch','data','code','eval','security'],'Cas fictif : une ancienne source est citée. Corriger versionnement et invalidation, reconstruire l’index concerné et reprendre les tests de pertinence et d’accès.',300,1120,'Cinq rôles ; réindexation partielle et nouvelle campagne de vérification.'),
        stage('Décider du pilote',['plan','eval','security'],'Décision humaine : examiner les échecs restants et les preuves, puis accepter un pilote limité ou demander des corrections. Aucune moyenne ne remplace le contrôle des cas critiques.',120,280,'Deuxième point humain ; bilan d’évaluation et critères d’acceptation.',true),
        stage('Préparer le suivi et le retour arrière',['ops','perf','test'],'Préparer suivi de qualité, consommation, erreurs et mises à jour des sources. Définir les seuils d’arrêt et le retour à une version connue ; aucune infrastructure n’est déployée ici.',150,380,'Versionnement des index, supervision et tests après mise à jour ; exploitation continue à prévoir.')],fix:'Retour expert : invalider les fragments périmés, reconstruire l’index concerné et vérifier à nouveau citations et droits avant le pilote.',result:'Architecture et pilote simulés prêts pour revue'}
    ];

const englishAgents={
  tri:{name:'Sorter',detail:'Finds the useful information and points out what is missing.'},
  red:{name:'Writer',detail:'Turns the selected information into a clear first draft.'},
  rel:{name:'Reviewer',detail:'Checks the result, flags uncertainty and prepares it for a person to approve.'},
  plan:{name:'Coordinator',detail:'Breaks the work into tasks and makes sure each team has what it needs.'},
  rech:{name:'Researcher',detail:'Finds available evidence and separates facts from assumptions.'},
  design:{name:'Designer',detail:'Defines how the experience should work before it is built.'},
  code:{name:'Developer',detail:'Builds the feature and fixes problems found during checks.'},
  test:{name:'Tester',detail:'Checks normal situations and edge cases. A passing test only covers what was tested.'},
  lecture:{name:'Document reader',kind:'Local software',detail:'Extracts text from a PDF or reads scanned pages with OCR. This is a software tool, not a conversational AI agent.'},
  export:{name:'Assembler',kind:'Local software',detail:'Creates the output file and checks its structure. A valid file can still need visual review.'},
  art:{name:'3D artist',detail:'Creates models and animations and helps integrate them into the scene.'},
  arch:{name:'Architect',detail:'Defines how the parts of the system connect and depend on one another.'},
  data:{name:'Data engineer',detail:'Cleans the data, preserves its source and builds repeatable search indexes.'},
  perf:{name:'Performance specialist',detail:'Measures processing time and memory use before choosing optimizations.'},
  ops:{name:'Release lead',detail:'Prepares a version, monitoring and a way to go back. A person decides whether to publish.'},
  security:{name:'Security reviewer',detail:'Checks access rights, data separation and responses to untrusted content.'},
  eval:{name:'Evaluator',detail:'Uses questions with expected answers to compare results and detect regressions.'}
};
const enStep=(name,output,resource)=>({name,output,resource});
const englishGuides={
  publication:{title:'An idea → a post',name:'Turn a note into a post',shape:'Sort → write → review',input:'Starting idea: group small tasks together to reduce interruptions. Add a practical example.',fix:'Shorter version: group similar small tasks, while leaving room for urgent work.',result:'Post ready',steps:[
    enStep('Sort the ideas','Keep one idea: group similar tasks. Example: set aside a specific time to answer messages.','One illustrative AI request.'),
    enStep('Write a draft','Small tasks can break up your day. Try grouping them: one time slot for messages, another for routine admin.','One illustrative AI request.'),
    enStep('Review the post','To reduce interruptions, group similar tasks into a dedicated time slot. Adapt this to urgent needs in your work.','One illustrative AI request, followed by your approval.')
  ]},
  reponse:{title:'A message → a reply',name:'Turn a message into a reply',shape:'Read → draft → check',input:'Hello, have you received my application? Which documents do I still need to send?',fix:'Short reply: Hello, I will check both points and get back to you. Have a good day.',result:'Reply ready, not sent',steps:[
    enStep('Identify the requests','Two questions: has the application arrived, and which documents are missing? Neither answer has been provided.','One illustrative AI request.'),
    enStep('Draft a reply','Hello, I will check whether your application has arrived and which documents are required, then get back to you.','One illustrative AI request.'),
    enStep('Check the facts','The reply does not claim the application has arrived. The facts still need to be checked before a real message is sent.','One illustrative AI request. No message is sent.')
  ]},
  reunion:{title:'A meeting → an action plan',name:'Turn meeting notes into an action plan',shape:'Split the work → analyze together → combine',input:'Fictional notes: prepare a demo for Friday. Lina will check the figures. The home page needs work, but no one has been assigned to it.',fix:'Correction: distinguish “before Friday” from “on Friday”. The exact deadline for the figures still needs confirmation.',result:'Action plan ready',steps:[
    enStep('Split the notes','Separate decisions, tasks and questions that still need an answer.','One illustrative AI request.'),
    enStep('Analyze in parallel','Decision: a demo on Friday. Task: Lina checks the figures. Missing information: who owns the home-page update?','Two illustrative AI requests working from the same notes.'),
    enStep('Combine the findings','Plan: Lina checks the figures; the home page needs an owner; the time of the demo needs confirmation.','One illustrative AI request.'),
    enStep('Check the plan','Missing details stay marked “to confirm”. The plan does not invent deadlines or commitments.','Two illustrative AI requests, followed by human approval.')
  ]},
  comparatif:{title:'Compare before choosing',name:'Compare solutions before making a choice',shape:'Gather evidence → compare in parallel → decide',input:'Choose a note-taking tool using three criteria: export, offline access and cost. The information in this example is fictional.',fix:'The comparison now includes a field for the date on which each price was checked.',result:'Comparison ready to discuss',steps:[
    enStep('Set the criteria','Priorities: keep access to your own data, work without a connection and understand recurring fees.','One illustrative AI request.'),
    enStep('Gather information','Fictional examples: A exports Markdown; B exports PDF. Offline support and current prices still need checking.','Document review is represented, without a real search.'),
    enStep('Compare in parallel','Feature review: A makes text easier to reuse. Budget review: no conclusion is possible until the prices are confirmed.','Two illustrative AI analyses.'),
    enStep('Check the recommendation','Conditional recommendation: choose A if text export is the priority. Check offline support and pricing first.','One illustrative AI request. A person makes the choice.')
  ]},
  calque:{title:'Calque · read and convert',name:'Calque: from PDF to Word',shape:'Text or scan → checks → export',input:'Fictional PDF: twelve pages, four containing text and eight scanned. No real document is loaded.',fix:'Compare an uncertain word with the original, correct it, then rebuild and check the Word file.',result:'Simulated Word file ready',steps:[
    enStep('Check the file','Check the file type, page count and size. Reject invalid input before conversion.','Local browser processing. Documented limits: 50 MB and 150 pages.'),
    enStep('Choose how to read it','Extract text from four pages. Use OCR to read the eight scans. Both paths produce text for each page.','PDF rendering and page detection use browser memory.'),
    enStep('Read the pages','Text is extracted from four pages and recognized in eight scans. Uncertain words are marked for review.','Local PDF.js and Tesseract processing; CPU and memory, with no remote AI request.'),
    enStep('Build and check the file','Create a Word file and check its structure. The comparison view shows uncertain words and simplified formatting.','Local file creation and structural checks. These characters represent software functions.'),
    enStep('Review uncertain results','A person checks uncertain words, possible omissions and presentation. Complex tables are not reconstructed.','Simulated human review time. A valid file structure does not guarantee visual fidelity.')
  ]},
  coachos:{title:'CoachOS · improve the editor',name:'CoachOS: build an editor feature',shape:'Design in parallel → integrate → test → review',input:'Learning scenario: add an interaction to the basketball court while preserving saved plays and animated presentations.',fix:'Illustrative issue: undo removes the wrong drawing. The developer fixes it, then the tester repeats the affected checks.',result:'Simulated feature ready for review',steps:[
    enStep('Define the change','Review the specification and saved formats. Define what the gesture changes and what must stay intact.','Project documentation, source code and example plays.'),
    enStep('Design and plan tests','Design an explicit court gesture. Prepare touch, mouse, undo and older-file test cases.','Two roles work from the same interface agreement.'),
    enStep('Build the feature','Connect the interaction to the play state while keeping local saves and undo. Do not invent movements during animation.','React, TypeScript, IndexedDB and a represented local build.'),
    enStep('Check in parallel','Check logic, saved formats and Chromium user journeys. Real Safari and iPhone tests are still separate.','Unit and browser tests, with two roles working in parallel.'),
    enStep('Prepare the review','A version is ready for review. Publishing remains a separate decision. This scene does not modify or publish the real project.','Test summary and preview; no real deployment.')
  ]},
  eclipse:{title:'A 3D game · from idea to release',name:'Les Royaumes de l’Éclipse: a complete game update',shape:'Architecture → parallel work → integration → performance → human playtest',requires:'Understand project planning, test results and the difference between CPU, GPU and memory.',input:'Expert scenario inspired by the game: prepare a playable PC and phone update. Coordinate rules, 3D models, animation, saved progress and performance. This is a learning scenario, not the project’s actual history.',fix:'Expert review: fix weapon contact, rebuild assets and repeat combat, saved-progress and performance tests before deciding.',result:'Simulated game update ready for a decision',steps:[
    enStep('Define the update','Agree on goals, target devices and acceptance criteria. Separate the current release from future ideas.','Design documents and two roles combining the constraints.'),
    enStep('Map dependencies','Agree on the connections between campaign, combat, animation and saved progress. Identify what must be measured on a phone.','Architecture, existing code and a performance-measurement plan; three roles in parallel.'),
    enStep('Approve the scope','A person confirms a realistic slice of work before costly production starts. Out-of-scope ideas return to the design backlog.','First human decision. No external work is launched.'),
    enStep('Build in parallel','Four workstreams: rules and readability; models and animation; game logic; and test scenarios. All follow the agreed interfaces.','Blender, Three.js, code and test preparation; four simultaneous contributions.'),
    enStep('Integrate the work','Connect models, combat contact and progress state. An incompatible interface must be fixed before full-system testing.','Asset and site builds use processing power and working memory.'),
    enStep('Test and measure','Check progress, saved games and controls while measuring performance. Keep browser observations separate from real-device results.','Browser tests, screenshots, frame times and memory allocations. Real CPU/GPU measurements are still required.'),
    enStep('Fix and retest','Fictional issues: an impact happens too early and memory is allocated repeatedly. Fix them, then repeat targeted and regression tests.','Four roles, a new build and focused tests and measurements.'),
    enStep('Play on target devices','A person checks feel, readability and smoothness on a PC and a real phone. Failed checks return to integration.','Human review and physical devices; the second decision point.'),
    enStep('Prepare a reversible release','Prepare an identifiable version, test evidence and a rollback plan. The simulation publishes nothing.','Release artifact, publication checks and rollback procedure.')
  ]},
  documentaire:{title:'A large-scale document assistant',name:'Build a reliable large-scale document assistant',shape:'Access → documents → search → evaluation → controlled release',requires:'Understand access rights, data, document search and the limits of language models.',input:'Fictional expert project: an assistant for a large document collection used by teams with different permissions. It must cite sources, handle updates and decline when evidence is missing. No real documents or services are used.',fix:'Expert review: invalidate outdated passages, rebuild the affected index and recheck citations and permissions before the pilot.',result:'Simulated architecture and pilot ready for review',steps:[
    enStep('Define use and boundaries','Agree on users, allowed sources, expected answers and situations in which the assistant must decline.','Three roles review needs, documents and access rules.'),
    enStep('Design the system and tests','Plan document processing, search indexes, access filters and evaluation questions. Plan load and cost measurements before adding larger models.','Four roles: architecture, data structures, test data and capacity assumptions.'),
    enStep('Approve access and scope','A person confirms who may read which sources and what data can be processed. Unauthorized information stays out of the system.','First human checkpoint: access and scope approval.'),
    enStep('Prepare the documents','Extract text, remove duplicates and keep the source, version and permissions of each passage. Unreadable pages need review.','Extraction, OCR, storage and memory are represented; no real files are processed.'),
    enStep('Build search and the service','Build the search index and service with access filters. Plan how changed documents are removed and indexed again.','Text/vector indexes, embeddings, storage and a search service. Real deployments may need model requests.'),
    enStep('Produce an evidence-based answer','Find permitted passages, draft an answer and link claims to evidence. Ask for clarification or decline when evidence is insufficient.','Search, context and generation. A real service would track text volume and model requests.'),
    enStep('Evaluate four dimensions','Check citations and accuracy; access separation and hostile content; regressions; and speed, load, memory and observed cost.','Evaluation questions, access/load tests and logs. No real scores or costs are invented.'),
    enStep('Fix and evaluate again','Fictional issue: a reply cites an old source. Fix version handling, rebuild the affected index and repeat relevance and access tests.','Five roles, partial reindexing and another evaluation round.'),
    enStep('Decide on a pilot','A person reviews remaining failures and evidence, then approves a limited pilot or requests changes. An average score cannot replace critical-case checks.','Second human checkpoint: evaluation results and acceptance criteria.'),
    enStep('Plan monitoring and rollback','Plan quality, usage, errors and document updates. Define stop conditions and how to restore a known version. No infrastructure is deployed here.','Versioned indexes, monitoring and tests after updates; ongoing operations still need planning.')
  ]}
};


const frenchTitles={publication:'Une idée → un post',reponse:'Un message → une réponse',reunion:'Une réunion → un plan',comparatif:'Comparer pour choisir',calque:'Calque · lire et convertir',coachos:'CoachOS · faire évoluer l’éditeur',eclipse:'Un jeu 3D · de l’idée à la livraison',documentaire:'Un assistant documentaire à grande échelle'};
const frUI={
  pageTitle:'Processarium — Les idées prennent vie',brandTagline:'LES IDÉES PRENNENT VIE',home:'Processarium, accueil',demo:'Démonstration interactive',collection:'Ma collection',explore:'CHOISIR UN GUIDE',headline:'De l’idée au concret.',intro:'Comprends comment une idée devient un résultat, en suivant le travail de chaque rôle.',
  levels:['1 · Simple','2 · Intermédiaire','3 · Avancé','4 · Expert'],levelLabels:['NIVEAU 1 · SIMPLE','NIVEAU 2 · INTERMÉDIAIRE','NIVEAU 3 · AVANCÉ','NIVEAU 4 · EXPERT'],
  subtitles:['Un dossier passe d’un rôle au suivant : trier, écrire, relire.','Plusieurs rôles se partagent le travail et réunissent leurs résultats.','Un projet technique : choisir un chemin, construire et vérifier.','Une grande équipe coordonne conception, calculs, tests et décisions.'],
  defaults:['aucun prérequis. Une idée ou un message suffit.','savoir formuler une demande et relire un résultat.','comprendre un livrable technique et ses vérifications.','connaître la conception, les tests et les limites des outils.'],
  guidePicker:'Choisir un guide',catalogFoot:'Un guide terminé, une équipe dans ta collection.',guidesAvailable:'Guides disponibles',simulation:'Simulation du processus',rolesLabel:'Inspecter les rôles',stepsLabel:'Étapes du processus',inspector:'Ce que le processus produit',canvasLabel:'Atelier miniature. Le dossier passe entre les rôles. Les boutons sous la carte permettent de les inspecter.',
  beforeStart:'Lance la lecture et suis le dossier. Les postes éclairés montrent qui travaille.',play:'Lecture',pause:'Pause',playAria:'Lancer la lecture continue',pauseAria:'Mettre la lecture en pause',next:'Étape suivante',replay:'Rejouer',speed:'Vitesse',zoomIn:'Zoomer',zoomOut:'Dézoomer',center:'Centrer',mapControls:'Vue de l’atelier',current:'Poste courant',contributed:'A contribué',parallel:'{n} postes en parallèle',rolesSteps:'{roles} rôles · {steps} étapes',guideInfo:'{steps} étapes · {roles} rôles',completed:'terminé',
  start:'Commencer',finished:'Guide terminé ✓',collected:'Ajouté à la collection',humanGate:'À toi de décider',humanAction:'Valider cette étape',humanExplain:'Le parcours attend ton accord. Lis le résultat, puis valide pour continuer.',finalExplain:'Le résultat est prêt. Tu peux demander une correction ou terminer le guide.',finishGuide:'Terminer le guide',correct:'↶ Demander une correction',applyFix:'Appliquer la correction',verifyAgain:'Vérifier à nouveau',correctionPending:'Retour au poste de travail',correctionApplied:'Correction appliquée',correctionChecked:'Nouvelle vérification terminée',
  transferring:'Le dossier passe aux rôles suivants',working:'Les rôles travaillent sur le dossier',resultPhase:'Le résultat est prêt à être transmis',paused:'Lecture en pause',ready:'Prêt à démarrer',teamDone:'L’équipe a terminé',phaseLabels:{transfer:'Transmission',work:'Travail',result:'Résultat'},stepOf:'Étape {step} sur {total}',stepsDone:'{step}/{total} étapes',who:'Qui travaille ?',sameTime:'Ces rôles travaillent en parallèle.',nextUp:'À suivre',
  documentHeading:'LE RÉSULTAT À CETTE ÉTAPE',initialRequest:'La demande de départ',outputLabel:'{name} · résultat',backRequested:'Correction demandée',readMore:'Voir le résultat complet',resourceHeading:'Ce que ça mobilise',simulated:'SIMULÉ',scenarioPlan:'PLAN DU SCÉNARIO',peak:'Postes simultanés au maximum',plannedWork:'Travail total prévu',elapsed:'Temps écoulé dans le scénario',effort:'Temps de travail additionné',human:'Interventions humaines',parallelNote:'Le temps de travail additionne les contributions des rôles, même lorsqu’ils travaillent en même temps.',simulatedNote:'Les durées sont fictives : elles ne mesurent pas le temps réel de l’animation.',beforeRequirements:'Pour se lancer : ',roleKind:'Rôle illustratif',
  pdfLabel:'Dans les 12 pages de démonstration',pdfMixed:'Texte + pages scannées',pdfText:'Texte natif uniquement',pdfScan:'Pages scannées uniquement',pdfTextInput:'PDF fictif : douze pages de texte directement lisible.',pdfScanInput:'PDF fictif : douze pages scannées.',pdfTextPath:'Les douze pages contiennent du texte : on peut l’extraire directement, sans OCR.',pdfScanPath:'Les douze pages sont scannées : un outil doit reconnaître les caractères sur chaque image.',pdfTextResult:'Le texte des douze pages est extrait directement.',pdfScanResult:'Le texte est reconnu dans les douze scans ; les mots incertains sont signalés.',pdfTextResource:'Lecture locale avec PDF.js, sans OCR ni appel à une IA distante.',pdfScanResource:'Lecture locale avec PDF.js et Tesseract ; utilisation du processeur et de la mémoire.',
  about:'À SAVOIR',sourceReal:'Inspiré du projet documenté. Les équipes, incidents et durées sont une mise en scène pédagogique. Aucun changement n’est exécuté sur le projet.',sourceFiction:'Exemple fictif pour apprendre une méthode. Aucun agent IA n’est exécuté et aucun message n’est envoyé.',sourceLink:'Lire la documentation ↗',footer:'Un petit monde pour comprendre le travail.',footerNote:'Une simulation, sans action sur tes projets',collectionEyebrow:'LES RÔLES RENCONTRÉS',collectionTitle:'Ta collection',close:'Fermer ×',collectionSummary:'{done}/{total} guides terminés · {met}/{roles} personnages rencontrés',discover:'À découvrir →',completeStatus:'Terminé ✓',storage:'Collection enregistrée dans ce navigateur, sans compte ni synchronisation.',storageUnavailable:'L’enregistrement est indisponible. La collection reste dans cet onglet seulement.',
  glossaryTitle:'Les mots utiles',glossary:[{word:'OCR',meaning:'Un outil lit les caractères d’une image ou d’un document scanné.'},{word:'CPU / GPU',meaning:'Le processeur et la puce graphique effectuent les calculs. La mémoire garde les données en cours de traitement.'},{word:'Index / embeddings',meaning:'Des représentations des documents aident un moteur de recherche à retrouver les passages utiles.'},{word:'Non-régression',meaning:'On vérifie qu’une modification ne casse pas ce qui fonctionnait déjà.'}],
  languages:'Langue',moreLanguages:'Autres langues',languageDialogTitle:'Générer une traduction',languageIntro:'Le français et l’anglais sont les versions de référence. Les autres langues sont générées automatiquement et peuvent contenir des erreurs.',languageTarget:'Langue souhaitée ou code de langue',languagePlaceholder:'Ex. : es, de, ar, ja…',generate:'Générer',cancel:'Annuler',translationPreparing:'Préparation de la traduction…',translationProgress:'Traduction : {done}/{total} textes',translationDownloading:'Téléchargement du modèle par le navigateur…',translationUnavailable:'Ce navigateur ne propose pas la traduction locale. Garde le français ou l’anglais, ou utilise la commande « Traduire la page » de ton navigateur.',translationUnsupported:'Cette langue n’est pas prise en charge par le moteur de ce navigateur. Les versions FR et EN restent disponibles.',translationInvalid:'Saisis un code de langue valide, par exemple es, de, ar ou ja.',translationFailed:'La traduction n’a pas abouti. La langue précédente reste active. Tu peux réessayer ou choisir FR/EN.',translationCancelled:'Traduction annulée. La langue précédente reste active.',translationLocal:'La traduction utilise le moteur du navigateur. Il peut télécharger un modèle ; aucun service de traduction tiers n’est intégré au site.',automaticWarning:'Traduction automatique — des erreurs sont possibles. FR et EN restent les versions de référence.',primaryLanguages:'Versions de référence',
};
const enUI={
  pageTitle:'Processarium — See ideas take shape',brandTagline:'SEE IDEAS TAKE SHAPE',home:'Processarium home',demo:'Interactive demonstration',collection:'My collection',explore:'CHOOSE A GUIDE',headline:'From idea to outcome.',intro:'Follow each role to understand how an idea becomes a concrete result.',
  levels:['1 · Simple','2 · Intermediate','3 · Advanced','4 · Expert'],levelLabels:['LEVEL 1 · SIMPLE','LEVEL 2 · INTERMEDIATE','LEVEL 3 · ADVANCED','LEVEL 4 · EXPERT'],subtitles:['One file passes between roles: sort, write and review.','Several roles share the work and bring their findings together.','A technical project: choose a path, build and check.','A larger team coordinates design, processing, tests and decisions.'],defaults:['no prior knowledge needed. Start with an idea or a message.','be able to explain a request and review a result.','understand a technical deliverable and its checks.','be familiar with design, testing and tool limitations.'],
  guidePicker:'Choose a guide',catalogFoot:'Finish a guide to add its team to your collection.',guidesAvailable:'Available guides',simulation:'Process simulation',rolesLabel:'Inspect the roles',stepsLabel:'Process steps',inspector:'What the process produces',canvasLabel:'Miniature workshop. A file passes between roles. Use the buttons below the scene to inspect each role.',
  beforeStart:'Press Play and follow the people carrying the file. Highlighted workshops show who is working.',play:'Play',pause:'Pause',playAria:'Start continuous playback',pauseAria:'Pause playback',next:'Next step',replay:'Replay',speed:'Speed',zoomIn:'Zoom in',zoomOut:'Zoom out',center:'Center',mapControls:'Workshop view',current:'Current workshop',contributed:'Has contributed',parallel:'{n} roles in parallel',rolesSteps:'{roles} roles · {steps} steps',guideInfo:'{steps} steps · {roles} roles',completed:'completed',
  start:'Start',finished:'Guide completed ✓',collected:'Added to your collection',humanGate:'Your decision',humanAction:'Approve this step',humanExplain:'The process is waiting for you. Read the result, then approve it to continue.',finalExplain:'The result is ready. Request a correction or finish the guide.',finishGuide:'Finish the guide',correct:'↶ Request a correction',applyFix:'Apply the correction',verifyAgain:'Check again',correctionPending:'Back to the workshop',correctionApplied:'Correction applied',correctionChecked:'New checks completed',
  transferring:'The file passes to the next roles',working:'The roles are working on the file',resultPhase:'The result is ready to pass on',paused:'Playback paused',ready:'Ready to start',teamDone:'The team has finished',phaseLabels:{transfer:'Transfer',work:'Work',result:'Result'},stepOf:'Step {step} of {total}',stepsDone:'{step}/{total} steps',who:'Who is working?',sameTime:'These roles are working in parallel.',nextUp:'Coming next',
  documentHeading:'THE RESULT AT THIS STEP',initialRequest:'The starting request',outputLabel:'{name} · result',backRequested:'Correction requested',readMore:'Read the complete result',resourceHeading:'What it takes',simulated:'SIMULATED',scenarioPlan:'SCENARIO PLAN',peak:'Maximum simultaneous roles',plannedWork:'Planned total work',elapsed:'Elapsed scenario time',effort:'Combined work time',human:'Human interventions',parallelNote:'Combined work time adds each role’s contribution, including work done at the same time.',simulatedNote:'Times are fictional. They do not measure the real duration of the animation.',beforeRequirements:'Before you start: ',roleKind:'Illustrative role',
  pdfLabel:'Inside the 12-page example',pdfMixed:'Text and scanned pages',pdfText:'Text only',pdfScan:'Scans only',pdfTextInput:'Fictional PDF: twelve pages of directly readable text.',pdfScanInput:'Fictional PDF: twelve scanned pages.',pdfTextPath:'All twelve pages contain text that can be extracted directly, without OCR.',pdfScanPath:'All twelve pages are scans. A tool must recognize the characters in each image.',pdfTextResult:'Text is extracted directly from the twelve pages.',pdfScanResult:'Text is recognized in twelve scans, with uncertain words highlighted.',pdfTextResource:'Local reading with PDF.js, without OCR or remote AI requests.',pdfScanResource:'Local PDF.js and Tesseract processing uses the CPU and memory.',
  about:'GOOD TO KNOW',sourceReal:'Inspired by the documented project. Teams, incidents and durations are a learning scenario. No changes are made to the real project.',sourceFiction:'A fictional example for learning a method. No AI agent is run and no message is sent.',sourceLink:'Read the documentation ↗',footer:'A small world for understanding work.',footerNote:'A simulation that does not change your projects',collectionEyebrow:'THE ROLES YOU HAVE MET',collectionTitle:'Your collection',close:'Close ×',collectionSummary:'{done}/{total} guides completed · {met}/{roles} characters met',discover:'Discover →',completeStatus:'Completed ✓',storage:'Your collection is saved in this browser, without an account or synchronization.',storageUnavailable:'Saving is unavailable. Your collection stays in this tab only.',
  glossaryTitle:'Useful words',glossary:[{word:'OCR',meaning:'Software reads the characters in an image or scanned document.'},{word:'CPU / GPU',meaning:'The processor and graphics chip perform calculations. Memory holds data being processed.'},{word:'Index / embeddings',meaning:'Representations of documents help a search engine find useful passages.'},{word:'Regression testing',meaning:'Checks that a change has not broken something that used to work.'}],
  languages:'Language',moreLanguages:'Other languages',languageDialogTitle:'Generate a translation',languageIntro:'French and English are the reference versions. Other languages are generated automatically and may contain errors.',languageTarget:'Language or language code',languagePlaceholder:'For example: es, de, ar, ja…',generate:'Generate',cancel:'Cancel',translationPreparing:'Preparing the translation…',translationProgress:'Translating: {done}/{total} texts',translationDownloading:'The browser is downloading a language model…',translationUnavailable:'This browser does not provide local translation. Keep French or English, or use your browser’s “Translate page” command.',translationUnsupported:'This language is not supported by this browser’s translation engine. French and English remain available.',translationInvalid:'Enter a valid language code, such as es, de, ar or ja.',translationFailed:'Translation did not finish. Your previous language remains active. Try again or choose FR/EN.',translationCancelled:'Translation cancelled. Your previous language remains active.',translationLocal:'Translation uses the browser’s engine, which may download a model. This site does not integrate a third-party translation service.',automaticWarning:'Automatic translation — errors are possible. French and English remain the reference versions.',primaryLanguages:'Reference versions',
};

function primaryPack(locale){
  if(locale==='en')return {locale:'en',automatic:false,ui:enUI,agents:Object.fromEntries(Object.entries(agents).map(([id,a])=>[id,{...a,...englishAgents[id]}])),guides:guides.map(g=>({...g,...englishGuides[g.id],steps:g.steps.map((s,i)=>({...s,...englishGuides[g.id].steps[i]}))}))};
  return {locale:'fr',automatic:false,ui:frUI,agents,guides:guides.map(g=>({...g,title:frenchTitles[g.id]}))};
}
function message(ui,key,values={}){return String(ui[key]??key).replace(/\{(\w+)\}/g,(match,name)=>values[name]??match);}

function translationEntries(pack){
  const entries=[];
  const visit=(value,path)=>{if(typeof value==='string')entries.push({path,value});else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))visit(item,[...path,key]);};
  visit(pack.ui,['ui']);
  for(const [id,a] of Object.entries(pack.agents))for(const key of ['name','detail','kind'])if(a[key])visit(a[key],['agents',id,key]);
  pack.guides.forEach((g,i)=>{for(const key of ['name','title','shape','input','requires','fix','result'])if(g[key])visit(g[key],['guides',i,key]);g.steps.forEach((s,j)=>{for(const key of ['name','output','resource'])visit(s[key],['guides',i,'steps',j,key]);});});
  return entries;
}
async function generateLanguage(target,{signal,onProgress=()=>{},onDownload=()=>{}}={}){
  let locale;
  try{locale=Intl.getCanonicalLocales(target.trim())[0];if(!locale||!/^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i.test(locale))throw Error();const display=new Intl.DisplayNames(['en'],{type:'language'}).of(locale);if(display===locale)throw Error();}catch{throw Error('invalid');}
  if(['fr','en'].includes(locale))return primaryPack(locale);
  if(typeof globalThis.Translator?.availability!=='function')throw Error('unavailable');
  const options={sourceLanguage:'en',targetLanguage:locale};
  const available=await Translator.availability(options);
  if(available==='unavailable')throw Error('unsupported');
  signal?.throwIfAborted();
  const pack=structuredClone(primaryPack('en'));pack.locale=locale;pack.automatic=true;
  const translator=await Translator.create({...options,signal,monitor(m){m.addEventListener('downloadprogress',onDownload);}});
  try{
    const entries=translationEntries(pack);let finished=0;
    // Sequential requests are compatible with browser engines that queue model access.
    for(const entry of entries){
      signal?.throwIfAborted();
      // Protect interpolation placeholders from translation.
      const placeholders=[];const source=entry.value.replace(/\{\w+\}/g,p=>{placeholders.push(p);return `ZXQ${placeholders.length-1}QXZ`;});
      let result=await translator.translate(source,{signal});
      if(typeof result!=='string'||!result.trim())throw Error('failed');
      result=result.replace(/ZXQ\s*(\d+)\s*QXZ/gi,(_,n)=>placeholders[Number(n)]??'');
      if(placeholders.some(p=>!result.includes(p)))throw Error('failed');
      let obj=pack;for(const key of entry.path.slice(0,-1))obj=obj[key];obj[entry.path.at(-1)]=result;
      onProgress(++finished,entries.length);
    }
    return pack;
  }finally{translator.destroy?.();}
}

const palette = {
  tri: ['#9eae7c','#e0e7ca'], red: ['#b68d64','#f2debc'], rel: ['#879e9b','#d2e1da'],
  plan: ['#5c8b78','#c6dac4'], rech: ['#899d7e','#d9e4cd'], design: ['#9b96af','#e5dfee'],
  code: ['#6f9b9b','#cce3dc'], test: ['#c19b59','#f3e5bb'], lecture: ['#809db1','#d7e4e9'],
  export: ['#b79873','#eadac5'], art: ['#a490ac','#e5d7e9'],
  arch:['#718795','#d3dfe3'],data:['#78998a','#d1e2d8'],perf:['#ba9a63','#eddfc1'],
  ops:['#8e9381','#dce2d1'],security:['#8c8da7','#dddceb'],eval:['#a79278','#e5ddca']
};
const lots = [[-3,-3],[0,-3],[3,-3],[-3,0],[0,0],[3,0],[0,3]];
const iso = (u,v) => ({ x:(u-v)*39,y:(u+v)*20 });
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*t*(t*(t*6-15)+10);
function groundRoute(from,to){
  const a={u:from.u+.55,v:from.v+.65},b={u:to.u+.55,v:to.v+.65};
  const corners=[from,a,{u:a.u,v:b.v},b,to].filter((p,i,all)=>!i||Math.hypot(p.u-all[i-1].u,p.v-all[i-1].v)>.001);
  const result=[{...from}];
  for(let i=1;i<corners.length-1;i++){
    const prev=corners[i-1],p=corners[i],next=corners[i+1],d1=Math.hypot(p.u-prev.u,p.v-prev.v),d2=Math.hypot(next.u-p.u,next.v-p.v);
    const radius=Math.min(.4,d1/3,d2/3);
    const before={u:p.u+(prev.u-p.u)*radius/d1,v:p.v+(prev.v-p.v)*radius/d1},after={u:p.u+(next.u-p.u)*radius/d2,v:p.v+(next.v-p.v)*radius/d2};
    result.push(before);
    for(let j=1;j<=8;j++){const t=j/8;result.push({u:(1-t)**2*before.u+2*(1-t)*t*p.u+t*t*after.u,v:(1-t)**2*before.v+2*(1-t)*t*p.v+t*t*after.v});}
  }
  result.push({...to});
  result.distances=result.slice(1).map((p,i)=>Math.hypot(p.u-result[i].u,p.v-result[i].v));
  result.distance=result.distances.reduce((a,b)=>a+b,0);
  return result;
}
// A continuous, rounded route in world coordinates. Endpoints never reset a person.
function routePoint(points,progress){
  const segments=points.distances;
  let distance=progress*points.distance;
  for(let i=0;i<segments.length;i++){
    if(distance<=segments[i]||i===segments.length-1){const t=segments[i]?distance/segments[i]:1,a=points[i],b=points[i+1];return {u:lerp(a.u,b.u,t),v:lerp(a.v,b.v,t)};}
    distance-=segments[i];
  }
  return {...points.at(-1)};
}

class World {
  constructor(canvas, names, onSelect) {
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.names=names; this.onSelect=onSelect;
    this.roles=[];this.selected='';this.active=[];this.done=new Set();this.people=[];
    this.zoom=1;this.targetZoom=1;this.pan={x:0,y:0};this.time=0;this.visible=true;this.speed=1;this.lastFrame=0;this.handoff={u:-4,v:3};this.onProgress=()=>{};
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
    this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;});this.observer.observe(canvas);
    canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY,ox:this.pan.x,oy:this.pan.y,moved:false};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!this.drag)return;const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>5)this.drag.moved=true;if(this.drag.moved){this.pan.x=this.drag.ox+dx;this.pan.y=this.drag.oy+dy;}});
    canvas.addEventListener('pointerup',e=>{if(this.drag&&!this.drag.moved){const box=canvas.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;let near=null,distance=Infinity;for(const role of this.roles){const lot=this.getLot(role),point=this.screen(lot[0],lot[1]);const d=Math.hypot(point.x-x,point.y-y-26*this.scale);if(d<distance){distance=d;near=role;}}if(distance<65*this.scale&&near)this.onSelect(near);}this.drag=null;});
    canvas.addEventListener('pointercancel',()=>{this.drag=null;});
    this.animate=this.animate.bind(this);this.resize();requestAnimationFrame(this.animate);
  }
  resize(){const box=this.canvas.getBoundingClientRect();this.width=box.width;this.height=box.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(box.width*dpr);this.canvas.height=Math.round(box.height*dpr);this.dpr=dpr;const radius=this.roles.length>7?7:5.2;this.baseScale=Math.max(.08,Math.min((box.width-34)/(radius*156+9),(box.height-85)/(radius*80+44)));}
  screen(u,v){const p=iso(u,v);return {x:this.width/2+this.pan.x+p.x*this.scale,y:this.height*.53+this.pan.y+p.y*this.scale};}
  get scale(){return this.baseScale*this.zoom;}
  getLot(id){return this.placements?.[id]||[0,0];}
  setView(roles,selected,active,done,reset=false){
    if(reset||roles.join()!==this.roles.join()){
      this.roles=roles;this.placements={};const expanded=Array.from({length:roles.length},(_,i)=>[-4.5+(i%4)*3,-3+Math.floor(i/4)*3]);const sparse=roles.length===3?[[-3,-1],[0,2],[3,-1]]:roles.length>7?expanded:lots;
      roles.forEach((id,i)=>this.placements[id]=sparse[i]);
      this.people=roles.map((id,i)=>{const [u,v]=this.getLot(id);return {id,u:u+.9,v:v+.8,phase:i*1.7};});
      this.zoom=1;this.pan={x:0,y:0};
      this.targetZoom=1;this.handoff=roles.length>7?{u:-6,v:5}:{u:-4.2,v:3.8};
      this.resize();
    }
    this.selected=selected;this.active=active;this.done=new Set(done);
  }
  changeZoom(delta){this.targetZoom=Math.max(.65,Math.min(2.4,this.targetZoom+delta));}
  center(){this.targetZoom=1;this.pan={x:0,y:0};}
  stopTravel(){if(this.travel){const resolve=this.travel.resolve;this.travel=null;this.people.forEach(p=>{p.walking=false;p.package=false;});resolve(false);}}
  pauseTravel(){if(this.travel)this.travel.pausedAt=true;}
  resumeTravel(){if(this.travel)this.travel.pausedAt=false;}
  travelTo(ids,{automatic=false}={}){
    this.stopTravel();
    const moving=this.people.filter(p=>ids.includes(p.id));
    const source={...this.handoff};
    const routes=moving.map((person,i)=>{const [u,v]=this.getLot(person.id),home={u:u+.9,v:v+.8},from={u:person.u,v:person.v};const collect=groundRoute(from,source),deliver=groundRoute(source,home),pickup=collect.distance/(collect.distance+deliver.distance);return {person,source,home,from,collect,deliver,pickup,delay:i*.018};});
    if(this.reduced.matches&&!automatic){routes.forEach(r=>Object.assign(r.person,r.home));this.handoff={...routes.at(-1)?.home||source};return Promise.resolve(true);}
    const routeDuration=Math.max(5600,...routes.map(r=>(r.collect.distance+r.deliver.distance)*220/(.62-r.delay)));
    return new Promise(resolve=>{this.travel={routes,resolve,elapsed:0,progress:0,phase:'transfer',pausedAt:false,duration:this.reduced.matches?2400:routeDuration};});
  }
  animate(now){
    const dt=this.lastFrame?Math.min(50,Math.max(0,now-this.lastFrame)):0;this.lastFrame=now;
    if(!this.travel?.pausedAt)this.time+=dt;
    this.zoom=this.reduced.matches?this.targetZoom:lerp(this.zoom,this.targetZoom,1-Math.exp(-dt/140));
    if(this.travel&&!this.travel.pausedAt){
      const t=this.travel;t.elapsed+=dt*this.speed;t.progress=Math.min(1,t.elapsed/t.duration);t.phase=t.progress<.62?'transfer':t.progress<.9?'work':'result';
      for(const r of t.routes){
        const k=Math.max(0,Math.min(1,(t.progress-r.delay)/(.62-r.delay)));
        if(!this.reduced.matches){
          const pickup=r.pickup;
          const pos=k<pickup?routePoint(r.collect,smooth(k/pickup)):routePoint(r.deliver,smooth((k-pickup)/(1-pickup)));
          const direction=iso(pos.u-r.person.u,pos.v-r.person.v).x;
          if(Math.abs(direction)>.001)r.person.facing=direction>0?1:-1;
          Object.assign(r.person,pos);
        }
        r.person.walking=k>0&&k<1;r.person.package=k>=r.pickup;r.person.working=t.phase==='work';
      }
      this.onProgress(t.progress,t.phase);
      if(t.progress>=1){for(const r of t.routes){Object.assign(r.person,r.home);r.person.walking=false;r.person.package=false;r.person.working=false;}this.handoff={...t.routes.at(-1)?.home||this.handoff};this.travel=null;t.resolve(true);}
    }
    if(this.visible&&this.ctx)this.draw();
    requestAnimationFrame(this.animate);
  }
  poly(points,fill,stroke){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
  line(points,color,width=1){const c=this.ctx;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.stroke();}
  ellipse(x,y,rx,ry,color){const c=this.ctx;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill();}
  tile(u,v,fill,size=.5){const points=[iso(u-size,v-size),iso(u+size,v-size),iso(u+size,v+size),iso(u-size,v+size)];this.poly(points.map(p=>[p.x,p.y]),fill);}
  draw(){
    const c=this.ctx,w=this.width,h=this.height,s=this.scale;if(w<40||h<100)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.clearRect(0,0,w,h);
    c.translate(w/2+this.pan.x,h*.53+this.pan.y);c.scale(s,s);
    const radius=this.roles.length>7?7:5.2,edge=Math.floor(radius),corners=[iso(-radius,-radius),iso(radius,-radius),iso(radius,radius),iso(-radius,radius)];
    this.ellipse(5,58,radius*65,radius*30,'#203c2810');
    this.poly(corners.map(p=>[p.x,p.y+14]),'#bdc8ad');
    this.poly(corners.map(p=>[p.x,p.y]),'#dce3ca','#c5d0b6');
    for(let u=-edge;u<=edge;u++)for(let v=-edge;v<=edge;v++){
      if(Math.abs(u)===edge||Math.abs(v)===edge)this.tile(u,v,'#e9e8d4',.39);
      else if((u*13+v*7)%5===0)this.tile(u,v,'#d5dfbf',.49);
      if(u===0||v===0)this.tile(u,v,'#ede9d7',.49);
    }
    // The movement corridors sit between lots rather than running through buildings.
    const streetsU=new Set(this.roles.map(id=>this.getLot(id)[0]+1.45)),streetsV=new Set(this.roles.map(id=>this.getLot(id)[1]+1.45));
    for(const u of streetsU){const a=iso(u,-edge+.7),b=iso(u,edge-.7);this.line([[a.x,a.y],[b.x,b.y]],'#eae7d4',15);}
    for(const v of streetsV){const a=iso(-edge+.7,v),b=iso(edge-.7,v);this.line([[a.x,a.y],[b.x,b.y]],'#eae7d4',15);}
    // Each workshop has its own paved approach to the shared paths.
    for(const id of this.roles){const [u,v]=this.getLot(id);for(let x=Math.min(0,u);x<=Math.max(0,u);x++)this.tile(x,v+1,'#eae7d4',.32);}
    if(this.travel&&!this.reduced.matches){const fade=this.travel.phase==='transfer'?1:.3;for(const r of this.travel.routes){this.ctx.setLineDash([5,5]);this.line(r.deliver.map(p=>{const point=iso(p.u,p.v);return[point.x,point.y];}),`rgba(158,111,38,${.3*fade})`,1.5);this.ctx.setLineDash([]);}}
    const handoff=iso(this.handoff.u,this.handoff.v);this.ellipse(handoff.x,handoff.y,10,5,'#c99c5c55');
    const collectedAt=this.travel?Math.min(...this.travel.routes.map(r=>r.delay+r.pickup*(.62-r.delay))):1;
    if(!this.travel||this.travel.progress<collectedAt){this.poly([[handoff.x+3,handoff.y-13],[handoff.x+11,handoff.y-16],[handoff.x+11,handoff.y-5],[handoff.x+3,handoff.y-2]],'#fff9e1','#b59b6d');}
    const trees=this.roles.length>7?[[-6,-5],[-3,-5],[2,-5],[5,-5],[-6,0],[-6,4],[-3,5],[2,5],[6,4],[6,0]]:[[-4,-4],[-2,-4],[2,-4],[4,-4],[-4,0],[-4,3],[-2,4],[2,4],[4,3],[4,0]];
    const objects=trees.map(([u,v],i)=>({depth:u+v,draw:()=>this.tree(u,v,i)}));
    for(const id of this.roles){const [u,v]=this.getLot(id);objects.push({depth:u+v,draw:()=>this.building(id,u,v)});}
    for(const person of this.people)objects.push({depth:person.u+person.v+.1,draw:()=>this.person(person)});
    objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
    const labeled=this.width<510?new Set([this.selected,this.active[0]]):this.roles.length>7?new Set([this.selected,...this.active.slice(0,3)]):new Set(this.roles);
    for(const id of this.roles){const [u,v]=this.getLot(id),p=iso(u,v);if(!labeled.has(id))continue;this.label(this.names[id],p.x,p.y+43,this.active.includes(id));}
    c.setTransform(this.dpr,0,0,this.dpr,0,0);
  }
  tree(u,v,index){const p=iso(u,v),c=this.ctx;this.ellipse(p.x+3,p.y+4,14,6,'#7b91672a');c.fillStyle='#aa9b77';c.fillRect(p.x-2,p.y-22,4,25);this.ellipse(p.x,p.y-30,14,19,index%2?'#97b18b':'#a8be90');this.ellipse(p.x-5,p.y-34,8,12,index%2?'#a5bf96':'#b7caa2');}
  building(id,u,v){
    const {x,y}=iso(u,v),c=this.ctx,[roof,light]=palette[id]||palette.plan,active=this.active.includes(id),selected=this.selected===id;
    this.ellipse(x+11,y+12,54,18,'#63735316');
    if(active||selected){const t=this.reduced.matches?0:Math.sin(this.time/480)*.05;this.ellipse(x,y+2,57,29,active?`rgba(210,162,77,${.12+t})`:'#436c5820');}
    this.poly([[x-44,y],[x,y+22],[x+44,y],[x,y-22]],'#eeeada');
    this.poly([[x-37,y-2],[x,y+16],[x,y-34],[x-37,y-52]],'#fffdf1');
    this.poly([[x,y+16],[x+37,y-2],[x+37,y-52],[x,y-34]],light);
    this.poly([[x-43,y-54],[x,y-33],[x+43,y-54],[x,y-75]],roof);
    this.poly([[x-43,y-54],[x,y-33],[x,y-29],[x-43,y-50]],'#fffdf133');
    // Doors and windows follow the same projection as their wall.
    this.poly([[x-15,y+9],[x-4,y+14],[x-4,y-9],[x-15,y-14]],'#9fbaad');
    this.poly([[x-31,y-26],[x-21,y-21],[x-21,y-11],[x-31,y-16]],'#c1d8ce');
    this.poly([[x+10,y-20],[x+29,y-29],[x+29,y-15],[x+10,y-6]],'#98b7a6');
    this.line([[x+19,y-24],[x+19,y-10]],'#e8efe2',1.4);
    if(['code','lecture','export'].includes(id)){this.poly([[x-15,y-59],[x+2,y-51],[x+19,y-59],[x+2,y-67]],'#dbe8dd');this.line([[x-11,y-59],[x+2,y-53],[x+15,y-59]],'#91b2a3',1);}
    if(id==='art'||id==='design'){c.fillStyle='#f1e7cf';c.fillRect(x+17,y-74,6,20);this.ellipse(x+20,y-76,7,3,roof);}
    if(id==='plan'){this.line([[x,y-74],[x,y-100]],'#708f73',2);const flutter=this.reduced.matches?0:Math.sin(this.time/400)*2;this.poly([[x,y-100],[x+20,y-96+flutter],[x,y-88]],'#e7ba72');}
    const color=active?'#d4a14f':this.done.has(id)?'#699c76':'#c4cbb6';this.ellipse(x+40,y-55,4,4,color);
    if(active){const radius=this.reduced.matches?6:6+Math.sin(this.time/350)*1.3;c.strokeStyle='#d4a14f88';c.lineWidth=1;c.beginPath();c.arc(x+40,y-55,radius,0,Math.PI*2);c.stroke();}
  }
  person(person){
    const p=iso(person.u,person.v),c=this.ctx,walking=person.walking&&!this.reduced.matches&&!this.travel?.pausedAt;
    c.save();c.translate(p.x,p.y);const size=person.portrait?1:Math.max(1,.7/this.scale);c.scale(size*(person.facing||1),size);
    const phase=this.time/95+person.phase,bob=walking?Math.abs(Math.sin(phase))*.8:0,x=0,y=-bob,[coat]=palette[person.id]||palette.plan;
    this.ellipse(x+2,2,7,3,'#3c584e28');
    c.lineWidth=3;c.strokeStyle='#526c63';c.lineCap='round';const stride=walking?Math.sin(phase)*3:0;
    this.line([[x-2,y-4],[x-3+stride,y+2]],'#526c63',3);this.line([[x+2,y-4],[x+3-stride,y+2]],'#526c63',3);
    c.fillStyle=coat;c.beginPath();c.roundRect(x-5,y-16,10,12,3);c.fill();
    const work=person.working&&!this.travel?.pausedAt&&!this.reduced.matches?Math.sin(this.time/140)*1.5:0;
    this.line([[x-5,y-14],[x-7-stride*.4,y-7+work]],'#d9bd8a',2.5);this.line([[x+5,y-14],[x+7+stride*.4,y-7-work]],'#d9bd8a',2.5);
    this.ellipse(x,y-22,5,5.5,'#e7c89c');this.ellipse(x,y-25,6.5,3,person.id==='plan'?'#d1a151':'#536d5d');
    this.ellipse(x+2,y-22,.7,.7,'#3d544a');
    if(person.package){this.poly([[x+3,y-13],[x+10,y-16],[x+10,y-7],[x+3,y-4]],'#fbf6df','#b6bd9d');this.line([[x+5,y-11],[x+8,y-12]],'#a4ad91',.6);}
    c.restore();
  }
  portrait(canvas,id){canvas.width=88;canvas.height=88;const context=canvas.getContext('2d');if(!context)return;context.setTransform(2,0,0,2,44,68);const original=this.ctx;this.ctx=context;this.person({id,u:0,v:0,phase:0,walking:false,package:false,portrait:true});this.ctx=original;}
  label(text,x,y,active){const c=this.ctx,s=this.scale;c.font=`500 ${Math.max(12,12/s)}px system-ui`;const tw=c.measureText(text).width;const height=23/s;c.fillStyle=active?'#294c40':'#fffff4ed';c.beginPath();c.roundRect(x-tw/2-6/s,y-height/2,tw+12/s,height,4/s);c.fill();c.fillStyle=active?'#fff9e9':'#596b58';c.textAlign='center';c.textBaseline='middle';c.fillText(text,x,y+.5);}
}


const $=id=>document.getElementById(id),key='processarium:v1';
const state={version:1,guide:'publication',selected:'tri',completed:[],met:[],runs:{},language:'fr',speed:1};
let storageAvailable=true,playing=false,busy=false,generation=0,level=0;
let sceneProgress=0,scenePhase='transfer',pack,ui,translationController=null,translationTicket=0;
let cache={};
const automaticPacks=new Map();
function readState(){
  try{
    const raw=JSON.parse(localStorage.getItem(key));if(raw?.version!==1)return;
    state.guide=guides.some(g=>g.id===raw.guide)?raw.guide:'publication';
    state.selected=agents[raw.selected]?raw.selected:'tri';
    state.language=raw.language==='en'?'en':'fr';
    state.speed=[.75,1,1.5,2].includes(raw.speed)?raw.speed:1;
    state.completed=Array.isArray(raw.completed)?[...new Set(raw.completed.filter(id=>guides.some(g=>g.id===id)))]:[];
    const previousEclipse=['plan','rech','design','art','test','code','rel'];
    state.met=Array.isArray(raw.met)?[...new Set(raw.met.filter(id=>agents[id]))]:[...new Set(state.completed.flatMap(id=>id==='eclipse'?previousEclipse:guides.find(g=>g.id===id).steps.flatMap(s=>s.actors)))];
    for(const g of guides){const r=raw.runs?.[g.id];if(!r)continue;const updated=(r.revision||1)!==(g.revision||1);state.runs[g.id]={step:r.finished?g.steps.length:updated?0:Number.isInteger(r.step)?Math.max(0,Math.min(g.steps.length,r.step)):0,fix:updated?0:Number.isInteger(r.fix)?Math.max(0,Math.min(3,r.fix)):0,input:['scan','text'].includes(r.input)?r.input:'mixed',finished:!!r.finished,revision:g.revision||1};}
  }catch{storageAvailable=false;}
}
readState();
const queryLanguage=new URL(location.href).searchParams.get('lang');
if(['fr','en'].includes(queryLanguage))state.language=queryLanguage;
pack=primaryPack(state.language);ui=pack.ui;
const t=(name,values)=>message(ui,name,values);
const text=(id,value)=>{const el=$(id);if(el.textContent!==String(value))el.textContent=value;};
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageAvailable=false;}text('storage-note',storageAvailable?ui.storage:ui.storageUnavailable);}
function baseGuide(){return pack.guides.find(g=>g.id===state.guide);}
function run(){return state.runs[state.guide]??={step:0,fix:0,input:'mixed',finished:false,revision:baseGuide().revision||1};}
function duration(seconds){seconds=Math.round(seconds);return seconds<120?seconds+' s':Math.floor(seconds/60)+' min'+(seconds%60?' '+seconds%60+' s':'');}
function guide(){
  const g=baseGuide(),r=run();if(g.id!=='calque'||r.input==='mixed')return g;
  const steps=g.steps.map(s=>({...s})),isText=r.input==='text';
  steps[1].output=isText?ui.pdfTextPath:ui.pdfScanPath;
  steps[2].seconds=isText?48:420;steps[2].effort=steps[2].seconds;
  steps[2].output=isText?ui.pdfTextResult:ui.pdfScanResult;steps[2].resource=isText?ui.pdfTextResource:ui.pdfScanResource;
  return {...g,input:isText?ui.pdfTextInput:ui.pdfScanInput,steps};
}
function roles(g=guide()){return [...new Set(g.steps.flatMap(s=>s.actors))];}
function button(label,fn,className=''){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=className;b.addEventListener('click',fn);return b;}
function firstSentence(value){try{return [...new Intl.Segmenter(pack.locale,{granularity:'sentence'}).segment(value)][0]?.segment.trim()||value;}catch{return value;}}
function nameList(ids){const names=ids.map(id=>pack.agents[id].name);try{return new Intl.ListFormat(pack.locale,{style:'short',type:'conjunction'}).format(names);}catch{return names.join(', ');}}
const world=new World($('world'),Object.fromEntries(Object.entries(pack.agents).map(([id,a])=>[id,a.name])),id=>{state.selected=id;render();save();});
world.speed=state.speed;
level=baseGuide().level;
function pause(){playing=false;world.pauseTravel();}
function cancel(){generation++;busy=false;pause();world.stopTravel();sceneProgress=0;}
function choose(id){if(id===state.guide)return;cancel();state.guide=id;level=baseGuide().level;state.selected=roles()[0];world.center();render(true);save();}
function nextActors(){const g=guide(),r=run();if(r.finished)return[];if(r.step<g.steps.length)return g.steps[r.step].actors;if(r.fix===1)return[roles().includes('code')?'code':roles().includes('red')?'red':'lecture'];if(r.fix===2)return[roles().includes('test')?'test':'rel'];return[];}
function fixing(){const r=run();return r.step===guide().steps.length&&(r.fix===1||r.fix===2);}
function needsHuman(){const r=run(),g=guide();return !fixing()&&(r.step===g.steps.length||g.steps[r.step]?.human);}
function renderStatic(){
  document.documentElement.lang=pack.locale;
  let direction='ltr';try{const l=new Intl.Locale(pack.locale);direction=l.getTextInfo?.().direction||l.textInfo?.direction||(['ar','fa','he','ur','ps','sd','ug','yi','dv'].includes(pack.locale.split('-')[0])?'rtl':'ltr');}catch{}
  document.documentElement.dir=direction;document.title=ui.pageTitle;
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=ui[el.dataset.i18n]);
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',ui[el.dataset.i18nAria]));
  document.querySelectorAll('[data-level]').forEach(b=>b.textContent=ui.levels[Number(b.dataset.level)]);
  document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(!pack.automatic&&pack.locale===b.dataset.language)));
  text('automatic-warning',ui.automaticWarning);$('automatic-warning').hidden=!pack.automatic;
  $('translation-target').placeholder=ui.languagePlaceholder;
  $('glossary').replaceChildren(...ui.glossary.flatMap(item=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=item.word;dd.textContent=item.meaning;return[dt,dd];}));
  world.names=Object.fromEntries(Object.entries(pack.agents).map(([id,a])=>[id,a.name]));
  cache={};
}
function setLanguage(nextPack){pack=nextPack;ui=pack.ui;if(!pack.automatic){state.language=pack.locale;try{const url=new URL(location.href);url.searchParams.set('lang',pack.locale);history.replaceState(null,'',url);}catch{}}renderStatic();render();save();}
function renderStory(){
  const g=guide(),r=run(),n=g.steps.length,gate=r.step===n,actors=nextActors();
  const waiting=!busy&&needsHuman()&&!r.finished;
  text('story-number',t('stepOf',{step:Math.min(r.step+1,n),total:n}));
  text('story-phase',busy?(world.travel?.pausedAt?ui.paused:ui.phaseLabels[scenePhase]):r.finished?ui.teamDone:waiting?ui.humanGate:ui.nextUp);
  text('story-title',r.finished?g.result:fixing()?(r.fix===1?ui.applyFix:ui.verifyAgain):gate?ui.humanGate:g.steps[r.step].name);
  const description=r.finished?ui.catalogFoot:waiting?(gate?ui.finalExplain:ui.humanExplain):fixing()?firstSentence(g.fix):!busy&&r.step===0?ui.beforeStart:firstSentence(g.steps[Math.min(r.step,n-1)].output);
  text('story-text',description);
  text('story-actors',actors.length?ui.who+' '+nameList(actors)+(actors.length>1?' · '+ui.sameTime:''):'');
  text('map-caption',busy?(world.travel?.pausedAt?ui.paused:ui.phaseLabels[scenePhase]+' · '+(fixing()?(r.fix===1?ui.applyFix:ui.verifyAgain):g.steps[Math.min(r.step,n-1)].name)):r.finished?ui.teamDone:waiting?ui.humanGate:ui.ready);
}
function paintProgress(){
  const g=guide(),r=run(),n=g.steps.length,p=(r.step+(busy&&r.step<n?sceneProgress:0))/n;
  $('progress').style.transform='scaleX('+Math.min(1,p)+')';
  const percentage=String(Math.round(p*100));if($('progress-track').getAttribute('aria-valuenow')!==percentage)$('progress-track').setAttribute('aria-valuenow',percentage);
  $('progress-track').setAttribute('aria-label',t('stepsDone',{step:r.step,total:n}));
  const done=g.steps.slice(0,r.step),factor=[1,2,5,12][level];
  const extraTime=(r.fix===3?36:r.fix===2?24:0)*factor,extraWork=(r.fix===3?48:r.fix===2?32:0)*factor;
  const current=busy&&r.step<n?g.steps[r.step]:null;
  text('elapsed',duration(done.reduce((sum,s)=>sum+s.seconds,0)+extraTime+(current?current.seconds*sceneProgress:0)));
  text('effort',duration(done.reduce((sum,s)=>sum+s.effort,0)+extraWork+(current?current.effort*sceneProgress:0)));
  text('human',done.filter(s=>s.human).length+(r.fix?1:0)+(r.finished?1:0));
}
world.onProgress=(p,phase)=>{sceneProgress=p;if(scenePhase!==phase){scenePhase=phase;renderStory();}paintProgress();};
function render(reset=false){
  const g=guide(),r=run(),n=g.steps.length,gate=r.step===n,active=nextActors(),crew=roles(g),done=g.steps.slice(0,r.step);
  if(!crew.includes(state.selected))state.selected=crew[0];
  document.querySelectorAll('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.level)===level)));
  const catalogKey=pack.locale+':'+level+':'+g.id+':'+state.completed.join();
  if(cache.catalog!==catalogKey){
    $('guide-list').replaceChildren(...pack.guides.filter(x=>x.level===level).map((x,i)=>{const b=button('',()=>choose(x.id),'guide-button'+(x.id===g.id?' selected':''));b.setAttribute('aria-pressed',String(x.id===g.id));const num=document.createElement('span');num.className='guide-number';num.textContent=String(i+1).padStart(2,'0');const content=document.createElement('span'),title=document.createElement('strong'),sub=document.createElement('small');title.textContent=x.title;sub.textContent=t('guideInfo',{steps:x.steps.length,roles:roles(x).length})+(state.completed.includes(x.id)?' · '+ui.completed:'');content.append(title,sub);b.append(num,content);return b;}));
    $('guide-picker').replaceChildren(...pack.guides.filter(x=>x.level===level).map(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.title;o.selected=x.id===g.id;return o;}));cache.catalog=catalogKey;
  }
  text('level-label',ui.levelLabels[level]);text('guide-title',g.title);text('guide-size',t('rolesSteps',{roles:crew.length,steps:n}));
  text('level-description',ui.subtitles[level]);text('prerequisites',ui.beforeRequirements+(g.requires||ui.defaults[level]));
  text('peak-workers',Math.max(...g.steps.map(s=>s.actors.length)));text('planned-work',duration(g.steps.reduce((sum,s)=>sum+s.effort,0)));
  text('parallel-key',active.length>1?t('parallel',{n:active.length}):'');
  text('next',r.finished?ui.finished:fixing()?(r.fix===1?ui.applyFix:ui.verifyAgain):gate?ui.finishGuide:g.steps[r.step].human?ui.humanAction:r.step===0?ui.start:ui.next);
  $('next').disabled=busy||r.finished||playing;
  $('play').disabled=r.finished||(gate&&!fixing());
  text('play-symbol',playing?'Ⅱ':'▶︎');text('play-text',playing?ui.pause:ui.play);
  $('play').setAttribute('aria-pressed',String(playing));$('play').setAttribute('aria-label',playing?ui.pauseAria:ui.playAria);
  $('speed').value=String(state.speed);
  text('step-status',r.finished?ui.collected:gate?ui.humanGate:t('stepsDone',{step:r.step,total:n}));
  text('document-label',r.finished?g.result:gate&&r.fix?['',ui.backRequested,ui.correctionApplied,ui.correctionChecked][r.fix]:r.step===0?ui.initialRequest:t('outputLabel',{name:g.steps[r.step-1].name}));
  text('document-content',gate&&r.fix?g.fix:r.step===0?g.input:g.steps[r.step-1].output);
  $('correct').hidden=!gate||!!r.fix||r.finished;$('correct').disabled=busy;
  text('resources',(done.length?done.at(-1).resource:ui.subtitles[level])+' '+(done.some(s=>s.actors.length>1)?ui.parallelNote+' ':'')+ui.simulatedNote);
  $('branch').hidden=g.id!=='calque';$('pdf-type').value=r.input;$('pdf-type').disabled=busy||r.step>0;
  const roleKey=pack.locale+':'+g.id;
  if(cache.roles!==roleKey){$('role-list').replaceChildren(...crew.map(id=>{const b=button(pack.agents[id].name,()=>{state.selected=id;render();save();});b.dataset.role=id;return b;}));cache.roles=roleKey;}
  $('role-list').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.role===state.selected)));
  text('role-detail',pack.agents[state.selected].name+' · '+(pack.agents[state.selected].kind||ui.roleKind)+' — '+pack.agents[state.selected].detail);
  const pathKey=pack.locale+':'+g.id+':'+r.step;
  if(cache.path!==pathKey){$('process-path').replaceChildren(...g.steps.map((s,i)=>{const el=document.createElement('span');el.className='path-step'+(i<r.step?' done':i===r.step?' current':'');el.textContent=(i<r.step?'✓ ':String(i+1)+'. ')+s.name;return el;}));cache.path=pathKey;}
  text('source-note',g.source?ui.sourceReal:ui.sourceFiction);$('source-link').hidden=!g.source;if(g.source)$('source-link').href='https://github.com/mativ117/'+g.source+'/blob/main/README.md';
  world.setView(crew,state.selected,active,done.flatMap(s=>s.actors),reset);
  renderStory();paintProgress();renderCollection();
}
function renderCollection(){
  text('collection-count',state.completed.length);text('collection-summary',t('collectionSummary',{done:state.completed.length,total:pack.guides.length,met:state.met.length,roles:Object.keys(pack.agents).length}));
  const collectionKey=pack.locale+':'+state.completed.join()+':'+state.met.join();if(cache.collection===collectionKey)return;cache.collection=collectionKey;
  $('collected-agents').replaceChildren(...Object.entries(pack.agents).map(([id,a])=>{const unlocked=state.met.includes(id),el=document.createElement('div');el.className='agent-card'+(unlocked?'':' locked');const portrait=document.createElement(unlocked?'canvas':'span');portrait.className='agent-portrait';if(unlocked)world.portrait(portrait,id);else portrait.textContent='?';portrait.setAttribute('aria-hidden','true');const name=document.createElement('span');name.textContent=a.name;el.append(portrait,name);return el;}));
  $('collection-guides').replaceChildren(...pack.guides.map(g=>{const b=button('',()=>{$('collection-dialog').close();choose(g.id);});const name=document.createElement('span'),status=document.createElement('span');name.textContent=g.title;status.textContent=state.completed.includes(g.id)?ui.completeStatus:ui.discover;b.append(name,status);return b;}));
}
async function advance(){
  if(busy||run().finished)return;
  const g=guide(),r=run(),n=g.steps.length,atGate=r.step===n,fix=fixing();
  if(atGate&&!fix){r.finished=true;if(!state.completed.includes(g.id))state.completed.push(g.id);state.met=[...new Set([...state.met,...roles(g)])];pause();render();save();return;}
  const ticket=++generation;busy=true;sceneProgress=0;scenePhase='transfer';
  const moving=world.travelTo(nextActors(),{automatic:playing});render();
  const moved=await moving;if(ticket!==generation||!moved)return;
  if(fix)r.fix++;else r.step++;
  busy=false;sceneProgress=0;
  if(needsHuman()||r.finished)pause();
  render();save();
  // Start the following scene in the same frame; there is no inter-scene timer.
  if(playing)void advance();
}
$('next').addEventListener('click',()=>{pause();void advance();});
$('play').addEventListener('click',()=>{if(playing){pause();render();return;}if(run().finished)return;if(!busy&&needsHuman()){pause();render();$('next').focus();return;}playing=true;world.resumeTravel();render();if(!busy)void advance();});
$('replay').addEventListener('click',()=>{cancel();const input=run().input;state.runs[state.guide]={step:0,fix:0,input,finished:false,revision:baseGuide().revision||1};render(true);save();});
$('correct').addEventListener('click',()=>{pause();run().fix=1;render();save();});
$('speed').addEventListener('change',e=>{state.speed=Number(e.target.value);world.speed=state.speed;save();});
for(const b of document.querySelectorAll('[data-level]'))b.addEventListener('click',()=>choose(pack.guides.find(g=>g.level===Number(b.dataset.level)).id));
$('guide-picker').addEventListener('change',e=>choose(e.target.value));
$('pdf-type').addEventListener('change',e=>{if(!busy&&run().step===0){run().input=e.target.value;render();save();}});
$('zoom-in').addEventListener('click',()=>world.changeZoom(.15));$('zoom-out').addEventListener('click',()=>world.changeZoom(-.15));$('zoom-reset').addEventListener('click',()=>world.center());
$('collection-toggle').addEventListener('click',()=>{pause();render();save();$('collection-dialog').showModal();});$('close-collection').addEventListener('click',()=>$('collection-dialog').close());
for(const b of document.querySelectorAll('[data-language]'))b.addEventListener('click',()=>setLanguage(primaryPack(b.dataset.language)));
function cancelTranslation(){translationTicket++;translationController?.abort();translationController=null;$('generate-language').disabled=false;text('translation-status',ui.translationCancelled);}
$('more-languages').addEventListener('click',()=>{pause();render();text('translation-status',typeof globalThis.Translator?.availability==='function'?'':ui.translationUnavailable);$('language-dialog').showModal();});
$('close-language').addEventListener('click',()=>{cancelTranslation();$('language-dialog').close();});
$('cancel-translation').addEventListener('click',()=>{cancelTranslation();$('language-dialog').close();});
$('language-dialog').addEventListener('cancel',cancelTranslation);
$('translation-form').addEventListener('submit',async e=>{
  e.preventDefault();cancelTranslation();const ticket=translationTicket,controller=new AbortController();translationController=controller;
  const target=$('translation-target').value.trim();$('generate-language').disabled=true;text('translation-status',ui.translationPreparing);
  const timeout=setTimeout(()=>controller.abort(),300000);
  try{
    const translated=automaticPacks.get(target)||await generateLanguage(target,{signal:controller.signal,onDownload:()=>text('translation-status',ui.translationDownloading),onProgress:(done,total)=>text('translation-status',t('translationProgress',{done,total}))});
    if(ticket!==translationTicket||controller.signal.aborted)return;
    automaticPacks.set(target,translated);setLanguage(translated);$('language-dialog').close();
  }catch(error){if(ticket!==translationTicket)return;const kind=controller.signal.aborted?'Cancelled':error.message==='invalid'?'Invalid':error.message==='unsupported'?'Unsupported':error.message==='unavailable'?'Unavailable':'Failed';text('translation-status',ui['translation'+kind]);}
  finally{clearTimeout(timeout);if(ticket===translationTicket){translationController=null;$('generate-language').disabled=false;}}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();render();}});
renderStatic();render(true);save();

})();
