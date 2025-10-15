class CardController {
  main() {
    const subjects = SheetController.getAllSubjects();
    for (const i in subjects) {
      const subjectInfo = subjects[i];
      CardController.receive(
        subjectInfo.subject,
        subjectInfo.subject,
        (data) => {
          const func = CardController.CARD_RECEIVES[subjectInfo.type];
          if (!func) {
            Logger.log(`未対応のカード会社です: ${subjectInfo.type}`);
            return;
          }
          func(data.id, data.date, data.subject, data.plainBody, (result) => {
            const isOutdated = CardController.checkIfDateIsBeforeLastUse(
              subjectInfo.last_date,
              result.dateOfUse
            );

            if (isOutdated) {
              return;
            }

            SheetController.updateLastDate(i, result.dateOfUse);

            SheetController.insertDataToSheet(result);

            let cardRowData = SheetController.getCardRowData(result.card);
            if (!cardRowData) {
              Logger.log(`未対応のカードです: ${result.card}`);
              return;
            }
            let username = result.card;
            if (result.card === "リクルートカード") {
              username = `${result.card}（${subjectInfo.brand}）`;
            }
            if (result.card === "【ＯＳ】ＪＣＢ　ＣＡＲＤ　Ｗ") {
              username = `${result.card.replace("【ＯＳ】", "")}`;
            }
            let cardTotal = cardRowData.total;
            let cardEmoji = cardRowData.emoji;
            let total = SheetController.getTotalPrice();
            SlackController.chatPostRiyoMessage(
              username,
              cardEmoji,
              result.card,
              result.dateOfUse,
              result.store,
              result.transaction,
              result.price,
              cardTotal,
              total,
              GmailController.createUrl(data.id)
            );

            CalendarController.insertCalendar(
              `${result.card} -${result.price}`,
              `利用先:${result.store}${
                result.transaction ? "\n利用取引:" + result.transaction : ""
              }`,
              undefined,
              result.dateOfUse,
              result.dateOfUse
            );
          });
        }
      );
    }
  }

  static checkIfDateIsBeforeLastUse(lastDate, useDate) {
    if (!lastDate) return false;
    const lastDateOfUsage = new Date(lastDate);
    const dateOfUse = new Date(useDate);
    if (dateOfUse <= lastDateOfUsage) return true;
    return false;
  }

  static receive(query, subject, callback) {
    const threads = GmailApp.search(query, 0, 100).reverse();
    for (const i in threads) {
      let messages = threads[i].getMessages();
      for (const j in messages) {
        let message = messages[j];
        if (message.getSubject() !== subject.replace(/\\\"/g, "")) {
          continue;
        }
        callback({
          id: message.getId(),
          date: message.getDate(),
          subject: message.getSubject(),
          plainBody: message.getPlainBody(),
        });
      }
    }
  }

  static get CARD_RECEIVES() {
    return {
      JCB__1: (id, date, subject, plainBody, callback) => {
        // カード名称　：　リクルートカード
        let card = plainBody.match(/カード名称　：　(.*)\r\n/m)?.at(1);
        // 【ご利用日時(日本時間)】　2023/12/21 00:21
        let dateOfUse = plainBody
          .match(/【ご利用日時\(日本時間\)】　(.*)\r\n/m)
          ?.at(1);
        // 【ご利用金額】　1,736円
        let price = plainBody.match(/【ご利用金額】　(.*)\r\n/m)?.at(1);
        // 【ご利用先】　ニクノハナマサ　ニシシンバシテン
        let store = plainBody.match(/【ご利用先】　(.*)\r\n/m)?.at(1);
        let transaction = null;
        callback({ card, dateOfUse, store, transaction, price });
      },
      JCB__2: (id, date, subject, plainBody, callback) => {
        // カード名称　：　リクルートカード
        let card = plainBody.match(/カード名称　：　(.*)\r\n/m)?.at(1);
        // 【ご利用日】　2025/04/09
        let dateOfUse = plainBody.match(/【ご利用日】　(.*)\r\n/m)?.at(1);
        // 【ご利用金額】　1,736円
        let price = plainBody.match(/【ご利用金額】　(.*)\r\n/m)?.at(1);
        // 【ご利用先】　ニクノハナマサ　ニシシンバシテン
        let store = plainBody.match(/【ご利用先】　(.*)\r\n/m)?.at(1);
        let transaction = null;
        callback({ card, dateOfUse, store, transaction, price });
      },
      JCB__3: (id, date, subject, plainBody, callback) => {
        // カード名称　：　リクルートカード
        let card = plainBody.match(/カード名称　：　(.*)\r\n/m)?.at(1);
        // 【ご利用日時(日本時間)】　2023/12/21 00:21
        let dateOfUse = plainBody
          .match(/【ご利用日時\(日本時間\)】　(.*)\r\n/m)
          ?.at(1);
        // 【ご利用金額】　1,736円
        let price = plainBody.match(/【ご利用金額】　(.*)\r\n/m)?.at(1);
        // 【ご利用先】　ニクノハナマサ　ニシシンバシテン
        let store = plainBody.match(/【ご利用先】　(.*)\r\n/m)?.at(1);
        let transaction = null;
        callback({ card, dateOfUse, store, transaction, price });
      },
      SMBC_1: (id, date, subject, plainBody, callback) => {
        // ご利用カード：三井住友カードＶＩＳＡ
        let card = plainBody.match(/ご利用カード：(.*)\r\n/m)?.at(1);
        // ◇利用日：2023/07/22 20:41
        let dateOfUse = plainBody.match(/◇利用日：(.*)\r\n/m)?.at(1);
        // ◇利用先：Visa加盟店
        let store = plainBody.match(/◇利用先：(.*)\r\n/m)?.at(1);
        // ◇利用取引：買物
        let transaction = plainBody.match(/◇利用取引：(.*)\r\n/m)?.at(1);
        // ◇利用金額：1,093円
        let price = plainBody.match(/◇利用金額：(.*)\r\n/m)?.at(1);
        callback({ card, dateOfUse, store, transaction, price });
      },
      VIEW_1: (id, date, subject, plainBody, callback) => {
        // カード名称
        let card = plainBody.match(/ご利用カード(.*)/m)?.at(1).trim().replace(/：/, '');
        // 利用日
        let dateOfUse = plainBody.match(/・ 利用日　 　：(.*)\r\n/m)?.at(1);
        // 利用金額
        let price = plainBody.match(/・ 利用金額 　：(.*)\r\n/m)?.at(1);
        // 利用加盟店
        let store = plainBody.match(/・ 利用加盟店 ：(.*)\r\n/m)?.at(1);
        let transaction = null;
        callback({ card, dateOfUse, store, transaction, price });
      },
    };
  }
}
