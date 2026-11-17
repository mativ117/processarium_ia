export const englishAgents={
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
export const englishGuides={
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
