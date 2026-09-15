# Freedom — つくることから、自由をひろげる。

会社設立に向けた構想と、決済・店舗運営分野の自主制作アプリを紹介するサイトです。

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
VercelではFrameworkをOther、Build Commandを `npm run build`、Output Directoryを `dist` に設定します。
外部依存パッケージはありません。フォントはGoogle Fontsを使用します。

旧デザインのHTMLは履歴参照用として保持していますが、公開対象に含みません。
`preview/` はローカルでの方向性確認用で、Git・Vercelの公開対象外です。
GitHub Pagesは手動実行時のみ同じ `dist/` を配信します。

決済画面の掲載データはデモです。会社設立・商用提供・顧客導入の実績は表明していません。
