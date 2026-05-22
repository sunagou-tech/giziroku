# Meeting Hub

社内向けの会議管理マイページの Next.js プロトタイプです。

## ローカル起動

```bash
npm install
npm run dev
```

## Vercel デプロイ

1. このフォルダを GitHub リポジトリに push
2. Vercel で `New Project` から対象リポジトリを import
3. Framework Preset は `Next.js`
4. Build Command は `npm run build`
5. Output Directory は未指定のまま

現時点では仮データとブラウザ内保存を使っています。DB、認証、Google Calendar API 連携は次の実装ステップです。
