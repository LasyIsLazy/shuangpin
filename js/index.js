const text = document.getElementById('text');
const input = document.getElementById('input');
const prompt = document.getElementById('prompt');
const promptBtn = document.getElementById('promptBtn');
const length = data.length;
let currentData;
let currentInitail; // 声母
let currentFinalIndex;
let currentFinal; // 韵母
let currentPinyin; // 拼音
let shuangpinInitail; // 双拼声母
let shuangpinFinal; // 双拼韵母
let shuangpin; // 双拼
function next() {
  currentData = data[Math.floor(Math.random() * length)];
  currentInitail = currentData.initial;
  currentFinalIndex = Math.floor(Math.random() * currentData.finals.length);
  currentFinal = currentData.finals[currentFinalIndex];
  currentPinyin = currentData.initial + currentFinal;
  shuangpinInitail = xiaohe[currentInitail]
    ? xiaohe[currentInitail]
    : currentInitail;
  shuangpinFinal = xiaohe[currentFinal] ? xiaohe[currentFinal] : currentFinal;
  shuangpin = shuangpinInitail + shuangpinFinal;
}
function update() {
  text.innerHTML = currentPinyin;
}
function clear() {
  input.value = '';
  prompt.innerHTML = '';
}
function validate(callback) {
  input.value === shuangpin && callback && callback();
}
function showPrompt() {
  prompt.innerHTML = shuangpin;
}
next();
update();
input.addEventListener('input', () => {
  validate(() => {
    clear();
    next();
    update();
  });
});
promptBtn.addEventListener('click', () => {
  showPrompt();
});
