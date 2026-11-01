class SlackController {
  static get AUTH_TOKEN() {
    return PropertiesService.getScriptProperties().getProperty("SLACK_BOT_TOKEN");
  }
  static get SLACK_URL_ROOMS_MESSAGE() {
    return "https://slack.com/api/chat.postMessage";
  }

  static chatPostRiyoMessage(username, icon_emoji, card_name, dateOfUse, store, transaction, price, sum, total, url, last_month_sum, last_month_total, last_month_one_year_total) {
    var payload = {
      token: SlackController.AUTH_TOKEN,
      channel: "#money",
      parse: "none",
      username: username,
      icon_emoji: icon_emoji,
      text: `【${card_name}】 ${store} ${transaction ?? ""}`,
      fallback: `【${card_name}】 ${dateOfUse} ${store} ${price} ${transaction ?? ""}`,
      color: (transaction === "取消") ? 'danger' : 'good',
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
              short: true,
            },
            {
              title: "前回のカード合計",
              value: last_month_sum,
              short: true,
            },
            {
              title: "今月総利用金額",
              value: total,
              short: true,
            },
            {
              title: "先月総利用金額",
              value: last_month_total,
              short: true,
            },
            {
              title: '先月までの年間カード利用額',
              value: last_month_one_year_total,
              short: true
            }
          ],
        },
      ]),
    };
    var params = {
      method: "post",
      payload: payload,
    };
    var response = UrlFetchApp.fetch(SlackController.SLACK_URL_ROOMS_MESSAGE, params);
    return response;
  }
}
