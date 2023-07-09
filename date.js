exports.getDate = function() {
const today = new Date();
const options= {
  weekday: "long",
  day: "numeric",
  month: "long"
};
const day=today.toLocaleDateString("en-US",options);
return day;
}
module.exports.getDay= getDay;
function getDay() {
let today = new Date();
let options= {
  weekday: "long",
};
const day=today.toLocaleDateString("en-US",options);
return day;
}
