"use strict";

/* =========================
   UTILHUB V10 — NOVA
========================= */

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

/* =========================
   NOVA FLOW
========================= */

const particlesContainer = $("#particles");
const starsContainer = $("#stars");

function createParticles() {

  if (!particlesContainer) return;

  particlesContainer.innerHTML = "";

  for (let i = 0; i < 45; i++) {

    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = (8 + Math.random() * 16) + "s";
    particle.style.animationDelay = (-Math.random() * 15) + "s";
    particle.style.opacity = (.2 + Math.random() * .7).toFixed(2);

    particlesContainer.appendChild(particle);
  }
}

function createStars() {

  if (!starsContainer) return;

  starsContainer.innerHTML = "";

  for (let i = 0; i < 70; i++) {

    const star = document.createElement("span");

    star.className = "star";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = (-Math.random() * 6) + "s";

    starsContainer.appendChild(star);
  }
}

createParticles();
createStars();

/* =========================
   CURSOR EFFECT
========================= */

let cursorEnabled =
  localStorage.getItem("utilhub_cursor") !== "false";

document.addEventListener("pointermove", event => {

  if (!cursorEnabled) return;

  const x = event.clientX / window.innerWidth - .5;
  const y = event.clientY / window.innerHeight - .5;

  document.documentElement.style.setProperty(
    "--mouse-x",
    `${x * 20}px`
  );

  document.documentElement.style.setProperty(
    "--mouse-y",
    `${y * 20}px`
  );

  const orbs = $$(".nova-orb");

  if (orbs.length >= 3) {

    orbs[0].style.transform =
      `translate(${x * 25}px, ${y * 25}px)`;

    orbs[1].style.transform =
      `translate(${-x * 35}px, ${-y * 35}px)`;

    orbs[2].style.transform =
      `translate(${x * 15}px, ${-y * 15}px)`;
  }
});

/* =========================
   MENU
========================= */

const menuButton = $("#menuButton");
const mainNav = $("#mainNav");

menuButton?.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

$$("nav a").forEach(link => {

  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });

});

/* =========================
   CONEXIÓN
========================= */

function updateConnection() {

  const status = $("#connectionStatus");

  if (!status) return;

  if (navigator.onLine) {
    status.textContent = "● Conectado";
  } else {
    status.textContent = "● Modo sin conexión";
  }
}

window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);

updateConnection();

/* =========================
   TEMA
========================= */

const darkMode = $("#darkMode");

function loadTheme() {

  const saved = localStorage.getItem("utilhub_theme");

  if (saved === "light") {
    document.body.classList.add("light");

    if (darkMode) {
      darkMode.checked = false;
    }
  } else {
    document.body.classList.remove("light");

    if (darkMode) {
      darkMode.checked = true;
    }
  }
}

loadTheme();

darkMode?.addEventListener("change", () => {

  if (darkMode.checked) {

    document.body.classList.remove("light");
    localStorage.setItem("utilhub_theme", "dark");

  } else {

    document.body.classList.add("light");
    localStorage.setItem("utilhub_theme", "light");

  }

});

/* =========================
   ANIMACIONES
========================= */

const animations = $("#animations");

function loadAnimations() {

  const enabled =
    localStorage.getItem("utilhub_animations") !== "false";

  document.body.classList.toggle("no-animation", !enabled);

  if (animations) {
    animations.checked = enabled;
  }
}

loadAnimations();

animations?.addEventListener("change", () => {

  const enabled = animations.checked;

  document.body.classList.toggle(
    "no-animation",
    !enabled
  );

  localStorage.setItem(
    "utilhub_animations",
    String(enabled)
  );
});

/* =========================
   CURSOR SETTINGS
========================= */

const cursorEffect = $("#cursorEffect");

if (cursorEffect) {
  cursorEffect.checked = cursorEnabled;
}

cursorEffect?.addEventListener("change", () => {

  cursorEnabled = cursorEffect.checked;

  localStorage.setItem(
    "utilhub_cursor",
    String(cursorEnabled)
  );
});

/* =========================
   FILTROS
========================= */

$$(".filter").forEach(button => {

  button.addEventListener("click", () => {

    $$(".filter").forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");

    const filter = button.dataset.filter;

    $$(".tool-card").forEach(card => {

      if (
        filter === "all" ||
        card.dataset.category === filter
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }

    });

  });

});

/* =========================
   BÚSQUEDA GLOBAL
========================= */

const globalSearch = $("#globalSearch");

function searchTools(query) {

  const text = query
    .toLowerCase()
    .trim();

  if (!text) {

    $$(".tool-card").forEach(card => {
      card.style.display = "";
    });

    return;
  }

  $$(".tool-card").forEach(card => {

    const content =
      card.textContent.toLowerCase();

    card.style.display =
      content.includes(text) ? "" : "none";

  });
}

globalSearch?.addEventListener(
  "input",
  event => searchTools(event.target.value)
);

document.addEventListener("keydown", event => {

  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {

    event.preventDefault();

    globalSearch?.focus();
  }

});

/* =========================
   MODAL
========================= */

const modal = $("#toolModal");
const modalBody = $("#modalBody");
const modalClose = $("#modalClose");

function openModal(content) {

  modalBody.innerHTML = content;

  modal.classList.add("open");
}

function closeModal() {

  modal.classList.remove("open");
  modalBody.innerHTML = "";
}

modalClose?.addEventListener(
  "click",
  closeModal
);

modal?.addEventListener("click", event => {

  if (event.target === modal) {
    closeModal();
  }

});

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }

});

/* =========================
   CALCULADORA SEGURA
========================= */

function calculateExpression(expression) {

  let position = 0;

  const input = expression
    .replace(/,/g, ".")
    .replace(/\s+/g, "");

  function parseExpression() {

    let value = parseTerm();

    while (
      input[position] === "+" ||
      input[position] === "-"
    ) {

      const operator = input[position++];

      const next = parseTerm();

      value =
        operator === "+"
          ? value + next
          : value - next;
    }

    return value;
  }

  function parseTerm() {

    let value = parseFactor();

    while (
      input[position] === "*" ||
      input[position] === "/"
    ) {

      const operator = input[position++];

      const next = parseFactor();

      if (operator === "/") {

        if (next === 0) {
          throw new Error("No se puede dividir entre cero.");
        }

        value /= next;

      } else {

        value *= next;
      }
    }

    return value;
  }

  function parseFactor() {

    if (input[position] === "(") {

      position++;

      const value = parseExpression();

      if (input[position] !== ")") {
        throw new Error("Paréntesis incompletos.");
      }

      position++;

      return value;
    }

    if (input[position] === "-") {

      position++;

      return -parseFactor();
    }

    const start = position;

    while (
      position < input.length &&
      /[0-9.]/.test(input[position])
    ) {
      position++;
    }

    if (start === position) {
      throw new Error("Expresión no válida.");
    }

    const value =
      Number(input.slice(start, position));

    if (!Number.isFinite(value)) {
      throw new Error("Número no válido.");
    }

    return value;
  }

  const result = parseExpression();

  if (position !== input.length) {
    throw new Error("Expresión no válida.");
  }

  return result;
}

/* =========================
   TOOL TEMPLATES
========================= */

function calculatorTool() {

  return `
    <h2>🧮 Calculadora</h2>

    <div class="tool-form">

      <input
        id="calcInput"
        placeholder="Ejemplo: 25 * (4 + 2)"
      >

      <button class="btn primary" id="calcButton">
        Calcular
      </button>

      <div class="result" id="calcResult">
        Resultado:
      </div>

    </div>
  `;
}

function percentageTool() {

  return `
    <h2>% Porcentaje</h2>

    <div class="tool-form">

      <input id="percentValue" type="number" placeholder="Número">

      <input id="percentPercent" type="number" placeholder="Porcentaje">

      <button class="btn primary" id="percentButton">
        Calcular
      </button>

      <div class="result" id="percentResult">
        Resultado:
      </div>

    </div>
  `;
}

function discountTool() {

  return `
    <h2>🏷️ Descuento</h2>

    <div class="tool-form">

      <input id="discountPrice" type="number" placeholder="Precio">

      <input id="discountPercent" type="number" placeholder="Descuento %">

      <button class="btn primary" id="discountButton">
        Calcular
      </button>

      <div class="result" id="discountResult">
        Resultado:
      </div>

    </div>
  `;
}

function rule3Tool() {

  return `
    <h2>📐 Regla de 3</h2>

    <div class="tool-form">

      <input id="ruleA" type="number" placeholder="A">

      <input id="ruleB" type="number" placeholder="B">

      <input id="ruleC" type="number" placeholder="C">

      <button class="btn primary" id="ruleButton">
        Calcular X
      </button>

      <div class="result" id="ruleResult">
        X =
      </div>

    </div>
  `;
}

function converterTool() {

  return `
    <h2>🔄 Conversor</h2>

    <div class="tool-form">

      <input id="convertValue" type="number" placeholder="Valor">

      <select id="convertType">
        <option value="km-m">Kilómetros → Metros</option>
        <option value="m-km">Metros → Kilómetros</option>
        <option value="m-cm">Metros → Centímetros</option>
        <option value="cm-m">Centímetros → Metros</option>
        <option value="kg-g">Kilogramos → Gramos</option>
        <option value="g-kg">Gramos → Kilogramos</option>
        <option value="l-ml">Litros → Mililitros</option>
        <option value="ml-l">Mililitros → Litros</option>
      </select>

      <button class="btn primary" id="convertButton">
        Convertir
      </button>

      <div class="result" id="convertResult">
        Resultado:
      </div>

    </div>
  `;
}

function temperatureTool() {

  return `
    <h2>🌡️ Temperatura</h2>

    <div class="tool-form">

      <input id="tempValue" type="number" placeholder="Temperatura">

      <select id="tempType">
        <option value="c-f">°C → °F</option>
        <option value="f-c">°F → °C</option>
        <option value="c-k">°C → K</option>
        <option value="k-c">K → °C</option>
      </select>

      <button class="btn primary" id="tempButton">
        Convertir
      </button>

      <div class="result" id="tempResult">
        Resultado:
      </div>

    </div>
  `;
}

function ageTool() {

  return `
    <h2>🎂 Calculadora de edad</h2>

    <div class="tool-form">

      <input id="birthDate" type="date">

      <button class="btn primary" id="ageButton">
        Calcular edad
      </button>

      <div class="result" id="ageResult">
        Resultado:
      </div>

    </div>
  `;
}

function datesTool() {

  return `
    <h2>📅 Diferencia entre fechas</h2>

    <div class="tool-form">

      <input id="dateOne" type="date">

      <input id="dateTwo" type="date">

      <button class="btn primary" id="datesButton">
        Calcular
      </button>

      <div class="result" id="datesResult">
        Resultado:
      </div>

    </div>
  `;
}

function timerTool() {

  return `
    <h2>⏱️ Temporizador</h2>

    <div class="timer-display" id="timerDisplay">
      00:00
    </div>

    <div class="tool-form">

      <input
        id="timerSeconds"
        type="number"
        min="1"
        placeholder="Segundos"
      >

      <button class="btn primary" id="timerStart">
        Iniciar
      </button>

      <button class="btn secondary" id="timerStop">
        Detener
      </button>

      <button class="btn secondary" id="timerReset">
        Reiniciar
      </button>

    </div>
  `;
}

function stopwatchTool() {

  return `
    <h2>⏲️ Cronómetro</h2>

    <div class="stopwatch-display" id="stopwatchDisplay">
      00:00:00
    </div>

    <div class="tool-form">

      <button class="btn primary" id="stopwatchStart">
        Iniciar
      </button>

      <button class="btn secondary" id="stopwatchStop">
        Detener
      </button>

      <button class="btn secondary" id="stopwatchReset">
        Reiniciar
      </button>

    </div>
  `;
}

function notesTool() {

  return `
    <h2>📝 Notas</h2>

    <div class="tool-form">

      <textarea
        id="notesText"
        placeholder="Escribe tus notas..."
      ></textarea>

      <button class="btn primary" id="saveNotes">
        Guardar
      </button>

      <div class="result">
        Tus notas se guardan en este dispositivo.
      </div>

    </div>
  `;
}

function tasksTool() {

  return `
    <h2>✅ Tareas</h2>

    <div class="tool-form">

      <input
        id="taskInput"
        placeholder="Nueva tarea..."
      >

      <button class="btn primary" id="addTask">
        Agregar
      </button>

      <div class="result" id="taskList"></div>

    </div>
  `;
}

function shoppingListTool() {

  return `
    <h2>🛒 Lista de compras</h2>

    <div class="tool-form">

      <input
        id="shoppingItem"
        placeholder="Producto..."
      >

      <button class="btn primary" id="addShopping">
        Agregar
      </button>

      <div class="result" id="shoppingList"></div>

    </div>
  `;
}

function passwordTool() {

  return `
    <h2>🔐 Generador de contraseña</h2>

    <div class="tool-form">

      <input
        id="passwordLength"
        type="number"
        min="6"
        max="64"
        value="16"
        placeholder="Longitud"
      >

      <button class="btn primary" id="generatePassword">
        Generar
      </button>

      <div class="result" id="passwordResult">
        Tu contraseña aparecerá aquí.
      </div>

    </div>
  `;
}

function randomTool() {

  return `
    <h2>🎲 Número aleatorio</h2>

    <div class="tool-form">

      <input id="randomMin" type="number" placeholder="Mínimo">

      <input id="randomMax" type="number" placeholder="Máximo">

      <button class="btn primary" id="randomButton">
        Generar
      </button>

      <div class="result" id="randomResult">
        Resultado:
      </div>

    </div>
  `;
}

function diceTool() {

  return `
    <h2>🎯 Dado</h2>

    <div class="tool-form">

      <button class="btn primary" id="rollDice">
        Lanzar dado
      </button>

      <div class="result" id="diceResult">
        🎲
      </div>

    </div>
  `;
}

function textTool() {

  return `
    <h2>Aa Contador de texto</h2>

    <div class="tool-form">

      <textarea
        id="textInput"
        placeholder="Escribe o pega un texto..."
      ></textarea>

      <div class="result" id="textResult">
        Caracteres: 0 · Palabras: 0
      </div>

    </div>
  `;
}

function caseTool() {

  return `
    <h2>🔤 Conversor de texto</h2>

    <div class="tool-form">

      <textarea
        id="caseInput"
        placeholder="Escribe tu texto..."
      ></textarea>

      <button class="btn primary" id="upperCase">
        MAYÚSCULAS
      </button>

      <button class="btn secondary" id="lowerCase">
        minúsculas
      </button>

      <div class="result" id="caseResult"></div>

    </div>
  `;
}

function tipTool() {

  return `
    <h2>💡 Consejo</h2>

    <div class="tool-form">

      <button class="btn primary" id="newTip">
        Nuevo consejo
      </button>

      <div class="result" id="tipResult"></div>

    </div>
  `;
}

function dictionaryTool() {

  return `
    <h2>📖 Diccionario</h2>

    <div class="tool-form">

      <input
        id="dictionaryInput"
        placeholder="Escribe una palabra..."
      >

      <button class="btn primary" id="dictionaryButton">
        Buscar
      </button>

      <div class="result" id="dictionaryResult">
        Resultado:
      </div>

    </div>
  `;
}

/* =========================
   ABRIR HERRAMIENTAS
========================= */

const toolTemplates = {
  calculator: calculatorTool,
  percentage: percentageTool,
  discount: discountTool,
  rule3: rule3Tool,
  converter: converterTool,
  temperature: temperatureTool,
  age: ageTool,
  dates: datesTool,
  timer: timerTool,
  stopwatch: stopwatchTool,
  notes: notesTool,
  tasks: tasksTool,
  shoppingList: shoppingListTool,
  password: passwordTool,
  random: randomTool,
  dice: diceTool,
  text: textTool,
  case: caseTool,
  tip: tipTool,
  dictionary: dictionaryTool
};

$$(".tool-card").forEach(card => {

  card.addEventListener("click", () => {

    const tool = card.dataset.tool;

    if (toolTemplates[tool]) {

      openModal(toolTemplates[tool]());

      initializeTool(tool);
    }

  });

});

/* =========================
   INICIALIZAR HERRAMIENTAS
========================= */

function initializeTool(tool) {

  if (tool === "calculator") {

    $("#calcButton")?.addEventListener("click", () => {

      try {

        const result =
          calculateExpression($("#calcInput").value);

        $("#calcResult").textContent =
          `Resultado: ${result}`;

      } catch (error) {

        $("#calcResult").textContent =
          `Error: ${error.message}`;
      }

    });

  }

  if (tool === "percentage") {

    $("#percentButton")?.addEventListener("click", () => {

      const value = Number($("#percentValue").value);
      const percent = Number($("#percentPercent").value);

      $("#percentResult").textContent =
        `Resultado: ${(value * percent / 100).toFixed(2)}`;

    });

  }

  if (tool === "discount") {

    $("#discountButton")?.addEventListener("click", () => {

      const price = Number($("#discountPrice").value);
      const percent = Number($("#discountPercent").value);

      const discount =
        price * percent / 100;

      const finalPrice =
        price - discount;

      $("#discountResult").textContent =
        `Descuento: ${discount.toFixed(2)} · Precio final: ${finalPrice.toFixed(2)}`;

    });

  }

  if (tool === "rule3") {

    $("#ruleButton")?.addEventListener("click", () => {

      const a = Number($("#ruleA").value);
      const b = Number($("#ruleB").value);
      const c = Number($("#ruleC").value);

      if (a === 0) {

        $("#ruleResult").textContent =
          "A no puede ser 0.";

        return;
      }

      const x = b * c / a;

      $("#ruleResult").textContent =
        `X = ${x}`;

    });

  }

  if (tool === "converter") {

    $("#convertButton")?.addEventListener("click", () => {

      const value =
        Number($("#convertValue").value);

      const type =
        $("#convertType").value;

      const conversions = {
        "km-m": value * 1000,
        "m-km": value / 1000,
        "m-cm": value * 100,
        "cm-m": value / 100,
        "kg-g": value * 1000,
        "g-kg": value / 1000,
        "l-ml": value * 1000,
        "ml-l": value / 1000
      };

      $("#convertResult").textContent =
        `Resultado: ${conversions[type]}`;

    });

  }

  if (tool === "temperature") {

    $("#tempButton")?.addEventListener("click", () => {

      const value =
        Number($("#tempValue").value);

      const type =
        $("#tempType").value;

      let result;

      switch (type) {

        case "c-f":
          result = value * 9 / 5 + 32;
          break;

        case "f-c":
          result = (value - 32) * 5 / 9;
          break;

        case "c-k":
          result = value + 273.15;
          break;

        case "k-c":
          result = value - 273.15;
          break;

      }

      $("#tempResult").textContent =
        `Resultado: ${result.toFixed(2)}`;

    });

  }

  if (tool === "age") {

    $("#ageButton")?.addEventListener("click", () => {

      const birth =
        new Date($("#birthDate").value);

      if (Number.isNaN(birth.getTime())) {
        return;
      }

      const now = new Date();

      let age =
        now.getFullYear() - birth.getFullYear();

      const month =
        now.getMonth() - birth.getMonth();

      if (
        month < 0 ||
        (
          month === 0 &&
          now.getDate() < birth.getDate()
        )
      ) {
        age--;
      }

      $("#ageResult").textContent =
        `Tienes aproximadamente ${age} años.`;

    });

  }

  if (tool === "dates") {

    $("#datesButton")?.addEventListener("click", () => {

      const first =
        new Date($("#dateOne").value);

      const second =
        new Date($("#dateTwo").value);

      const difference =
        Math.abs(second - first);

      const days =
        Math.round(
          difference / 86400000
        );

      $("#datesResult").textContent =
        `Diferencia: ${days} días.`;

    });

  }

  if (tool === "timer") {

    let timerInterval = null;
    let endTime = null;
    let remaining = 0;

    const display = $("#timerDisplay");

    function formatTimer(seconds) {

      const min =
        Math.floor(seconds / 60)
          .toString()
          .padStart(2, "0");

      const sec =
        Math.floor(seconds % 60)
          .toString()
          .padStart(2, "0");

      return `${min}:${sec}`;
    }

    function updateTimer() {

      remaining =
        Math.max(
          0,
          Math.ceil(
            (endTime - Date.now()) / 1000
          )
        );

      display.textContent =
        formatTimer(remaining);

      if (remaining <= 0) {

        clearInterval(timerInterval);

        timerInterval = null;

        alert("⏱️ El temporizador terminó.");
      }
    }

    $("#timerStart")?.addEventListener("click", () => {

      const seconds =
        Number($("#timerSeconds").value);

      if (!Number.isFinite(seconds) || seconds <= 0) {
        return;
      }

      endTime =
        Date.now() + seconds * 1000;

      clearInterval(timerInterval);

      updateTimer();

      timerInterval =
        setInterval(updateTimer, 250);

    });

    $("#timerStop")?.addEventListener("click", () => {

      clearInterval(timerInterval);

      timerInterval = null;

    });

    $("#timerReset")?.addEventListener("click", () => {

      clearInterval(timerInterval);

      timerInterval = null;

      remaining = 0;

      display.textContent = "00:00";

    });

  }

  if (tool === "stopwatch") {

    let running = false;
    let startTime = 0;
    let elapsed = 0;
    let interval = null;

    const display = $("#stopwatchDisplay");

    function formatStopwatch(ms) {

      const total =
        Math.floor(ms / 1000);

      const hours =
        Math.floor(total / 3600)
          .toString()
          .padStart(2, "0");

      const minutes =
        Math.floor((total % 3600) / 60)
          .toString()
          .padStart(2, "0");

      const seconds =
        (total % 60)
          .toString()
          .padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    }

    function updateStopwatch() {

      if (running) {

        elapsed =
          Date.now() - startTime;

        display.textContent =
          formatStopwatch(elapsed);
      }

    }

    $("#stopwatchStart")?.addEventListener("click", () => {

      if (running) return;

      running = true;

      startTime =
        Date.now() - elapsed;

      interval =
        setInterval(updateStopwatch, 100);

    });

    $("#stopwatchStop")?.addEventListener("click", () => {

      running = false;

      clearInterval(interval);

      interval = null;

    });

    $("#stopwatchReset")?.addEventListener("click", () => {

      running = false;

      clearInterval(interval);

      interval = null;

      elapsed = 0;

      display.textContent =
        "00:00:00";

    });

  }

  if (tool === "notes") {

    const notesText = $("#notesText");

    notesText.value =
      localStorage.getItem("utilhub_notes") || "";

    $("#saveNotes")?.addEventListener("click", () => {

      localStorage.setItem(
        "utilhub_notes",
        notesText.value
      );

      alert("Notas guardadas.");

    });

  }

  if (tool === "tasks") {

    let tasks =
      JSON.parse(
        localStorage.getItem("utilhub_tasks") || "[]"
      );

    const list = $("#taskList");

    function renderTasks() {

      if (!tasks.length) {

        list.innerHTML =
          "No hay tareas.";

        return;
      }

      list.innerHTML =
        tasks.map((task, index) => `
          <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center;">
            <span style="flex:1;">
              ${escapeHTML(task)}
            </span>

            <button
              class="btn danger"
              data-delete-task="${index}"
            >
              ×
            </button>
          </div>
        `).join("");

      $$("[data-delete-task]").forEach(button => {

        button.addEventListener("click", () => {

          tasks.splice(
            Number(button.dataset.deleteTask),
            1
          );

          saveTasks();
          renderTasks();

        });

      });

    }

    function saveTasks() {

      localStorage.setItem(
        "utilhub_tasks",
        JSON.stringify(tasks)
      );

    }

    $("#addTask")?.addEventListener("click", () => {

      const input = $("#taskInput");

      const value =
        input.value.trim();

      if (!value) return;

      tasks.push(value);

      input.value = "";

      saveTasks();
      renderTasks();

    });

    renderTasks();

  }

  if (tool === "shoppingList") {

    let items =
      JSON.parse(
        localStorage.getItem("utilhub_shopping") || "[]"
      );

    const list = $("#shoppingList");

    function renderShopping() {

      if (!items.length) {

        list.innerHTML =
          "Tu lista está vacía.";

        return;
      }

      list.innerHTML =
        items.map((item, index) => `
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <span style="flex:1;">
              ${escapeHTML(item)}
            </span>

            <button
              class="btn danger"
              data-delete-shopping="${index}"
            >
              ×
            </button>
          </div>
        `).join("");

      $$("[data-delete-shopping]").forEach(button => {

        button.addEventListener("click", () => {

          items.splice(
            Number(button.dataset.deleteShopping),
            1
          );

          saveShopping();
          renderShopping();

        });

      });

    }

    function saveShopping() {

      localStorage.setItem(
        "utilhub_shopping",
        JSON.stringify(items)
      );

    }

    $("#addShopping")?.addEventListener("click", () => {

      const input =
        $("#shoppingItem");

      const value =
        input.value.trim();

      if (!value) return;

      items.push(value);

      input.value = "";

      saveShopping();
      renderShopping();

    });

    renderShopping();

  }

  if (tool === "password") {

    $("#generatePassword")?.addEventListener("click", () => {

      const length =
        Math.min(
          64,
          Math.max(
            6,
            Number($("#passwordLength").value) || 16
          )
        );

      const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";

      const values =
        new Uint32Array(length);

      crypto.getRandomValues(values);

      let password = "";

      for (let i = 0; i < length; i++) {

        password +=
          chars[values[i] % chars.length];

      }

      $("#passwordResult").textContent =
        password;

    });

  }

  if (tool === "random") {

    $("#randomButton")?.addEventListener("click", () => {

      let min =
        Number($("#randomMin").value);

      let max =
        Number($("#randomMax").value);

      if (min > max) {
        [min, max] = [max, min];
      }

      const result =
        Math.floor(
          Math.random() * (max - min + 1)
        ) + min;

      $("#randomResult").textContent =
        `Resultado: ${result}`;

    });

  }

  if (tool === "dice") {

    $("#rollDice")?.addEventListener("click", () => {

      const value =
        Math.floor(Math.random() * 6) + 1;

      $("#diceResult").textContent =
        `🎲 Salió: ${value}`;

    });

  }

  if (tool === "text") {

    $("#textInput")?.addEventListener("input", () => {

      const value =
        $("#textInput").value;

      const characters =
        value.length;

      const words =
        value.trim()
          ? value.trim().split(/\s+/).length
          : 0;

      $("#textResult").textContent =
        `Caracteres: ${characters} · Palabras: ${words}`;

    });

  }

  if (tool === "case") {

    $("#upperCase")?.addEventListener("click", () => {

      $("#caseResult").textContent =
        $("#caseInput").value.toUpperCase();

    });

    $("#lowerCase")?.addEventListener("click", () => {

      $("#caseResult").textContent =
        $("#caseInput").value.toLowerCase();

    });

  }

  if (tool === "tip") {

    const tips = [

      "Divide las tareas grandes en pasos pequeños.",
      "Organiza tus pendientes antes de comenzar.",
      "Guarda una copia de tus archivos importantes.",
      "Compara opciones antes de realizar una compra.",
      "Usa herramientas digitales para ahorrar tiempo.",
      "Revisa los datos antes de tomar una decisión."

    ];

    function newTip() {

      const tip =
        tips[Math.floor(
          Math.random() * tips.length
        )];

      $("#tipResult").textContent =
        tip;

    }

    $("#newTip")?.addEventListener(
      "click",
      newTip
    );

    newTip();

  }

  if (tool === "dictionary") {

    $("#dictionaryButton")?.addEventListener("click", async () => {

      const word =
        $("#dictionaryInput").value
          .trim()
          .toLowerCase();

      const result =
        $("#dictionaryResult");

      if (!word) {

        result.textContent =
          "Escribe una palabra.";

        return;
      }

      result.textContent =
        "Buscando...";

      try {

        const response =
          await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/es/${encodeURIComponent(word)}`
          );

        if (!response.ok) {
          throw new Error("No encontrada");
        }

        const data =
          await response.json();

        const entry =
          data[0];

        const meanings =
          entry.meanings || [];

        const text =
          meanings.slice(0, 3).map(
            meaning => {

              const definition =
                meaning.definitions?.[0]?.definition ||
                "Sin definición.";

              return `
                <strong>
                  ${escapeHTML(meaning.partOfSpeech || "")}
                </strong>
                <br>
                ${escapeHTML(definition)}
              `;
            }
          ).join("<br><br>");

        result.innerHTML = text;

      } catch {

        result.textContent =
          "No se encontró la palabra o no hay conexión.";

      }

    });

  }

}

/* =========================
   ESCAPAR HTML
========================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================
   COMIDA
========================= */

$("#foodButton")?.addEventListener("click", () => {

  const query =
    $("#foodSearch").value.trim();

  if (!query) return;

  const url =
    `https://www.google.com/maps/search/${encodeURIComponent(query + " restaurantes")}`;

  window.open(url, "_blank");

});

/* =========================
   COMPRAS
========================= */

$("#shoppingButton")?.addEventListener("click", () => {

  const query =
    $("#shoppingSearch").value.trim();

  if (!query) return;

  const url =
    `https://www.google.com/search?q=${encodeURIComponent(query + " comprar")}`;

  window.open(url, "_blank");

});

/* =========================
   CERCA DE MÍ
========================= */

$$("[data-near]").forEach(button => {

  button.addEventListener("click", () => {

    const query =
      button.dataset.near;

    const url =
      `https://www.google.com/maps/search/${encodeURIComponent(query + " cerca de mí")}`;

    window.open(url, "_blank");

  });

});

/* =========================
   EXPORTAR DATOS
========================= */

$("#exportData")?.addEventListener("click", () => {

  const data = {

    notes:
      localStorage.getItem("utilhub_notes") || "",

    tasks:
      JSON.parse(
        localStorage.getItem("utilhub_tasks") || "[]"
      ),

    shopping:
      JSON.parse(
        localStorage.getItem("utilhub_shopping") || "[]"
      ),

    theme:
      localStorage.getItem("utilhub_theme") || "dark",

    animations:
      localStorage.getItem("utilhub_animations") !== "false",

    cursor:
      localStorage.getItem("utilhub_cursor") !== "false"

  };

  const blob =
    new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = "utilhub-backup.json";

  link.click();

  URL.revokeObjectURL(url);

});

/* =========================
   IMPORTAR DATOS
========================= */

const importFile = $("#importFile");

$("#importData")?.addEventListener(
  "click",
  () => importFile.click()
);

importFile?.addEventListener("change", event => {

  const file =
    event.target.files[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload = () => {

    try {

      const data =
        JSON.parse(reader.result);

      if (typeof data.notes === "string") {

        localStorage.setItem(
          "utilhub_notes",
          data.notes
        );

      }

      if (Array.isArray(data.tasks)) {

        localStorage.setItem(
          "utilhub_tasks",
          JSON.stringify(data.tasks)
        );

      }

      if (Array.isArray(data.shopping)) {

        localStorage.setItem(
          "utilhub_shopping",
          JSON.stringify(data.shopping)
        );

      }

      if (data.theme) {

        localStorage.setItem(
          "utilhub_theme",
          data.theme
        );

      }

      if (typeof data.animations === "boolean") {

        localStorage.setItem(
          "utilhub_animations",
          String(data.animations)
        );

      }

      if (typeof data.cursor === "boolean") {

        localStorage.setItem(
          "utilhub_cursor",
          String(data.cursor)
        );

      }

      alert(
        "Datos importados. Recarga la página."
      );

    } catch {

      alert(
        "El archivo no es válido."
      );

    }

  };

  reader.readAsText(file);

});

/* =========================
   BORRAR DATOS
========================= */

$("#deleteData")?.addEventListener(
  "click",
  () => {

    const confirmDelete =
      confirm(
        "¿Quieres borrar los datos guardados de ÚtilHub?"
      );

    if (!confirmDelete) return;

    localStorage.removeItem("utilhub_notes");
    localStorage.removeItem("utilhub_tasks");
    localStorage.removeItem("utilhub_shopping");

    alert(
      "Datos eliminados."
    );

  }
);
