var fs = require("fs");
var readline = require("readline");
const inquirer = require("inquirer");

function parseFile(filename, callback) {
  var instream = fs.createReadStream(filename);

  var lines = [];

  instream.on("error", function (error) {
    if (error.code === "ENOENT") {
      error.message = "Error: file doesn't exist.";
    }
    return callback(null, error);
  });

  var rl = readline.createInterface({
    input: instream,
    terminal: false,
  });

  // regex for a valid message line
  var messageRegex = /:+.*- .*/g;

  rl.on("line", function (line) {
    // if line has no sender data (message continues after line break) append it to the last message with a \n
    if (!line.match(messageRegex)) {
      lines[lines.length - 1].message += "\n" + line;
    } else {
      lines.push(parseLine(line));
    }
  });

  rl.on("close", function () {
    callback(lines);
  });
}

// Split each line into an object containing time, sender and message
function parseLine(line) {
  // Remove empty lines
  if (!line || !line.length) {
    return;
  }

  // Substring details based on separators
  var date = line.substr(0, line.indexOf(" -"));
  var sender, message;

  // If there is no sender, label message sender as system
  if (line.indexOf(": ") === -1) {
    sender = "system";
    message = line.substr(line.indexOf("- ") + 2);
  }
  // Else substring sender and message
  else {
    sender = line.substr(
      line.indexOf("- ") + 2,
      line.indexOf(": ") - line.indexOf("- ") - 2
    );
    message = line.substr(line.indexOf(": ") + 2);
  }

  return {
    date: date,
    sender: sender,
    message: message,
  };
}

const discution = "./history.txt";

var fs = require("fs");

function number_of_messages_sent() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "Entrez un nom !",
        default: "BIENFOALI DAMSSAN GATIEN",
      },
    ])
    .then((rep) => {
      let name = rep.name.trim();
      startApp(name);
    });
}

function startApp(name) {
  parseFile(discution, function (messages, err) {
    if (err) {
      return console.log(err);
    }


    var emojiRegex = /([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g;
    var lolRegex = new RegExp("\\b" + "lol" + "\\b", "g");
    var lmaoRegex = new RegExp("\\b" + "lmao" + "\\b", "g");
    var angryRogex = "😡";

    var profanities = ["fuck", "merde", "putain", "ass"].map(
      (mot) => new RegExp("\\b" + mot + "\\b", "g")
    );
    var good = [
      "amen",
      "akpe",
      "merci",
      "nagode",
      "imela",
      "thanks",
      "thank you",
      "alhamdulillah",
      "shukran",
    ].map((mot) => new RegExp("\\b" + mot + "\\b", "g"));


    //array 
    let nomMessages = [];
    let total_lol = [];
    let total_lmao = [];
    let total_profanities = [];
    let emoji = [];
    let emojiRecue = [];
    let total_good = [];
    let total_angry = [];

    for (let i = 0; i < messages.length; i++) {
      const element = messages[i];

      if (messages[i].sender == name) {
        nomMessages.push(element);

        if (element.message.toLowerCase().match(lolRegex)) {
          total_lol.push(element);
        }

        if (element.message.toLowerCase().match(lmaoRegex)) {
          total_lmao.push(element);
        }

        profanities.map((mot) => {
          if (element.message.toLowerCase().match(mot)) {
            total_profanities.push(element);
          }
        });

        if (element.message.match(emojiRegex)) {
          emoji.push(element);
        }
      } else {
        if (element.message.match(emojiRegex)) {
          emojiRecue.push(element);
        }

        if (element.message.indexOf(angryRogex) != -1) {
          total_angry.push(element);

        }

        good.map((mot) => {
          if (element.message.toLowerCase().match(mot)) {
            total_good.push(element);
          }
        });
      }
    }
    let infos = [
      ["Total number of messages sent : ", nomMessages.length],
      ['Total number of times the user sent "lol"  : ', total_lol.length],
      ['Total number of times the user sent "lmao": ', total_lmao.length],
      ["Total number of times the user sent emojis : ", emoji.length],
      [
        'Total number of profanities the user sent. The only profanities to check for are   "fuck", "merde", "putain", "ass". : ',
        total_profanities.length
      ],
      ["Total number of times the user recieved emojis. : ", emojiRecue.length],
      ["Total number of times the user recieved the angry 😡 emoji : ", total_angry.length],
      [
        'Total number of times the user sent and recieved the words "amen", "akpe", "merci", "nagode", "imela", "thanks", "thank you", "alhamdulillah", "shukran" : ',
        total_good.length
      ],
    ];
    console.table(infos);

    firstPrompt();
  });
}

// print console
function firstPrompt() {
  inquirer
    .prompt([
      {
        message: "what do you want to do ?",
        type: "list",
        name: "task",
        choices: ["See the application", "Leave ?"],
      },
    ])
    .then((rep) => {
      if (rep.task == "See the application") {
        number_of_messages_sent();
      } else {
        console.log("bay");
      }
    });
}

firstPrompt();

