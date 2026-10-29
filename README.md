# Freedom

Freedomの考え方と制作物を紹介する、会社設立前の制作ブランドのWebサイトです。ブランドを入口に、実際の制作物へ進む構成にしています。料金・納期・受注FAQ・個人プロフィールは掲載していません。

## ページ

- `index.html`：オリジナルの動的ビジュアル、考え方、現在の領域、選んだ制作物。
- `about.html`：ブランドの考え方、Web／アプリ制作、将来の会社設立・アパレル・ECの構想。現在の活動と構想を区別。
- `works.html`：Webサイト3件とアプリ3件の自主制作。実画面・設計意図・公開リンク・画像拡大。
- `contact.html`：ココナラの実在する窓口。フォーム基盤や送信処理はありません。
- `404.html`：存在しないURLの案内。階層の深いURLでもTOPと制作物に戻れます。

Web制作例は架空事業者を想定した自主制作です。掲載作品は、炉端と酒 灯、hair salon grace、緑整、Wire Pay、ExPress、個人店舗向けレジアプリ（公開名：黒レジ）の6件です。顧客からの受注実績・導入実績として紹介していません。Any PayとpayCcountの紹介・リンク・専用画像は取り除きました。各アプリ本体や別リポジトリは変更していません。

## 実行

Node.js 24.x。実行・ビルドとも追加パッケージは不要です。

```sh
npm run build
npm test
npm run preview
```

プレビューの既定URLは `http://127.0.0.1:5173/`。`PORT` 環境変数で変更できます。本作業のブラウザー確認用サーバーは5173を使用しています。

```powershell
$env:PORT = '5173'
npm run preview
```

`npm run preview` は **distを配信**します。ソース編集後は `npm run build` を再実行してください。拡張子なしのURLにも対応し、存在しないURLは404のHTTPステータスで専用ページを返します。`?test=nojs` を付けるとプレビューサーバーだけがCSPでJavaScriptを止め、フォールバックを確認できます。このテスト機能・サーバーコードは公開ファイルに含めません。

## 構成

- `assets/css/freedom.css`：配色・書体・全ページのレイアウト・レスポンシブ表示・動きを減らす設定。
- `assets/js/freedom.js`：メニュー、画像拡大ダイアログ、原寸表示、フォーカス復元。
- `assets/js/form.mjs`：切れ目のある円環と斜めに流れる曲線を13層重ね、内側の2層に幾何学的なスリットを入れたオリジナルの幾何モデル。
- `assets/js/motion.mjs`：TOPのCanvas描画・自動で繰り返す開閉・表示状態の管理。
- `assets/img/freedom/open-form.svg`：静止時・JavaScript無効時の実画像。
- `assets/img/freedom/concept-materials.webp`：TOPの考え方に添えたオリジナルのコンセプト画像（1200×800、約46KB）。実在のオフィスや顧客の写真ではありません。発想・設計・実装のシンボルとWeb／アプリの図はHTML内のSVGで描画しています。
- `assets/img/freedom/`：作品のWebPスクリーンショット、OGP画像。
- `assets/img/technology/`：ロゴ帯で使う11点のDevicon SVGとMITライセンス。ローカル配信のため外部CDNには依存しません。
- `scripts/make-brand-art.mjs`：静止SVGの再生成（`node scripts/make-brand-art.mjs`）。
- `public-files.json`：公開ページ・アセットディレクトリ・設定の明示リスト。
- `scripts/build.mjs`：公開ファイルの検証とdist生成。
- `scripts/build.test.mjs`：公開参照、CSS、srcset、OGP、ES module、パス境界の回帰テスト。
- `scripts/motion.test.mjs`：自動開閉、reduced motion、画面外・非表示タブ、Canvas非対応のテスト。
- `scripts/form.test.mjs`：円環を回転・展開しても描画範囲を超えず、座標が有限値になることを確認。
- `scripts/preview.mjs`：Node標準ライブラリのみのローカル確認サーバー。
- `_headers`：Cloudflare Pagesのヘッダー設定。
- `CREDITS.md`：素材出典と利用範囲。
- `DESIGN.md`：今回の設計意図とスキル適用記録。

`npm run build` は公開参照を検証してからdistを置き換えます。HTMLのsrc/href/poster/srcset、OGP、アンカー、CSSのurl/import、JSの相対静的importを検証。画像やモジュールは宣言したアセットディレクトリごとコピーするため、JSから使う素材も漏れません。新しいページは `public-files.json` のpagesへ追加します。動的に組み立てたURLはブラウザーで別途確認してください。

## モーションとアクセシビリティ

TOPは、切れ目のある円環と斜めに流れる曲線を13層重ねたオリジナルの動的ビジュアルです。前後の面は無地とし、内側の2層だけに等間隔のスリットを設けています。表面に柄を貼るのではなく、重なりの中の構造として幾何学模様が見える構成です。文字記号や他社ロゴを直接使っていません。ヘッダー等の星形ロゴは維持しています。外部動画、WebGL、アニメーションライブラリは使っていません。最大30fps・最大1.5倍の描画解像度に制限し、画面外・非表示タブでは描画ループを停止します。

- 操作ボタンは設けず、約12秒の周期で自動的にひらく・重なる動きと、ゆっくりした立体の回転を繰り返します。
- TOPは説明・図形、ブランド名、次の案内をGridの別行に配置。画面の高さで固定せず、本文の折り返しに合わせて伸びます。800px以下は説明と図形も縦に並びます。TOPとフッターの大きな文字には行高を確保し、周囲の文章と重ならないようにしています。
- TOPのブランド名は従来より約14%縮小（小画面では約11%）。その下にロゴだけの帯を独立した行として配置。見出し・ロゴ名は画面に表示せず、名称は画像の代替テキストで提供します。HTML5・CSS3・JavaScript・TypeScript・React・Next.js・Node.js・Tailwind CSS・Git・GitHub・Cloudflareを、60秒周期のCSSアニメーションで右から左へ流します。等幅の2組を並べて連続させ、複製側は支援技術から隠しています。ホバー・キーボードフォーカスで一時停止し、動きを減らす設定では1組だけを折り返した静止一覧にします。
- OSの `prefers-reduced-motion: reduce` では静止表示します。
- Canvasが使えない場合やJavaScript無効時は静止SVGを表示。本文、ページ移動、外部リンクはHTMLで動作。
- 標準スクロールを維持。スクロール連動とページ遷移はCSS対応ブラウザーだけの段階的な機能拡張です。
- キーボード用の本文スキップ、フォーカス表示、モバイルメニューのEsc操作。
- 画像拡大はネイティブdialog。「閉じる」、Esc、背景クリックで閉じ、元の画像リンクへフォーカスを戻します。JS無効時はリンクから元画像を開けます。
- スクリーンショットは実寸比率で表示。画像にwidth/height/alt、画面下の画像に遅延読み込みを設定。
- フォントはシステムフォント。外部フォントの取得に依存しません。

## 公開サイトと確認上の制約

- 本番：https://freedom-inc.pages.dev/
- 相談窓口：https://coconala.com/services/4471895
- Wire Pay：公開デモアカウントで管理画面を閲覧。取引操作はしていません。
- ExPress：入口は表示できましたが、2026年10月27日の確認ではウォレット開始後にデモサーバーが応答しませんでした。ウォレット内部の動作確認はできていません。
- 黒レジ：公開URLはスタッフログイン画面。認証後の動作は未確認で、既存の制作画面を紹介しています。新規アカウント作成や注文・会計はしていません。

## Cloudflare Pages

- Build command：`npm run build`
- Output directory：`dist`
- Node.js：24.x

GitHubのmainへの反映を契機に、Cloudflare Pagesが自動ビルド・公開します。変更はローカルのビルドとプレビューで確認し、公開の承認を得てからmainへ反映します。公開後は本番のページ・画像・モジュール・404を確認してください。`vercel.json` は既存の互換設定として残しています。
