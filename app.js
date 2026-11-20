const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    const items = services
        .filter((service) => {
            return (
                (service.id === "guide" && guideChecked) ||
                (service.id === "audio" && audioChecked) ||
                (service.id === "catalog" && catalogChecked)
            );
        })
        .map((service) => {
            const { title, price } = service;
            return { title: title.trim(), price };
        });

    const count = items.length;
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return { count, total, items };
}

function init() {
    let data;
    try {
        data = JSON.parse(sourceJson);
    } catch {
        const dataError = document.querySelector("#data-error");
        dataError.textContent = "Ошибка данных.";
        dataError.hidden = false;
        return;
    }

    document.querySelector("#event-title").textContent = data.event.title;
    document.querySelector("#event-date").textContent = data.event.date;
    document.querySelector("#event-place").textContent = data.event.place;
    document.querySelector("#event-description").textContent = data.event.description;

    const form = document.querySelector("#service-form");
    const choiceError = document.querySelector("#choice-error");
    const result = document.querySelector("#result");
    const reportJson = document.querySelector("#report-json");

    function showProgram() {
        const program = document.querySelector("#program");
        program.innerHTML = data.event.meeting;
        program.hidden = false;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const guideChecked = document.querySelector("#guide").checked;
        const audioChecked = document.querySelector("#audio").checked;
        const catalogChecked = document.querySelector("#catalog").checked;
        const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

        const hasSelection = report.count > 0;
        choiceError.hidden = hasSelection;
        result.hidden = !hasSelection;
        reportJson.hidden = !hasSelection;
        if (!hasSelection) {
            return;
        }

        result.innerHTML = [
            `Выбрано услуг: ${report.count}`,
            `Итого: ${report.total} руб.`,
            ...report.items.map((item) => item.title),
        ].join("<br>");

        const json = JSON.stringify(report);
        JSON.parse(json);
        reportJson.textContent = json;
    }

    document.querySelector("#show-program").addEventListener("click", showProgram);
    form.addEventListener("submit", handleSubmit);
    form.hidden = false;
}

init();
