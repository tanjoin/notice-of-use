class SlackController {
  static get AUTH_TOKEN() {
    return PropertiesService.getScriptProperties().getProperty("SLACK_BOT_TOKEN");
  }
  static get SLACK_URL_ROOMS_MESSAGE() {
    return "https://slack.com/api/chat.postMessage";
  }

  static chatPostRiyoMessage(username, icon_emoji, card_name, dateOfUse, store, transaction, price, sum, total, url, last_month_sum, last_month_total) {
    var payload = {
      token: AUTH_TOKEN,
      channel: "#money",
      parse: "none",
      username: username,
      icon_emoji: icon_emoji,
      text: `【${card_name}】 ${store} ${transaction ?? ""}`,
      attachments: JSON.stringify([
        {
          color: "success",
          title: "ご利用のお知らせ",
          title_link: url,
          fields: [
            {
              title: "利用日",
              value: dateOfUse,
              short: false,
            },
            {
              title: "利用金額",
              value: price,
              short: false,
            },
            {
              title: "カード合計",
              value: sum,
              short: false,
            },
            {
              title: "今月総利用金額",
              value: total,
              short: false,
            },
            {
              title: "前回のカード合計",
              value: last_month_sum,
              short: true,
            },
            {
              title: "先月総利用金額",
              value: last_month_total,
              short: true,
            },
          ],
        },
      ]),
    };
    var params = {
      method: "post",
      payload: payload,
    };
    var response = UrlFetchApp.fetch(SLACK_URL_ROOMS_MESSAGE, params);
    return response;
  }
}
