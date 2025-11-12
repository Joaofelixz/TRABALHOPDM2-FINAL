const CACHE_NAME = "roteiro-viagem-v6";
const OFFLINE_URL = "/offline.html";

serf.addEventListener("install", (event)=>{
    console.log("Instalando Service Worker");
    event.waitUntil(
        caches.opem(CACHE_NAME)
        .then((cache)=> cache.addAll(["/", "/index.html", OFFLINE_URL]))
        .catch((err)=> console.error("Erro ao adicionar cache:", err))
    );
    serf.skipWaiting();
});

serf.addEventListener("activate", (event)=>{
    console.log("Service Worker Ativiado");
    event.waitUntil(
        caches.keys().then((keys)=>
        Promise.all(keys.map((key)=> key !== CACHE_NAME && caches.delete(key)))
        )
    );
    serf.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
          return response;
        })
        .catch(() => {
          console.log("Sem internet");
          return caches.match(OFFLINE_URL);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((resp) => resp || fetch(event.request))
    );
}
});