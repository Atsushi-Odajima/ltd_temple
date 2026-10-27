# Freedom — つくることから、自由をひろげる。

会社設立に向けた構想と、決済・店舗運営分野の自主制作アプリを紹介するサイトです。

## このリポジトリで紹介できること

- アプリ一覧から詳細・画面拡大・関連デモへつなぐ、1ページのポートフォリオ導線。
- [assets/css/freedom.css](assets/css/freedom.css) にまとめた色・余白・文字の設計。
- [assets/js/freedom.js](assets/js/freedom.js) の画面拡大ダイアログ。
- [scripts/build.mjs](scripts/build.mjs) による公開ファイル生成とローカル参照の検査。

会社設立の構想と自主制作の紹介サイトです。掲載アプリのコードや決済処理自体は、それぞれの別リポジトリにあります。

## ローカルで確認する

Node.js **24.x**で、次を実行します。`dev` / `test` スクリプトはありません。

```sh
npm run build
python -m http.server 8000 --bind 127.0.0.1 --directory dist
```

後半のプレビューにはPython 3系が必要です。http://localhost:8000 を開き、掲載リンクと拡大ダイアログを確認できます。

## 公開内容

- ビル街、カード、QRコード付きレシートのメインビジュアル
- About Freedom（会社設立構想）
- Wire Pay / Any Pay / payCcount / ExPress / 個人店舗向けレジアプリ
- 各アプリの画面紹介、拡大表示、デモ・リポジトリへのリンク
- IT、Communication、Apparel、E-commerceの4領域

## 構成

- `index.html`: 承認済みの1ページ構成
- `assets/css/freedom.css`: スタイル
- `assets/js/freedom.js`: 画面拡大ダイアログ
- `assets/img/freedom/`: 掲載画像
- `scripts/build.mjs`: 公開ファイルの生成と参照確認
- `vercel.json`: Vercelのビルド・配信設定

Node.js 24で `npm run build` を実行すると、公開対象のみを `dist/` に生成します。
外部依存パッケージはありません。フォントはGoogle Fontsを使用します。

## 公開(デプロイ)

本番サイトは **Cloudflare Pages** で公開しています: https://freedom-inc.pages.dev
GitHubの `main` ブランチに反映されると自動でビルド・デプロイされます(Build Command: `npm run build` / Output Directory: `dist`)。

旧デザインのHTMLは履歴参照用として保持していますが、公開対象に含みません。
`preview/` はローカルでの方向性確認用で、Git・デプロイの公開対象外です。

決済画面の掲載データはデモです。会社設立・商用提供・顧客導入の実績は表明していません。
