# 素材と出典

## 今回制作した素材

- `assets/js/form.mjs` / `motion.mjs`：本作業で作成した、三つの三角形の枠と欠け方の違う三つの輪による独自の幾何モデルと動作。三角形の重ね方は依頼者支給の線画に基づく。外部映像・外部モデル・第三者ライブラリは未使用。
- `assets/img/freedom/open-form.svg`：上記モデルの静止画。`scripts/make-brand-art.mjs` で再生成できます。
- `assets/img/freedom/lettering-global-freedom.webp`：依頼者支給の手書き風レタリング画像「We want for global Freedom」。右端の未収録文字の表示を切り落とし、色をブランドの青へ変更、細い線が小さな表示で消えないよう不透明度を調整。元の書体の名称と利用条件は本作業では確認できていません。公開利用の可否は依頼者側で確認してください。
- `assets/img/freedom/og-freedom.jpg`：星形のブランドモチーフとブランド文字を使った本作業のオリジナルOGP画像。
- 追加の第三者素材に伴うライセンスはありません。既存ブランド資産の権利やリポジトリのライセンスを変更するものではありません。

## 2026-10-28 追加ビジュアル

- 輪の一か所に入れた鋸歯の柄（2026-11-19）：サモアのタタウやシアポに見られる三角形の反復に着想し、独自に作図した幾何学模様。特定の作品・家系の図柄や第三者の柄データは転用していません。以前の「内側2層のスリット」は現行ビジュアルでは使用していません。

- `assets/img/freedom/concept-materials.webp`：組み込みimagegenツールで生成した、紙と青い立体のコンセプト画像。生成後に1200×800のWebPへ最適化。実在する職場・社員・顧客・制作実績の写真として扱わない。
- TOPの三つのシンボルとWeb／アプリの図：本作業で作成したインラインSVGと既存のFreedomロゴ。

生成プロンプト：

> Use case: stylized-concept. Asset type: landscape editorial photographic artwork for the philosophy section of Freedom, a Japanese web and application design brand. Create one exceptionally refined, photorealistic studio still life, landscape 3:2 composition. Subject: a broad ribbon of textured off-white heavyweight paper folds and rises into a graceful architectural arch, alongside two simple deep navy blue solid forms and a very small brushed bronze flat square. The paper's flat beginning becomes a dimensional form: an idea becoming something tangible. Place the arrangement on a cool pale gray-white seamless surface, with generous breathing room around it. Natural side daylight, soft long real shadows, tactile paper grain, physically plausible folded edges, quietly sophisticated editorial product photography. Palette matches #102c42 navy, #edf1f2 cool off-white, muted bronze. Camera oblique at tabletop level, medium-wide composition with the whole arrangement comfortably inside the frame. No text, no lettering, no numbers, no logos, no people or hands, no computer equipment, no office setting, no extra ornaments, no gradients as graphic backgrounds. This is a conceptual material study, not a real company office or client project.


## 既存のブランド資産

- `assets/img/logo.svg` / `favicon.svg`：元リポジトリのFreedomロゴを継続使用。反転した星・反転したeを維持。
- 書体：端末のArial、Yu Gothic、Meiryo等をCSSのフォールバックで利用。フォントファイルは配布していません。

## 技術ロゴ帯

- 取得元：[Devicon](https://github.com/devicons/devicon) の `icons/{name}/{name}-original.svg`。2026-10-29取得。
- 対象：HTML5、CSS3、JavaScript、TypeScript、React、Next.js、Node.js、Tailwind CSS、Git、GitHub、Cloudflare。
- `assets/img/technology/` に元の配色・形状を保ったSVGを保存。外部CDNの画像を直接参照していません。
- DeviconのMITライセンス（Copyright (c) 2015 konpa）全文を `assets/img/technology/LICENSE.txt` に同梱し、公開ビルドにも含めています。各ロゴの商標はそれぞれの権利者に帰属します。提携・推薦・認定の表示ではありません。
- 掲載根拠：当サイトのHTML・CSS・JavaScript・Node.js・Git/GitHub・Cloudflare Pages、および [Wire Payのpackage.json](https://github.com/Atsushi-Odajima/Payment-management/blob/main/package.json)（確認時blob `3683a3f04c2401783dea72b7371c7fce4b1bf0e2`）のTypeScript・React・Next.js・Tailwind CSS。
- 演出の参考：[株式会社Tech Lab](https://techlab-inc.co.jp/) の技術ロゴ帯。サイト固有のコード・文章・写真は複製していません。

## 実サイトのスクリーンショット

以下は依頼者が指定した自主制作サイトを、2026年10月27日にブラウザーで撮影した画像です。前回の改修で取得・WebP最適化した画像を再利用しました。サイト全体の画面を作品として紹介するための利用です。写真だけを抜き出してFreedomのオフィス・社員・顧客の写真として使っていません。

|作品|撮影元|画像|
|---|---|---|
|炉端と酒 灯|https://tomoshibi-sample-omega.vercel.app/|tomoshibi-desktop / tomoshibi-mobile / tomoshibi-menu|
|hair salon grace|https://salon-site-nagi.vercel.app/|grace-desktop / grace-mobile / grace-catalog|
|緑整|https://ryokusei-demo.vercel.app/|ryokusei-desktop / ryokusei-mobile / ryokusei-price|

元サイト内の写真・アイコン等はそれぞれのサイトのクレジット・利用条件に従います。このリニューアルで、それらの原素材を新規取得したり、独立した素材として再配布したりしていません。撮影時に予約・問い合わせ・見積もりの実送信は行っていません。

## 既存のアプリ画面

元リポジトリに含まれていた制作画面をWebPへ変換して継続利用。新しい顧客情報や実取引の画像は追加していません。

- Wire Pay：`wire-pay.webp` / `wire-payment-detail-en.webp` / `wire-reports-en.webp`。https://payment-management-green.vercel.app
- ExPress：`express.webp`。https://exw-portal-k7d2.onrender.com/wallet
- 個人店舗向けレジアプリ：`store-register.webp`。https://kuro-reji.pages.dev

外部デモの動作範囲と確認時の制約はREADMEに記録しています。
