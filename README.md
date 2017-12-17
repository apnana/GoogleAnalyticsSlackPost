【使用方法】
1. Incoming WebHooksのWebHook URLを取得
2. Google Analytics APIを有効化
3. Chrome拡張のGoogle Apps Script Github アシスタントを追加
4. listAccounts関数を実行してレポートが欲しいプロパティのプロファイルIDを取得
5. 4で取得したプロファイルIDをreportAnalytics関数の"profileId"に設定
6. ポストしたいslackのURL等をreportSummary関数の"channel"/"username"/"icon_url"に設定
7. 1で取得したURLをpostSlack関数の"url"に設定
8. reportSummary関数を実行
