
  let today = new Date();
  let currentDay= today.getDay();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

let date = today.toLocaleDateString("en-US", options);
