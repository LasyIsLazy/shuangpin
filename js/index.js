const text = document.getElementById('text');
const input = document.getElementById('input');
const prompt = document.getElementById('prompt');
const promptBtn = document.getElementById('promptBtn');
const area = document.getElementById('area');
const nextBtn = document.getElementById('nextBtn');
let data; // 要练习的声母、韵母
let plan; // 练习方案
let currentData;
let currentInitail; // 声母
let currentFinalIndex;
let currentFinal; // 韵母
let currentPinyin; // 拼音
let shuangpinInitail; // 双拼声母
let shuangpinFinal; // 双拼韵母
let shuangpin; // 双拼
/**
 * 下一个
 */
function next() {
  clear();
  if (!plan || plan === '0') {
    data = ALL_PINYIN; // 默认全部拼音
  } else {
    const keys = Array.from(new Set(plan.split('')));
    data = ALL_PINYIN.filter(py => {
      // 过滤声母不在 keys 中的
      const initial = XIAOHE[py.initial] ? XIAOHE[py.initial] : py.initial;
      return keys.findIndex(ele => ele === initial) !== -1;
    })
      .map(py => {
        // 过滤韵母不在 keys 中的
        const finals = py.finals.filter(ele => {
          const final = XIAOHE[ele] ? XIAOHE[ele] : ele;
          return keys.findIndex(key => key === final) !== -1;
        });
        return {
          ...py,
          finals
        };
      })
      .filter(ele => ele.finals.length > 0); // 过滤没有韵母的
  }
  currentData = data[Math.floor(Math.random() * data.length)];
  currentInitail = currentData.initial;
  currentFinalIndex = Math.floor(Math.random() * currentData.finals.length);
  currentFinal = currentData.finals[currentFinalIndex];
  currentPinyin = currentData.initial + currentFinal;
  shuangpinInitail = XIAOHE[currentInitail]
    ? XIAOHE[currentInitail]
    : currentInitail;
  shuangpinFinal = XIAOHE[currentFinal] ? XIAOHE[currentFinal] : currentFinal;
  shuangpin = shuangpinInitail + shuangpinFinal;
}
function render() {
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
render();
input.addEventListener('input', () => {
  validate(() => {
    next();
    render();
  });
});
input.addEventListener('keydown', e => {
  if (e.code === 'Tab') {
    e.preventDefault();
    showPrompt();
  } else if (e.keyCode >= 65 && e.keyCode <= 90) {
    // input 长度限制
    input.value.length >= 2 && e.preventDefault();
  }
});
promptBtn.addEventListener('click', () => {
  showPrompt();
});
area.addEventListener('change', () => {
  plan = area.value;
  next();
  render();
});
nextBtn.addEventListener('click', () => {
  next();
  render();
});
for (const key in XIAOHE_KEY) {
  if (XIAOHE_KEY.hasOwnProperty(key)) {
    const element = XIAOHE_KEY[key];
    const { initials, finals } = element;
    let initialStr = '';
    for (const val of initials) {
      initialStr += val + '<br/>';
    }
    let finalStr = '';
    for (const val of finals) {
      finalStr += val + '<br/>';
    }
    document.getElementById(
      `initial_${key.toUpperCase()}`
    ).innerHTML = initialStr;
    document.getElementById(`final_${key.toUpperCase()}`).innerHTML = finalStr;
  }
}
