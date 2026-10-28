# 素材と出典

## 今回制作した素材

- `assets/js/form.mjs` / `motion.mjs`：本作業で作成した、切れ目のある円環と斜めの曲線を組み合わせた独自の幾何モデルと動作。元の星の重なり・展開演出を継承。外部映像・外部モデル・第三者ライブラリは未使用。
- `assets/img/freedom/open-form.svg`：上記モデルの静止画。`scripts/make-brand-art.mjs` で再生成できます。
- `assets/img/freedom/og-freedom.jpg`：星形のブランドモチーフとブランド文字を使った本作業のオリジナルOGP画像。
- 追加の第三者素材に伴うライセンスはありません。既存ブランド資産の権利やリポジトリのライセンスを変更するものではありません。

## 2026-10-28 追加ビジュアル

- 幾何学的なスリット：内側の2層に独自に設計した等間隔の切れ目を配置。現行ビジュアルは独自の幾何学形状だけで構成し、前面は無地。他社ロゴ・既存の文字記号・第三者の柄を転用していません。

- `assets/img/freedom/concept-materials.webp`：組み込みimagegenツールで生成した、紙と青い立体のコンセプト画像。生成後に1200×800のWebPへ最適化。実在する職場・社員・顧客・制作実績の写真として扱わない。
- TOPの三つのシンボルとWeb／アプリの図：本作業で作成したインラインSVGと既存のFreedomロゴ。追加の第三者アイコンライブラリは未使用。

生成プロンプト：

> Use case: stylized-concept. Asset type: landscape editorial photographic artwork for the philosophy section of Freedom, a Japanese web and application design brand. Create one exceptionally refined, photorealistic studio still life, landscape 3:2 composition. Subject: a broad ribbon of textured off-white heavyweight paper folds and rises into a graceful architectural arch, alongside two simple deep navy blue solid forms and a very small brushed bronze flat square. The paper's flat beginning becomes a dimensional form: an idea becoming something tangible. Place the arrangement on a cool pale gray-white seamless surface, with generous breathing room around it. Natural side daylight, soft long real shadows, tactile paper grain, physically plausible folded edges, quietly sophisticated editorial product photography. Palette matches #102c42 navy, #edf1f2 cool off-white, muted bronze. Camera oblique at tabletop level, medium-wide composition with the whole arrangement comfortably inside the frame. No text, no lettering, no numbers, no logos, no people or hands, no computer equipment, no office setting, no extra ornaments, no gradients as graphic backgrounds. This is a conceptual material study, not a real company office or client project.


## 既存のブランド資産

- `assets/img/logo.svg` / `favicon.svg`：元リポジトリのFreedomロゴを継続使用。反転した星・反転したeを維持。
- 書体：端末のArial、Yu Gothic、Meiryo等をCSSのフォールバックで利用。フォントファイルは配布していません。

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
