<template>
  <div class="keys-container" v-show="prompt">
    <div class="keys-container-row" v-for="(keyboardRow, index) in keyboardRows" :key="index">
      <div
        v-for="(key, index) in keyboardRow"
        :key="index"
        :class="['key', (key === shuangpinInitial || key === shuangpinFinal) ? 'key-prompt' : '']"
      >
        <div class="flex-container">
          <div class="key-keyboard" :class="key === initial ? 'initial-prompt' : ''">{{ key }}</div>
          <div class="key-initials">
            <span
              v-for="(item, index) in keys[key].initials"
              :key="index"
              :class="item === initial ? 'initial-prompt' : ''"
            >{{ item + ' ' }}</span>
          </div>
        </div>
        <div>
          <div
            v-for="(item, index) in keys[key].finals"
            :key="index"
            :class="item === final ? 'final-prompt' : ''"
          >{{ item }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ALL_KEYS from '../commons/shuangpin-key'
export default {
  name: 'shuangpinKeys',
  props: {
    plan: String,
    initial: String,
    final: String,
    shuangpinInitial: String,
    shuangpinFinal: String,
    prompt: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      keyboard: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']
    }
  },
  computed: {
    keys () {
      return ALL_KEYS[this.plan]
    },
    keyboardRow1 () {
      return this.keyboard.slice(0, 10)
    },
    keyboardRow2 () {
      return this.keyboard.slice(10, 19)
    },
    keyboardRow3 () {
      return this.keyboard.slice(19)
    },
    keyboardRows () {
      return [this.keyboardRow1, this.keyboardRow2, this.keyboardRow3]
    }
  }
}
</script>
<style scoped>
.keys-container {
  width: 80vw;
  margin: 0 auto;
}
.keys-container-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.key {
  width: 8vw; /* 80vw / 10 */
  height: 8vw; /* 80vw / 10 */
  box-sizing: border-box;
  border: 1px solid #000;
  text-align: center;
  font-size: 2vw;
  line-height: 2vw;
}
.key-keyboard {
  width: 40%;
  font-size: 3vw;
  line-height: 3vw;
}
.key-initials {
  width: 60%;
}
.key-prompt {
  background-color: lightgrey;
}
.initial-prompt {
  color: crimson;
}
.final-prompt {
  color: crimson;
}
.flex-container {
  display: flex;
}
</style>
