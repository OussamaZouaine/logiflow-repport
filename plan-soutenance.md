# Plan de soutenance — LogiFlow TMS

**Cadre :** projet tutoré ENSI Tanger · Génie informatique · équipe de 4  
**Durée cible oral :** 20–25 min + 10–15 min questions  
**Support :** ~22–26 diapositives + démo live (ou vidéo de secours)  
**Source :** rapport `main.pdf` (chapitres 1–9)

> **Équipe :** ZOUAINE Oussama · STITOU Ibrahim · ES-SEMLLALI Oussama · RAHALI Hamza  
> **Encadrant :** Jaber EL BOUHDIDI  
>
> **À faire avant le jour J**  
> 1. Assigner `Orateur A/B/C/D` aux quatre noms ci-dessus (et les périmètres).  
> 2. Caler la durée réelle avec votre jury (si 15 min : couper diapos 8, 14, 18).  
> 3. Préparer une **vidéo démo 3 min** en secours (réseau / Keycloak).

---

## 1. Répartition des rôles (équipe de 4)

| Orateur | Qui | Rôle projet | Diapos | Temps |
|---------|-----|-------------|--------|-------|
| **A — Cadre & métier** | **STITOU Ibrahim** | Chef de projet | 1–7 | ~5 min |
| **B — Architecture & backend** | **STITOU Ibrahim** | Responsable Backend | 8–12 | ~5 min |
| **C — Frontend & démo** | **ZOUAINE Oussama** | Responsable Frontend (+ mention Infra) | 13–17 | ~6 min |
| **D — IA** | **ES-SEMLLALI Oussama** | Responsable IA | 18–19 | ~3 min |
| **D′ — Infra, sécu, conclusion** | **RAHALI Hamza** (+ ZOUAINE sur infra si besoin) | Responsable Sécurité | 20–25 | ~3 min |

**Règle orale :** un seul micro à la fois ; les autres regardent le jury, pas l’écran.  
**Transition :** chaque orateur termine par une phrase de passe (« Je laisse la parole à … pour l’architecture »).

---

## 2. Fil rouge (ce que le jury doit retenir)

En une phrase, répétable par les 4 :

> LogiFlow est un TMS web unique, filtré par rôle, avec un backend Spring Modulith hexagonal, une IA Flask isolée derrière Spring (jamais exposée au navigateur), et une infra AWS sans SSH exposé.

Trois messages à marteler :

1. **Domaine clair** : commande → dossier → voyage.  
2. **Frontières de sécurité** : navigateur → Spring seulement ; Flask interne + clé API.  
3. **Honnêteté** : architecture cible posée ; sécurité cloud encore en durcissement (ch. 8).

---

## 3. Plan minute par minute

| Min | Qui | Contenu |
|-----|-----|---------|
| 0:00–0:45 | A | Accueil, titre, équipe |
| 0:45–2:00 | A | Contexte + problématique |
| 2:00–3:30 | A | Objectifs + organisation (4 dépôts, agile) |
| 3:30–5:00 | A | Conception métier (rôles, cycle, UML) |
| 5:00–7:30 | B | Architecture d’ensemble (3 règles + C4) |
| 7:30–10:00 | B | Backend Modulith + hexagonal |
| 10:00–12:00 | C | Frontend, RBAC, auth |
| 12:00–15:30 | C | **Démo live** (parcours métier) |
| 15:30–18:00 | D | IA (agents, BFF, déterministe vs LLM) |
| 18:00–20:30 | D | Infra + sécurité + limites |
| 20:30–22:00 | D | Bilan, perspectives, remerciements |
| 22:00+ | Tous | Questions |

---

## 4. Diapositives détaillées (contenu + script)

### Diapo 1 — Page de titre (~30 s) — Orateur A

**Contenu slide**
- Logo ENSI + titre : *LogiFlow — Transport Management System*
- Sous-titre : Projet tutoré · ENSI Tanger · 2025–2026
- ZOUAINE Oussama · STITOU Ibrahim · ES-SEMLLALI Oussama · RAHALI Hamza  
- Encadrant : Jaber EL BOUHDIDI
- Mention : « Soutenance »

**Dire**
> Bonjour Monsieur / Madame le Président, Mesdames et Messieurs les membres du jury. Nous vous présentons LogiFlow, un système de gestion du transport routier de marchandises, réalisé dans le cadre de notre projet tutoré à l’ENSI Tanger. Je suis [Nom], et avec moi [B], [C] et [D].

---

### Diapo 2 — Plan de la présentation (~20 s) — Orateur A

**Contenu slide**
1. Contexte et objectifs  
2. Conception métier  
3. Architecture  
4. Backend & frontend  
5. Démonstration  
6. IA, infrastructure et sécurité  
7. Bilan et perspectives  

**Dire**
> Nous suivrons ce plan : d’abord le besoin métier, puis les choix techniques, une démonstration, et enfin l’IA, l’infrastructure et la sécurité, avant de conclure.

---

### Diapo 3 — Contexte (~45 s) — Orateur A

**Contenu slide**
- Transport routier = enchaînement d’objets distincts  
- Aujourd’hui : tableurs, vues mélangées, IA collée au navigateur  
- LogiFlow : TMS web unique, rôles filtrés, architecture professionnelle  

**Dire**
> Dans le transport routier, une demande commerciale, un dossier facturable et un voyage physique sont trois objets différents. Sans outil dédié, tout se mélange dans des tableurs. Les rôles — exploitation, atelier, commercial, chauffeur — n’ont pas la même vue. LogiFlow vise une plateforme unique qui respecte ce cycle et ces rôles.

---

### Diapo 4 — Problématique (~40 s) — Orateur A

**Contenu slide** (4 questions courtes)
1. Séparer commercial / transportable / exécution ?  
2. Une app, six rôles, sans multiplier les frontends ?  
3. Intégrer l’IA sans exposer le LLM au navigateur ?  
4. Déployer sur le cloud avec une surface d’attaque maîtrisée ?

**Dire**
> Notre problématique : comment concevoir un TMS web sécurisé et évolutif qui sépare clairement le métier, adapte l’interface aux six rôles, intègre l’IA sans l’exposer au navigateur, et se déploie sur le cloud de façon contrôlée ?

---

### Diapo 5 — Objectifs (~40 s) — Orateur A

**Contenu slide**
- App unique filtrée par rôle  
- Backend Java modulaire (Spring Modulith) + hexagonal  
- IA isolée (Flask) derrière Spring = BFF  
- Auth Keycloak (OIDC + PKCE)  
- Infra AWS par code (Terraform + Ansible), pas de SSH exposé  

**Dire**
> Cinq objectifs concrets : une application filtrée par rôle ; un backend modulaire hexagonal ; une IA jamais appelée depuis le navigateur ; une authentification Keycloak ; une infrastructure AWS provisionnée par code, sans SSH ouvert.

---

### Diapo 6 — Organisation du projet (~40 s) — Orateur A

**Contenu slide**
| Dépôt | Rôle |
|-------|------|
| `logiflow-frontend` | SPA Angular |
| `logiflow-backend` | API Spring + façade IA |
| `logiflow-ai-service` | Agents Flask |
| `logiflow-infra` | Terraform + Ansible |

- Méthode agile, sprints courts  
- Backend ∥ frontend après revue conception  
- Gantt / jalons (kick-off → démo finale)

**Dire**
> Quatre dépôts, quatre responsabilités. L’infra est versionnée à part : un `terraform apply` ne rebuild pas l’application. Nous avons travaillé en sprints, avec conception d’abord, puis développement parallèle frontend/backend, puis IA et infra.

---

### Diapo 7 — Conception métier (~90 s) — Orateur A

**Contenu slide**
- **Cycle :** Commande → Dossier → Voyage → Suivi / carburant / maintenance  
- **6 rôles :** exploitant, responsable d’exploitation, atelier, commercial, chauffeur, admin  
- Mini schéma (cas d’utilisation ou états) — reprendre fig. rapport  
- Glossaire partagé (commande ≠ dossier ≠ voyage)

**Dire**
> Le cœur métier est ce cycle : une commande commerciale devient un dossier transportable, puis un voyage exécuté. Six rôles métier partagent la même application, avec des écrans et des droits différents. Nous avons formalisé cela avec des diagrammes de cas d’utilisation, de classes, de séquence et d’états — le détail est dans le rapport, chapitre 2.

**Passe**
> Je laisse la parole à [B] pour l’architecture technique.

---

### Diapo 8 — Architecture : 3 règles (~60 s) — Orateur B

**Contenu slide** (grandes puces)
1. Le navigateur ne parle **qu’à** Spring Boot  
2. Flask **n’a pas** la base TMS  
3. Le JWT s’arrête au backend ; Spring ↔ Flask = clé interne  

**Dire**
> Trois règles structurent tout le système. Premièrement, Angular n’appelle jamais Flask. Deuxièmement, le service IA ne touche pas à la base métier : Spring lui envoie le contexte. Troisièmement, l’identité utilisateur s’arrête au backend ; entre Spring et Flask, une clé d’API de service suffit.

---

### Diapo 9 — Vue conteneurs (C4) (~60 s) — Orateur B

**Contenu slide**
- Schéma C4 : Angular · Keycloak · Spring · PostgreSQL · Flask · LLM cloud · OSRM  
- Stack courte sous chaque boîte  

**Dire**
> Voici la vue conteneurs. L’utilisateur authentifié via Keycloak interagit avec Angular. Spring Boot est le seul point d’entrée API, avec PostgreSQL. Flask, le LLM cloud et OSRM sont derrière, sur le réseau interne. L’infrastructure AWS est gérée par Terraform et Ansible.

---

### Diapo 10 — Flux d’une requête (~45 s) — Orateur B

**Contenu slide**
- Flèche : UI → JWT → Spring `/api/v1` → (optionnel) Flask `:8000` → DTO  
- Erreurs : RFC 7807  

**Dire**
> Pour une requête classique, le frontend envoie un JWT à Spring. Pour le copilote ou l’itinéraire, Spring authentifie, assemble le contexte, appelle Flask en interne, journalise, et renvoie un DTO déjà mis en forme. Les erreurs suivent le format Problem Details, RFC 7807.

---

### Diapo 11 — Backend Modulith (~75 s) — Orateur B

**Contenu slide**
- Un JAR, plusieurs modules (liste courte : order, dossier, planning, fleet, ai, …)  
- Frontières vérifiées en CI (ArchUnit / Modulith)  
- Hexagonal : domain / application / infrastructure / api  
- Schémas SQL séparés ; liens UUID, pas de JPA transverse  

**Dire**
> Le backend est un monolithe Spring Modulith : un seul processus déployable, mais des modules métier aux frontières contrôlées. Chaque module est hexagonal. Les modules ne se parlent que via leur package `api`. Les schémas SQL sont séparés par domaine ; on évite les `@ManyToOne` transverses.

---

### Diapo 12 — Événements & API (~30 s) — Orateur B

**Contenu slide**
- API `/api/v1/**` + Flyway  
- Exemple événement : confirmation commande → ouverture dossier  

**Dire**
> L’API est versionnée sous `/api/v1`. Les migrations passent par Flyway. Entre modules, nous utilisons des événements applicatifs après commit — par exemple, confirmer une commande ouvre un dossier.

**Passe**
> [C] va maintenant présenter le frontend et la démonstration.

---

### Diapo 13 — Frontend (~50 s) — Orateur C

**Contenu slide**
- Angular 22 · Tailwind 4 · App Shell  
- Signals, navigation par modules  
- Une SPA, menus filtrés par rôle  

**Dire**
> Le frontend est une SPA Angular avec App Shell. L’idée clé : une seule application ; c’est le rôle de l’utilisateur qui décide des menus et des écrans visibles.

---

### Diapo 14 — RBAC & authentification (~50 s) — Orateur C

**Contenu slide**
- OIDC Authorization Code + PKCE (Keycloak)  
- Spring = resource server JWT  
- Deny-by-default sur l’API  
- 6 rôles métier dans le jeton / utilisateur  

**Dire**
> L’authentification passe par Keycloak en OIDC avec PKCE. Spring valide le JWT. Côté API, le principe est deny-by-default : seuls health, info et OpenAPI restent publics. Les six rôles métier pilotent l’accès aux fonctionnalités.

---

### Diapo 15 — Écrans clés (aperçu) (~30 s) — Orateur C

**Contenu slide**
- Grille de 4–6 miniatures : login, dashboard, commandes, voyages, flotte, copilote  
- « Passons à la démonstration »

**Dire**
> Voici un aperçu des interfaces. Nous allons maintenant montrer un parcours réel dans l’application.

---

### Diapos 16–17 — DÉMO LIVE (~3–3,5 min) — Orateur C (+ B en support technique)

**Scénario recommandé (ordre fixe)**

| Étape | Action | Ce qu’on montre |
|-------|--------|-----------------|
| 1 | Login Keycloak | Rôle choisi (idéalement exploitant ou admin) |
| 2 | Dashboard | Shell, modules visibles |
| 3 | Commande → dossier | Cycle commercial |
| 4 | Voyage / affectation | Cœur exploitation |
| 5 | Flotte ou carburant | Satellite métier |
| 6 | Copilote IA (si dispo) | SSE / suggestion — sinon capture |

**Dire (script démo)**
> 1. Je me connecte via Keycloak — l’identité est centralisée.  
> 2. Voici le tableau de bord : selon mon rôle, seuls certains modules apparaissent.  
> 3. Je crée / ouvre une commande, puis le dossier associé — on voit la séparation commercial / transportable.  
> 4. Je passe au voyage : affectation véhicule / chauffeur.  
> 5. Optionnellement, atelier ou carburant.  
> 6. Enfin le copilote : la requête part vers Spring, jamais directement vers Flask.

**Filet de sécurité**
- Si plantage : basculer sur la **vidéo 3 min** ou les captures du rapport (ch. 4b).  
- Ne pas improviser un autre scénario sous stress.

**Passe**
> Merci. [D] continue avec l’intelligence artificielle et l’infrastructure.

---

### Diapo 18 — Intelligence artificielle : rôle (~60 s) — Orateur D

**Contenu slide**
- Service Flask isolé, appelé **uniquement** par Spring  
- 4 capacités : copilote SSE · planification · maintenance prédictive · itinéraire OSRM  
- LLM cloud (Groq) — pas Ollama (trop lent pour le stream)

**Dire**
> L’IA vit dans un service Flask séparé. Quatre capacités : copilote conversationnel en SSE, planification assistée, maintenance prédictive, et calcul d’itinéraire via OSRM. Le LLM est cloud, compatible OpenAI — nous avons écarté un LLM local trop lent pour le streaming.

---

### Diapo 19 — Principes IA (~60 s) — Orateur D

**Contenu slide**
- Pas d’accès base TMS depuis Flask  
- Calcul déterministe + LLM rédacteur  
- Auth : `X-Internal-Api-Key` + callback outils  
- Base propre `logiflow_ai` + pgvector  

**Dire**
> Trois principes. Flask n’accède pas à la base TMS. Les chiffres et scores sont calculés de façon déterministe ; le LLM rédige ou explique. L’identité utilisateur ne traverse pas : Spring pose les en-têtes internes. Si le LLM est indisponible, un gabarit texte prend le relais.

---

### Diapo 20 — Infrastructure (~50 s) — Orateur D

**Contenu slide**
- AWS `eu-west-3` : FE public · BE + PG privés · IA privée  
- Terraform (provision) + Ansible (deploy images GHCR)  
- Pas de SSH : administration via **AWS SSM**  
- NAT pour la sortie uniquement  

**Dire**
> Sur AWS, le frontend est public ; backend, base et IA sont en privé. Terraform provisionne ; Ansible déploie les images depuis GHCR. Aucun SSH exposé : l’administration passe par SSM Session Manager.

---

### Diapo 21 — Sécurité (~60 s) — Orateur D

**Contenu slide**
- Auth : OIDC + PKCE + JWT + RBAC  
- Réseau : SG en chaîne FE → BE → AI  
- Secrets Manager, EBS chiffré, IMDSv2, tfsec  
- Frontière Spring ↔ Flask assumée (clé → évolution mTLS)

**Dire**
> Côté sécurité : authentification Keycloak, JWT validé par Spring, deny-by-default. Côté cloud : security groups en moindre privilège, secrets hors Git, scan IaC tfsec. La frontière Spring–Flask repose aujourd’hui sur une clé interne ; avant une exposition large, on pourra passer en mTLS ou client-credentials.

---

### Diapo 22 — Limites & honnêteté (~45 s) — Orateur D

**Contenu slide** (reprendre ch. 8 — état d’avancement)
- Keycloak cloud / MFA à finaliser  
- TLS domaine frontend à terminer  
- Renfort Spring ↔ Flask  
- Agents (groupage, profondeur maintenance) selon backlog  
- Maîtrise des coûts cloud / quotas LLM  

**Dire**
> Nous sommes honnêtes sur l’avancement : le rapport décrit la cible. Les frontières sont posées — BFF, modules, security groups, SSM — mais le durcissement Keycloak cloud, le TLS public et le renforcement Spring–Flask restent à finaliser. Cela n’invalide pas l’architecture ; ce sont les prochaines étapes.

---

### Diapo 23 — Bilan (~40 s) — Orateur D

**Contenu slide**
- Domaine explicite  
- Monolithe modulaire hexagonal  
- SPA filtrée par rôle  
- IA isolée  
- Infra as code  

**Dire**
> En bilan, LogiFlow est un TMS cohérent sur le plan architectural : domaine clair, backend modulaire, frontend par rôle, IA isolée, infrastructure reproductible. Ce projet nous a permis de mobiliser conception, full-stack, agents IA et DevSecOps.

---

### Diapo 24 — Perspectives (~40 s) — Orateur D

**Contenu slide**
1. Finaliser auth cloud + MFA  
2. HTTPS + domaine dédié  
3. Enrichir copilote / planification  
4. Extraire un module *seulement* si la charge le justifie  
5. Monitoring au-delà des healthchecks  

**Dire**
> Nos perspectives : finaliser l’auth cloud, exposer le frontend en HTTPS, enrichir les agents, et n’extraire un microservice que si la charge le justifie — les frontières `api` sont déjà prêtes. Enfin, industrialiser le monitoring.

---

### Diapo 25 — Remerciements / Questions (~20 s) — Orateur D (+ tous)

**Contenu slide**
- Remerciements jury + encadrant (Jaber EL BOUHDIDI)
- « Nous sommes prêts pour vos questions »  
- QR ou lien dépôt (optionnel)

**Dire**
> Nous vous remercions pour votre attention. L’équipe reste à votre disposition pour vos questions.

---

## 5. Questions probables du jury (préparer 1 réponse courte chacun)

| Thème | Question type | Réponse pivot (15–25 s) | Qui |
|-------|---------------|-------------------------|-----|
| Pourquoi monolithe ? | « Pourquoi pas microservices ? » | Un processus, frontières Modulith ; extraction plus tard si charge. | B |
| IA exposée ? | « Le front appelle-t-il Groq ? » | Non. Navigateur → Spring → Flask → LLM. | D |
| Hexagonal | « À quoi ça sert concrètement ? » | Domaine testable, indépendant de JPA/REST ; adapters interchangeables. | B |
| Rôles | « Comment évitez-vous 6 apps ? » | Une SPA + filtres menus/guards + RBAC JWT. | C |
| SSM | « Pourquoi pas SSH ? » | Surface d’attaque ; Session Manager IAM, pas de port 22. | D |
| LLM déterministe | « Et si le LLM hallucine un score ? » | Scores calculés en code ; LLM = rédaction seulement. | D |
| Avancement | « Qu’est-ce qui n’est pas fini ? » | Diapo 22 : Keycloak cloud, TLS, mTLS, profondeur agents. | D / A |
| Données | « Comment liez-vous les modules ? » | UUID / événements ; pas de FK JPA transverses. | B |
| Coûts | « Combien coûte AWS ? » | NAT + EC2 IA = postes sensibles ; monitoring coûts prévu. | D |
| Tests | « Quelle qualité ? » | ArchUnit / Modulith en CI ; tests module ; (citer couverture si vous en avez). | B |

**Règle Q&R :** celui qui a présenté le sujet répond en premier ; les autres complètent en 1 phrase max.

---

## 6. Checklist de préparation (J−7 → J)

### J−7
- [ ] Remplir noms / rôles dans ce plan et sur la diapo 1  
- [ ] Créer le deck (PowerPoint / Google Slides / Beamer) — **1 idée / slide**  
- [ ] Extraire figures du rapport : C4, flux, modules, états, Gantt, 4–6 screenshots  
- [ ] Enregistrer vidéo démo 3 min (secours)

### J−3
- [ ] Répétition chronométrée ×2 (objectif ≤ 23 min)  
- [ ] Vérifier environnement démo (comptes Keycloak, données seed)  
- [ ] Préparer réponses tableau §5 à voix haute  

### J−1
- [ ] Clé USB + PDF rapport + deck + vidéo  
- [ ] Mode avion / hotspot testé  
- [ ] Tenue / arrivée 20 min avant  

### Jour J
- [ ] Tester vidéo-projecteur + son  
- [ ] Ouvrir démo **avant** l’appel  
- [ ] Une personne note les questions du jury  

---

## 7. Conseils oraux (courts)

1. **Ne pas lire** le rapport : le jury l’a ; vous racontez les décisions.  
2. **Montrer les figures** (C4, cycle états, modules) plutôt que des listes de tech.  
3. **Dire « cible / en cours »** pour la sécu — crédibilité > perfection.  
4. **Démo** : scénario écrit sur papier à côté du clavier.  
5. **Temps** : si retard à 12 min, **couper** diapo 12 et raccourcir IA à 2 puces.

---

## 8. Mapping rapport → slides (référence rapide)

| Chapitre rapport | Slides |
|------------------|--------|
| 1 Introduction | 3–6 |
| 2 Conception | 7 |
| 3 Architecture | 8–10 |
| 4 + 4b Frontend / captures | 13–17 |
| 5 Backend | 11–12 |
| 6 IA | 18–19 |
| 7 Infra | 20 |
| 8 Sécurité | 21–22 |
| 9 Conclusion | 23–25 |

---

## 9. Orateurs (rôles projet)

| Slot | Nom | Annoncer |
|------|-----|----------|
| Orateur A + B | **STITOU Ibrahim** | Chef de projet · Responsable Backend |
| Orateur C | **ZOUAINE Oussama** | Responsable Frontend · Infra / DevOps |
| Orateur D (IA) | **ES-SEMLLALI Oussama** | Responsable IA |
| Orateur D′ (sécu + clôture) | **RAHALI Hamza** | Responsable Sécurité |

**Phrase d’ouverture équipe (10 s après A)**  
> Nous avons réparti le travail ainsi : Ibrahim sur le pilotage et le backend, Oussama Zouaine sur le frontend et l’infra, Hamza sur la sécurité, Oussama Es-Semllali sur l’IA — avec des revues communes à chaque sprint.

---

*Document généré pour la soutenance LogiFlow à partir du rapport de projet tutoré. Adapter les durées si le jury impose un format différent.*
