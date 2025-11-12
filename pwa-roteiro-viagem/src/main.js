window.addEventListener("DOMContentLoaded", () => {
  let db;
  const form = document.getElementById("localForm");
  const lista = document.getElementById("local-list");
  const mapa = document.getElementById("mapa");

  const request = indexedDB.open("roteiroDB", 1);
  request.onupgradeneeded = e => {
    db = e.target.result;
    db.createObjectStore("locais", { keyPath: "id", autoIncrement: true });
  };
  request.onsuccess = e => {
    db = e.target.result;
    listarLocais();
  };
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    if (!nome) return alert("Digite o nome do local!");

    const tx = db.transaction(["locais"], "readwrite");
    tx.objectStore("locais").add({ nome });
    tx.oncomplete = listarLocais;
    form.reset();
  });
  function listarLocais() {
    const tx = db.transaction(["locais"], "readonly");
    const store = tx.objectStore("locais");
    store.getAll().onsuccess = e => {
      const locais = e.target.result;
      lista.innerHTML = locais.length
        ? locais.map(l => `
            <div class="local-item">
              <p><b>${l.nome}</b></p>
              <button onclick="verMapa('${encodeURIComponent(l.nome)}')">Ver no mapa</button>
              <button onclick="removerLocal(${l.id})">Excluir</button>
            </div>
          `).join("")
        : "<p>Nenhum local salvo ainda.</p>";
    };
  }
  window.verMapa = nome => {
    mapa.src = `https://www.google.com/maps?q=${nome}&z=14&output=embed`;
  };
  window.removerLocal = id => {
    const tx = db.transaction(["locais"], "readwrite");
    tx.objectStore("locais").delete(id);
    tx.oncomplete = listarLocais;
  };
  window.addEventListener("offline", () => {
    console.log("offline");
    window.location.href = "offline.html";
  });
  window.addEventListener("online", () => {
    console.log("recarregando aplicação");
    if (window.location.pathname.endsWith("offline.html")) {
      window.location.href = "/index.html";
    } else {
      window.location.reload();
    }
  });
});
