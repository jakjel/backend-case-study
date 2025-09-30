# 🧰 NestJS Backend Case Study
Backend case study pro NFCtron | NestJS

Tento projekt je vypracováním zadání **Backend Developer | Incubation 2025**.  
Cílem je seznámit se se základními koncepty frameworku **NestJS** a vytvořit jednoduchý webový server, který simuluje evidenci zákazníků, včetně aplikační vrstvy a testů.

---

## 📑 Zadání

Vytvořit aplikaci v NestJS, která umožní:

- ✅ Výpis všech zákazníků se základními informacemi  
- ✅ Získání detailu zákazníka podle jeho **ID**  
- ✅ Vytvoření nového zákazníka  
- ✅ Editaci zákazníka podle jeho **ID**

---

## 🧱 Struktura aplikace

Projekt je postaven na standardní NestJS architektuře s menšími úpravami:

src/
├─ app.module.ts # Hlavní modul
├─ app.controller.ts # HTTP controller – přijímá požadavky, vrací DTO
├─ data/
│ ├─ data.module.ts # Modul pro správu dat
│ ├─ data.service.ts # Simulace databáze (in-memory)
│ └─ data.application.service.ts # Aplikační vrstva – mapování DTO ↔ domain
├─ model/
│ ├─ mapper/
│   └─ customer.mapper.ts # Mapper z DTO do Domain (customer.ts) a zpět
│ ├─ customer.ts
│ ├─ customer-create.dto.ts
│ ├─ customer-update.dto.ts
│ └─ customer-response.dto.ts

### ✨ Aplikační vrstva navíc
Oproti původnímu zadání byla přidána jednoduchá **application layer** (`data.application.service.ts`), která zajišťuje mapování mezi DTO a doménovým modelem.  
Díky tomu je controller čistší a testy přehlednější.

---

## 🌐 HTTP Endpointy

| Metoda | URL    | Popis                                 | Tělo požadavku        | Odpověď                   |
|--------|--------|----------------------------------------|-----------------------|---------------------------|
| GET    | `/`    | Výpis všech zákazníků                 | –                     | `CustomerResponseDTO[]`   |
| GET    | `/:id` | Detail zákazníka podle ID             | –                     | `CustomerResponseDTO`     |
| POST   | `/`    | Vytvoření nového zákazníka           | `CreateCustomerDTO`   | `CustomerResponseDTO`     |
| PUT    | `/:id` | Editace zákazníka podle ID           | `UpdateCustomerDTO`   | `CustomerResponseDTO`     |

---

## 🧪 Testování

Součástí projektu je sada **unit testů** a **end-to-end testů** pomocí Jest:

- ✅ **Unit testy** pokrývají `DataService` (mockování Faker API, validace chování, edge casy)  
- ✅ **E2E testy** pokrývají všechny 4 HTTP endpointy přes `supertest` včetně chybových stavů a validace

### Spuštění testů

```bash
npm run test
```

```bash
npm run test:e2e
```

### Spuštění aplikace

```bash
npm run start
```

### Swagger
Najdete na: localhost:3000/api


### Osobní feedback
Nest mi přijde jako moc fajn framework. Používal jsem ho poprvé a musím říct, že má parádní dokumentaci. Měl jsem možnost pracovat s Nuxt.js a v podstatě to bylo skoro stejné. Během procesu jsem měl problém s faker/faker-js a jest poslední verzí, takže používám v7.

Našel jsem tohle issue:
https://github.com/faker-js/faker/issues/3606

V brach "database" si chci přidat databázi a vše dát do docker-compose. 
Všechno jsem napsal sám, s testy jsem si nechal pomoct ChatemGPT. Testy jsou oblast, ve které bych se chtěl zlepšit.
Na všem jsem strávil dohromady 8 hodin.

Těším se na Váš feedback.


