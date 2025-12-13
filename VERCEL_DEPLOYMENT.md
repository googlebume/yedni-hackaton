# Yedno - Vercel Deployment Guide

## Що було підготовлено для Vercel:

✅ **Vercel API Functions** (`/api/[[...route]].ts`) - обробляє всі API запити
✅ **Vite Frontend** - розгортається як статичні файли
✅ **vercel.json** - конфіг для Vercel
✅ **CORS & Error Handling** - налаштовано

## Кроки для розгортання на Vercel:

### 1. Підготуйте Git репозиторій
```bash
git add .
git commit -m "Configure project for Vercel deployment"
git push origin main
```

### 2. На сайті Vercel (vercel.com)
1. Натисніть **New Project**
2. Виберіть ваш GitHub репозиторій `yedno-hackaton`
3. Натисніть **Import**

### 3. Налаштування проекту на Vercel:
- **Framework Preset**: Інших (Other) або залиште пусто
- **Build Command**: `npm run build`
- **Output Directory**: залиште пусто (автоматично)
- **Install Command**: `npm install`
- **Root Directory**: `.` (корінь проекту)

### 4. Environment Variables (опціонально)
Якщо потрібні змінні окруження:
- Перейдіть в **Settings → Environment Variables**
- Додайте потрібні змінні (наприклад, `DATABASE_URL`, тощо)

### 5. Деплой
Натисніть **Deploy** - Vercel автоматично:
- Встановить залежності
- Побудує Vite фронтенд в `dist/public`
- Розгорне API функції з папки `api/`

## Структура проекту для Vercel:

```
├── client/                    # React Vite фронтенд
│   ├── src/
│   ├── index.html
│   └── vite.config.ts
├── api/
│   └── [[...route]].ts        # Vercel API handler
├── server/
│   ├── routes.ts              # Ваші API маршрути
│   ├── static.ts
│   └── storage.ts
├── shared/
│   └── schema.ts
├── vercel.json                # Конфіг Vercel
├── vite.config.ts
├── package.json
└── tsconfig.json
```

## Як додати нові API маршрути?

Модифікуйте `server/routes.ts`:

```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // GET запит
  app.get("/api/projects", (req, res) => {
    res.json({ message: "Projects list" });
  });

  // POST запит
  app.post("/api/projects", (req, res) => {
    const newProject = req.body;
    res.json({ success: true, data: newProject });
  });

  return httpServer;
}
```

## Тестування локально перед деплоєм:

```bash
# Встановіть залежності
npm install

# Побудуйте фронтенд
npm run build

# Тестуйте локально
npm run dev:client
```

## Важливо!

- **API базується на Express** - wszystkie маршрути в `server/routes.ts`
- **Фронтенд базується на React + Vite** - файли в `client/src/`
- **Версія Node.js**: Vercel використовує Node.js 18+ за замовчуванням
- **Статичні файли**: Вивантажуються з `dist/public` і сервуються автоматично

## Troubleshooting:

Якщо виникнуть проблеми:
1. Перевірте logs в Vercel Dashboard → Deployments
2. Переконайтесь, що `npm run build` працює локально
3. Перевірте, що всі залежності в `package.json`
4. Очистіть Vercel cache: Project Settings → Git → Cleared Builds

---

**Happy deploying! 🚀**
