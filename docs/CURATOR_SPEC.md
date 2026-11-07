# Specifica Comportamentale del Curatore AI (`LifeRagEngine`)

Questo documento definisce il comportamento deterministico del backend RAG del **LIFE Design Festival 2026** (`backend/core/`): riconoscimento degli intenti, gestione della memoria di sessione, selezione del contesto e risoluzione di immagini (composite vs. singole) e link verificati.

---

## 1. Saluto Veloce (`S0` — Nessuna chiamata all'LLM)

| Regola | Comportamento |
| :--- | :--- |
| **S0.1** | Il messaggio utente viene convertito in minuscolo, privato della punteggiatura (`[^\w\s]`) e degli spazi laterali. Se coincide esattamente con `ciao`, `buongiorno` o `hey`, il backend risponde immediatamente con il messaggio di benvenuto dell'edizione (`images=[]`, `links=[]`, `source="system"`), senza invocare l'LLM. Frasi più lunghe (es. *"ciao come va?"*) proseguono verso il flusso RAG. |

---

## 2. Riconoscimento degli Intenti (`S1`)

La funzione `detect_intents(message, edition)` analizza il messaggio utente in minuscolo e produce una mappa booleana di intenti:

| Intento | Regola di attivazione |
| :--- | :--- |
| `sponsor` | Sottostringhe: `sponsor`, `partner`, `sostengono`, `loghi`, `chi supporta`. |
| `program` | Sottostringhe: `programma`, `calendario`, `cosa succede`, `cosa c'è`, `attività`. |
| `total` | Sottostringhe: `tutti`, `tutto`, `completo`, `elenco`, `lista`, `quali sono`, `chi sono i`, `chi sono gli`. Forzato a `False` se è attivo `social` o `lodging`. |
| `explicit_list` | Sottostringhe di elenco esplicito: `tutti`, `tutto`, `completo`, `elenco`, `lista`. |
| `speaker` | Sottostringhe: `speaker`, `protagonisti`, `chi parla`, `nomi`, `ospiti`, `chi è`, `chi sono`, `parlano`. |
| `<day.key>` (`friday`, `saturday`) | Sottostringhe definite in `edition.json` per ciascun giorno (`venerdì`, `venerdi`, `5 giugno`, `05/06`, `5/6`, `day 1`, `primo giorno`; `sabato`, `6 giugno`, `06/06`, `6/6`, `day 2`, `secondo giorno`). |
| `morning` | Espressione regolare a parola intera: `\bmattina\b`, `\bmattino\b`, `\bore 09\b`, `\bore 10\b`, `\bore 11\b`, `\bore 12\b`. |
| `afternoon` | Espressione regolare: `pomeriggio` (inclusi i refusi `pomeirggio`, `pomerigio`), `\bore 14\b`, `\bore 15\b`, `\bore 16\b`, `\bore 17\b`, `\bore 18\b`. |
| `workshop` | Sottostringa: `workshop`. |
| `ticket` | Sottostringhe esplicite (`bigliett`, `ticket`, `eventbrite`, `iscriv`) oppure espressioni di prezzo (`quanto costa`, `costo`, `prezzo`). Se `workshop` è attivo, le sole espressioni di prezzo (es. *"quanto costa il workshop di Zetafonts?"*) non attivano `ticket` a meno che non sia presente anche una parola esplicita di biglietteria. |
| `social` | Espressione regolare a parola intera: `\b(?:social\w*|instagram|facebook|linkedin|ig|fb|segui(?:re|rvi|rti|ci|te|teci)?)\b` (evitando falsi positivi su sottostringhe come *"b**ig**lietto"*, *"m**ig**liore"*, *"fam**ig**lia"*, *"pomer**ig**gio"* o *"in **segui**to"*). |
| `lodging` | Sottostringhe: `hotel`, `dormire`, `alloggio`, `alloggiare`, `b&b`, `convento`, `convenzionati`, `dove stare`. |
| `team` | Sottostringhe base (`organizz`, `chi siete`, `fiiico`, `chi ha fatto`, `chi cura`, `curatori`) più i nomi propri dei membri in `edition.json` (`rossana`, `federico`, `michele`, `massimiliano`). |
| `specific_member` | Presenza di un nome o cognome di un membro del team (`rossana`, `federico`, `michele`, `massimiliano`, `caggiano`, `arleo`, `luciani`, `zaccagnino`). |

---

## 3. Catalogo Entità e Riconoscimento Nomi nella Domanda (`S2`)

All'avvio (o tramite funzione pura in `core/registry.py`), il sistema costruisce un catalogo delle entità con `"type": "speaker"` o `"type": "sponsor"` dai blocchi `METADATA` di `backend/knowledge/*.md`:

1. **Generazione degli alias per entità**:
   - Nome ufficiale (`metadata["name"]`) e `id` del catalogo se privo di trattino (`>= 3` caratteri, es. `bcc`, `msd`, `aipi`).
   - Nome e titolo dell'intestazione privi di suffissi generici finali (`studio`, `design`, `magazine`, `records`, `fotoproduzioni`).
   - Nomi propri di persone (di almeno 2 parole) indicati tra parentesi nell'intestazione Markdown (es. `## Cromia Design (Samuela Vaccari)` -> `samuela vaccari`; `## Zetafonts (Cosimo L. Pancini & Dario Manzo)` -> `cosimo l. pancini`, `cosimo pancini`, `dario manzo`).
2. **Matching nella domanda utente**:
   - Confronto normalizzato senza accenti, a parola intera (`>= 3` caratteri).
   - **Regola della maiuscola per alias a parola singola**: gli alias composti da **2 o più parole** (es. `brutto studio`, `dario manzo`, `bcc basilicata`) sono riconosciuti in qualsiasi forma (maiuscola o minuscola); gli alias di **una sola parola** (es. `Brutto`, `Cosmico`, `Zetafonts`, `BCC`, `ADI`) sono validi solo se nel testo originale della domanda iniziano con lettera **maiuscola**, evitando che aggettivi comuni minuscoli nella domanda (es. *"Il programma è brutto?"*) attivino `S5`.
   - In caso di alias sovrapposti vince l'alias più lungo; le entità riconosciute vengono ordinate per **posizione di prima apparizione nella domanda** e deduplicate.
3. **Disambiguazione `Zetafonts`**:
   - Poiché Zetafonts è presente sia come speaker (`zetafonts`) sia come partner (`zetafonts-partner`), se nella domanda è attivo l'intento `sponsor` viene risolto come `zetafonts-partner`; in tutti gli altri casi come `zetafonts`.
4. **Esclusione Workshop e Team**:
   - Se la domanda riguarda un `workshop` (es. *"Quando era il workshop di Zetafonts?"*), il riconoscimento `S5` è disattivato e si applica la risoluzione standard dei workshop (`S4`).
   - I profili dei curatori (`type: "curator"` / `"team"`) seguono sempre la logica dedicata del team (`S4.3`).

---

## 4. Preparazione della Ricerca e Memoria Conversazionale (`S3`)

| Regola | Comportamento |
| :--- | :--- |
| **S3.1** | `top_k = 40` se è attivo almeno uno tra `program`, `total`, `speaker`, `afternoon`; altrimenti `top_k = 20`. |
| **S3.2** | Con `top_k = 40`, viene accodata al messaggio l'istruzione: `(MANDATORIO: Usa [[REF:registry-speakers]] e tagga ogni speaker citato con [[REF:id]].)`. |
| **S3.3** | Se `sponsor` è attivo: `(MANDATORIO: Usa [[REF:global-partners]])`. |
| **S3.4** | Se `lodging` è attivo: `(MANDATORIO: Usa [[REF:ospitalita-convenzionata]])`. |
| **S3.5** | Se `team` è attivo: con `specific_member` aggiunge `(MANDATORIO: Usa il tag [[REF:nome-cognome-vision]] specifico richiesto.)`; altrimenti `(MANDATORIO: Usa [[REF:fiiico-creative]])`. |
| **S3.6** | **Memoria unica per sessione**: ogni `session_id` possiede una sola istanza di `ChatMemoryBuffer(token_limit=3000)` in `TTLCache(maxsize=500, ttl=3600)` protetta da `threading.Lock`, condivisa anche quando `top_k` varia tra `20` e `40` nei turni successivi della stessa conversazione. |

---

## 5. Risoluzione Standard — Domande Generali senza Nomi Specifici (`S4`)

Quando la domanda utente **non** nomina speaker o sponsor specifici (oppure riguarda un `workshop`), si applicano in sequenza le regole `S4.1–S4.4`.

### 5.1 Raccolta degli ID Attivi (`S4.1`, ordine deterministico di prima apparizione)
1. **Tag espliciti**: tutti i tag `[[REF:id]]` presenti nella risposta dell'LLM, nell'ordine esatto in cui compaiono nel testo.
2. **Safety-net testuale**: per ogni slug del registro statico (`load_static_links`), si ricava `clean_name` rimuovendo `-studio`, `-design`, `-creative`, `-vision` e sostituendo `-` con spazio:
   - Se lo slug termina con `-vision` ed è attivo `specific_member`, lo slug viene aggiunto solo se `clean_name` compare come sottostringa nella **domanda** dell'utente.
   - Negli altri casi, lo slug viene aggiunto se `clean_name` compare come **parola intera con iniziale maiuscola** nel testo originale della risposta dell'LLM (evitando falsi positivi su parole comuni minuscole come *"brutto"* o *"cosmico"* e sui tag minuscoli `[[REF:workshop-zetafonts]]`).
3. **Filtro temporale per giorno/fascia**: se nella domanda è richiesto un giorno (`friday` -> `2026-06-05`, `saturday` -> `2026-06-06`), vengono aggiunti i nodi recuperati aventi `metadata["date"]` uguale a quel giorno e orario compatibile con la fascia richiesta (`morning`: `09:00 <= time <= 13:30`; `afternoon`: `time > 13:30`; nessuna fascia: tutti i nodi del giorno).

### 5.2 Gerarchia delle Immagini (`S4.2` — Mutuamente Esclusiva)

| Priorità | Condizione | Immagini restituite |
| :--- | :--- | :--- |
| **1 (Sponsor Wall)** | `intents["sponsor"]` è `True` | Solo `/assets/logos/Partner & Sponsor.webp` (`sponsor-wall`). |
| **2 (Gallerie Programma)** | (`total` o `program` o giorno richiesto) **e non** (`workshop` o `ticket`) | Gallerie composite del programma:<br>- Giorno + `morning` -> `gallery-<day>-morning`<br>- Giorno + `afternoon` -> `gallery-<day>-afternoon`<br>- Solo giorno -> mattina + pomeriggio di quel giorno (2 immagini)<br>- Nessun giorno -> tutte le 4 gallerie (`friday` + `saturday`, mattina + pomeriggio). |
| **3 (Ritratti / Loghi Singoli)** | Tutti gli altri casi | Immagini singole degli ID attivi in ordine (`edition.assets.get(id)` o `node_map[id].get("img")`), senza duplicati. Limite massimo: **5** se `workshop`, `ticket` o `len(active_ids) <= 2`; altrimenti **10**. |

### 5.3 Risoluzione dei Link (`S4.3`)
1. **Link di intenti globali**:
   - Se `intents["ticket"]` è `True` **oppure** la parola `"ticket"` compare nella risposta dell'LLM -> URL Eventbrite.
   - Se `intents["social"]` è `True` -> i 3 URL social ufficiali (Instagram, Facebook, LinkedIn).
   - Se `intents["lodging"]` è `True` -> i 4 URL delle strutture convenzionate.
2. **Link delle entità attive**:
   - Per ogni ID attivo (in ordine): se `specific_member` è `True`, gli ID collettivi (`fiiico-creative`, `fiiico-creative-vision`, `retro-gusto`) vengono esclusi.
   - Priorità della fonte URL per ciascun ID: `registry_links` (estratti dai nodi registro recuperati) > `static_links` (da `knowledge/*.md`) > `node_map[id].get("web")`.
   - Tutti i link vengono deduplicati preservando l'ordine di inserimento.

### 5.4 Pulizia del Testo e Gestione Errori (`S4.4`)
- Tutti i marcatori `[[REF:...]]` vengono rimossi dal testo finale tramite regex.
- In caso di eccezione durante l'esecuzione RAG, il sistema restituisce `edition.error_text`, `images=[]`, `links=list(edition.error_links)` e `source="error"`.

---

## 6. Risoluzione per Entità Nominate nella Domanda (`S5` — 1..N Sponsor o Speaker)

Quando la domanda dell'utente nomina esplicitamente **1 o più speaker o sponsor** del catalogo (`S2`) e **non** è attivo l'intento `workshop`:

| Caso | Condizione nella domanda | Immagini restituite | Link restituiti |
| :--- | :--- | :--- | :--- |
| **S5.A (Nomi senza elenco esplicito)** | La domanda nomina $N$ entità (anche con formule come *"Chi sono gli sponsor X, Y..."*, *"Chi sono gli speaker X e Y?"* o citando un giorno come *"Cosa ha fatto Cosmico sabato?"*), **senza** parole di elenco esplicito (`tutti`, `tutto`, `elenco`, `lista`, `completo`). | **Solo le $N$ immagini singole** (`img` da catalogo/metadati) delle entità nominate, nell'ordine esatto in cui compaiono nella domanda, **senza** `sponsor-wall`, **senza** gallerie del programma e **senza** troncamento a 5/10. | Eventuali link di intenti espliciti richiesti dall'utente (`ticket`, `social`, `lodging`), seguiti **esclusivamente dagli $N$ link** (`web` o `static_links`) delle entità nominate in ordine. Ignorati tag dell'LLM, safety-net e altri nodi del giorno. |
| **S5.B (Nomi + elenco esplicito)** | La domanda nomina $N$ entità **e** contiene una parola di elenco esplicito (`tutti`, `tutto`, `elenco`, `lista`, `completo`, es. *"Fammi l'elenco completo degli sponsor, tipo Autoelite"* o *"Programma completo, tipo Cosmico"*). | **Prima le immagini composite** previste da `S4.2` (`sponsor-wall` se `sponsor`, oppure le gallerie del programma), **seguite dalle $N$ immagini singole** delle entità nominate in ordine. | Eventuali link di intenti espliciti richiesti dall'utente, seguiti **esclusivamente dagli $N$ link** delle entità nominate in ordine. |

---

## 7. Scelte Progettuali Mantenute di Proposito

- **Domanda generale sugli speaker (*"Chi sono gli speaker?"*)**: quando non vengono nominati speaker specifici nella domanda, l'espressione *"chi sono gli"* attiva `total` e restituisce le 4 gallerie composite del programma completo.
- **Parola `"ticket"` nella risposta dell'LLM (in modalità `S4`)**: se l'AI suggerisce l'acquisto del ticket nel testo di risposta a una domanda generale (es. *"Come posso partecipare?"*), viene allegato automaticamente il bottone Eventbrite.
- **Contesto esteso per il pomeriggio (`afternoon` -> `top_k = 40`)**: qualsiasi domanda che menziona il pomeriggio recupera 40 nodi per garantire visibilità completa sugli slot pomeridiani.

---

## 8. Limiti Noti

1. **Fascia oraria senza giorno (*"Cosa c'è la mattina?"*)**: in assenza di un giorno specifico nella domanda, `S4.2` restituisce tutte le 4 gallerie del programma anziché filtrare le sole 2 gallerie mattutine.
2. **Domande di follow-up sul turno successivo (*"E il pomeriggio?"*)**: mentre il testo generato dall'LLM mantiene il contesto conversazionale tramite la memoria condivisa per `session_id` (`S3.6`), la risoluzione deterministica delle immagini `S4.2` valuta gli intenti sul singolo messaggio corrente e non eredita automaticamente il giorno dal turno precedente.
3. **Entrambi i giorni nella stessa domanda (*"Programma venerdì e sabato"*)**: `requested_day()` restituisce il primo giorno configurato che fa match (`friday`), mostrando le 2 gallerie di venerdì anziché tutte e 4.
4. **Safety-net su parole a inizio frase o nomi di una sola parola scritti in minuscolo (`S2`, `S4.1`)**:
   - Un nome di entità composto da una sola parola scritto interamente in minuscolo nella domanda (es. *"parlami di zetafonts"*) non attiva `S5` e ricade sulla risoluzione standard `S4` (dove viene comunque risolto tramite il tag `[[REF:zetafonts]]` emesso dall'LLM).
   - La safety-net basata sull'iniziale maiuscola può attivarsi se una parola omonima compare come prima parola assoluta di una frase; viceversa, lo studio scritto in minuscolo nei dati (`dverso studio`) viene risolto tramite il tag `[[REF:dverso-studio]]` o quando citato per intero nella domanda (`dverso studio`, 2 parole), ma non dalla sola safety-net se scritto in minuscolo senza tag nella risposta.
5. **Immagini collettive su domanda di un singolo curatore (*"Chi è Rossana?"*)**: la soppressione degli ID collettivi (`fiiico-creative`, `fiiico-creative-vision`, `retro-gusto`) quando `specific_member` è attivo si applica ai `links` ma non filtra un'eventuale immagine associata a `retro-gusto` se l'LLM emette esplicitamente `[[REF:retro-gusto]]`.
