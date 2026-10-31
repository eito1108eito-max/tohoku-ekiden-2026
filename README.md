# 東北女子高校駅伝 2026｜都大路へのもう一枠

東北6県の2026年女子県高校駅伝について、確認できた順位・高校名・総合記録と資料リンクを掲載するサイトです。県2〜4位校を参考タイム順に比較できますが、県ごとの条件が異なるため東北大会の予想順位ではありません。東北大会の地区代表枠は県2位校限定ではなく、実際の県代表校を除く最上位校1校が対象です。

調査更新日は2026年10月31日。青森10月29日・福島10月31日の公式結果を追加し、全6県を反映しました。青森の正式順位は2校のみで、OPの2チームを3位・4位として扱いません。秋田4位のタイム未確認を含め、公式資料と補助資料を区別します。このサイトは大会主催者の公式サイトではなく、自動更新もしません。

## GitHub Pagesで公開

リポジトリは所有者の承認に基づいてPublicに変更済みです。公開用ファイルはmainの `docs/` に生成しています。

公開URLは https://eito1108eito-max.github.io/tohoku-ekiden-2026/ です。サイトと比較表、Excel・テキスト・CSVを共有できます。

GitHubのリポジトリ設定で **Settings → Pages** を開きます。**Source** は **Deploy from a branch**、**Branch** は **main**、フォルダは **/docs** を選び、**Save** を押してください。生成済みの `docs/index.html` を公開するため、ユーザー作成のGitHub ActionsワークフローやNode.jsのサーバーは不要です。GitHub側の内部デプロイ処理で公開されます。

GitHub Freeで利用する場合はリポジトリがPublicである必要があります。非公開リポジトリを公開に変更すると、サイトだけでなくソースコード・レポート・データ・履歴も公開されます。変更は所有者の承認を得て行ってください。利用プランが非公開リポジトリでのPagesを許可する場合は、非公開のまま公開設定できます。

Pages設定の「Visit site」に公開URLが表示されたら公開先を確認できます。反映には時間がかかることがあります。

## データを更新する

県別データは `client/src/data/prefectures.json` とダウンロード用の `client/public/prefectures.json` にあります。解説レポートは `client/public/report.md`、東北大会・全国大会の条件は `client/src/data/rules.json` です。年度、女子の部、順位、総距離、合同・オープン区分を資料本文で確認してから更新してください。ページ上の確認日も変更します。

```sh
pnpm install --frozen-lockfile
python3 scripts/build-comparison.py
pnpm check
pnpm test
pnpm build:pages
git add client docs
git commit -m "Update verified prefectural results"
git push origin main
```

`python3 scripts/build-comparison.py` は比較データからExcel・テキスト・CSVと解説を生成します（Pythonのopenpyxlが必要）。

`pnpm build:pages` はGitHub Pagesの `/tohoku-ekiden-2026/` パスに対応した静的サイトを `docs/` に生成します。`docs/` は生成物なので直接編集しないでください。Pagesをmainの/docsに設定していれば、更新されたdocsのpushがGitHubの公開処理の対象になります。

## プレビューと通常ビルド

```sh
pnpm dev:static
pnpm build:static
```

プレビューは既定でポート3000。通常の静的ビルドは `dist/public/` を出力します。GitHub Pagesには `pnpm build:pages` の出力を使用してください。今回の公開サイトはログイン、バックエンドAPI、データベースを利用しません。

## 主な資料

[東北大会の公式要項](https://www.jaaf-yamagata.jp/touhoku_h_ekiden/data/01.pdf)、[全国大会の公式要項](https://cdn.mainichi.jp/vol1/koukouekiden/doc/summary/guide2026.pdf)、各県の資料はサイトと[解説レポート](client/public/report.md)に収録しています。

GitHub Pagesの設定方法と利用条件は[GitHub公式ドキュメント](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)を参照してください。

調査・制作：Manus AI
