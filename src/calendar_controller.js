class CalendarController {

  static get CALENDAR_ID() {
    return PropertiesService.getScriptProperties().getProperty("CALENDAR_ID");
  }

  static insertCalendar(title, description, location, startTime, endTime) {
    let event = Calendar.Events.insert({
      summary: title,
      location: location,
      description: description,
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "Asia/Tokyo",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "Asia/Tokyo",
      },
    }, CalendarController.CALENDAR_ID);
    return event;
  }
};
