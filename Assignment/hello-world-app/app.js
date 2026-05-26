cat << EOF > app.js;
const _ = require("lodash");

console.log("Hello, World from Jenkins Pipeline!");
console.log(_.join([" Jenkins", "Zero", "To", "Hero"], "-"));
EOF;
