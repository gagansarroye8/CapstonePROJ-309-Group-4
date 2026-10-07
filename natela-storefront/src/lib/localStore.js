/* ---------------------------------------------------------
   Tiny localStorage helper.

   WHY THIS EXISTS: until product-service and order-service are
   live, the catalogue and the cart only live in React state —
   which means a page refresh throws them away. That makes the
   app feel broken when you demo it.

   Saving to localStorage keeps them between refreshes on this
   one browser. It is a stand-in, not a real backend: nothing
   here is shared between devices or between users.

   WHEN THE BACKEND IS READY: delete the calls to these helpers
   from ProductsContext (the server owns the catalogue then).
   Keep them for the cart if you want a guest cart that survives
   a refresh — that is normal even with a backend.
   --------------------------------------------------------- */

export function load(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    /* private browsing, blocked storage, or bad JSON — just use the fallback */
    return fallback;
  }
}

export function save(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — not worth breaking the page over */
  }
}
