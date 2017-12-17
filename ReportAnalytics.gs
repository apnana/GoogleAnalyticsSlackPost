/******************************************************/
/* 前準備                                              */
/******************************************************/
 
/* Google Analyticsのアカウント/プロパティ/プロファイルID表示 */
function listAccounts() {
  var accounts = Analytics.Management.Accounts.list();
  if (accounts.items && accounts.items.length) {
    for (var i = 0; i < accounts.items.length; i++) {
      var account = accounts.items[i];
      Logger.log('Account: name＝"%s", id＝"%s".', account.name, account.id);

      /* プロパティ/プロファイルID表示 */
      listWebProperties(account.id);
    }
  } else {
    Logger.log('No accounts found.');
  }
}

/* プロパティ/プロファイルID表示 */
function listWebProperties(accountId) {
  var webProperties = Analytics.Management.Webproperties.list(accountId);
  if (webProperties.items && webProperties.items.length) {
    for (var i = 0; i < webProperties.items.length; i++) {
      var webProperty = webProperties.items[i];
      Logger.log('\tWeb Property: name＝"%s", id＝"%s".', 
                 webProperty.name,
                 webProperty.id);

      /* プロファイルID表示 */
      listProfiles(accountId, webProperty.id);
      }
  } else {
    Logger.log('\tNo web properties found.');
  }
}

/* プロファイルID表示 */
function listProfiles(accountId, webPropertyId) {
  var profiles = Analytics.Management.Profiles.list(accountId,
      webPropertyId);
  if (profiles.items && profiles.items.length) {
    for (var i = 0; i < profiles.items.length; i++) {
      var profile = profiles.items[i];
      Logger.log('\t\tProfile: name "%s", id "%s".', profile.name,
          profile.id);
    }
  } else {
    Logger.log('\t\tNo web properties found.');
  }
}

/******************************************************/
/* slackへ通知   　                                     */
/******************************************************/
/**
 * メイン実行関数
 */
function reportAnalytics() {
  var profileId = "**********"; /* プロファイルID */

  /* レポート通知 */
  reportSummary(profileId);
}

/**
 * 現時点のレポートをslackへポスト
 * @param profileId プロファイルID
 */
function reportSummary(profileId) {

  /* Core Reporting APIで使用するデータ作成 */ 
  var today = new Date();
  var toDate = Utilities.formatDate(today, Session.getTimeZone(), 'yyyy-MM-dd');  
  var tableId = "ga:" + profileId;
  var metric = "ga:users,ga:sessions,ga:pageviews";
  var options = { "max-results" : 25 }

  /* 通知文字列作成 */
  var text = "";
  var report = Analytics.Data.Ga.get(tableId, toDate, toDate, metric, options);
  if (report.rows) {
    var rows = report.getRows();
    text = "【レポート】\n";
    text += "ユーザー数 : " + rows[0][0] + "\n";    /* index0 ユーザー数 */
    text += "セッション数 : " + rows[0][1] + "\n";    /* index1 セッション数 */
    text += "ページビュー数 : " + rows[0][2] + "\n";  /* index2 ページビュー数 */
    Logger.log(rows[0][0]);
    Logger.log(rows[0][1]);
    Logger.log(rows[0][2]);
  }

  /* slackへポスト */
  if (text != "") {
     var payload = {
       "text" : text,
       "channel" : "*****",   /* チャネル */
       "username" : "*****",  /* ユーザ名 */
       "icon_url" : "*****"   /* slackのURL */
     }
     postSlack(payload);
   }
}

/**
 * slackポスト関数
 * @param payload 通知詳細
 */
function postSlack(payload) {

  var options = {
    "method" : "POST",
    "payload" : JSON.stringify(payload)
  }

  var url = "*****"; /* slackのincoming-webhook URL */
  var response = UrlFetchApp.fetch(url, options);
  var content = response.getContentText("UTF-8");
}