# Life25 Fluidity Blueprint

Questo documento analizza e definisce i parametri tecnici che rendono l'animazione della scia immagini (Image Trail) "premium" e fluida, basandosi sulla versione stabile di `main`.

## 1. Il Triangolo della Fluidità
La fluidità è determinata dal bilanciamento di tre fattori:
*   **Peso degli Asset**: Ogni immagine deve pesare tra **300KB e 600KB**. Oltre i 1MB, la decodifica GPU causa micro-scatti (lag).
*   **Densità del DOM**: Massimo **15 elementi attivi** contemporaneamente (`maxActiveImages: 15`).
*   **Soglia di Campionamento**: Una `mouseThreshold` di **80** garantisce che le immagini non si sovrappongano troppo, riducendo il numero di ricalcoli di layout.

## 2. Parametri CONFIG "Golden" (da main)
```typescript
const CONFIG = {
  mouseThreshold: 80,       // Distanza minima tra immagini
  imageLifespan: 1200,      // Persistenza visiva
  inDuration: 0.4,          // Velocità di comparsa
  outDuration: 0.8,         // Morbidezza della scomparsa
  baseRotation: 15,         // Rotazione organica
  maxRotationFactor: 2.0,   // Dinamismo basato sulla velocità
  minImageSize: 180,        // Dimensione minima
  maxImageSize: 350,        // Dimensione massima al picco di velocità
  speedSmoothingFactor: 0.1, // Fluidità dell'interpolazione
  maxActiveImages: 15,      // Limite fisico nodi DOM
};
```

## 3. Logica di Rendering
*   **GSAP Ticker**: Utilizzo del ticker nativo di GSAP per sincronizzare l'animazione con il refresh rate del monitor.
*   **Math.hypot**: Calcolo reale della distanza per una reattività organica.
*   **Eager Loading**: Le immagini devono essere caricate con `loading="eager"` per essere pronte all'istante sotto il cursore.

## 4. Piano d'Azione per il Branch di Lavoro
1. **Compressione Asset**: Portare le 15 nuove immagini scelte dall'utente sotto i 600KB l'una.
2. **Restore Logica**: Copiare 1:1 la struttura del componente `Life25.tsx` da `main`.
3. **Skinning Estetico**: Applicare solo le modifiche CSS (background rosa, testo nero, L maiuscola, corner labels Automat).
4. **Mobile Fix**: Mantenere la riga di comando flex per evitare la sovrapposizione delle lettere, ma usando i tempi di animazione di `main`.
