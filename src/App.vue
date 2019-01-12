<template>
  <div id="app">
    <label for="plan">双拼方案</label>
    <el-select v-model="plan" name="plan">
      <el-option
        v-for="(item, index) in plans"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div class="input-container">
      <el-row>
        <el-col :span="12">
          <label>拼音</label>
          <span for="input">{{ pinyin }}</span>
        </el-col>
        <el-col :span="12" v-show="isPromptVisible">
          <label>双拼</label>
          <span>{{ prompt }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="20">
          <el-input v-model="input" name="input" @input="handleInput" @keydown.tab.prevent.native="handleTab"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="next">下一个</el-button>
        </el-col>
      </el-row>
    </div>
    <p>说明：输入正确自动下一个，按Tab键提示</p>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import { plans } from './commons/config'
import ALL_PINYIN from './commons/pinyin'
import SHUANGPIN from './commons/shuangpin'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      plans,
      plan: '', // 双拼方案
      input: '',
      initial: '',
      final: '',
      shuangpin_initial: '',
      shuangpin_final: '',
      prompt: '', // 提示
      isPromptVisible: false
    }
  },
  computed: {
    shuangpin () {
      return this.shuangpin_initial + this.shuangpin_final
    },
    pinyin () {
      return this.initial + this.final
    }
  },
  methods: {
    next () {
      const pinyin = ALL_PINYIN[Math.floor(Math.random() * ALL_PINYIN.length)]
      const { initial, finals } = pinyin
      const final = finals[Math.floor(Math.random() * finals.length)]
      this.initial = initial
      this.final = final
      const shuangpin = SHUANGPIN[this.plan]
      this.shuangpin_initial = shuangpin[initial] ? shuangpin[initial] : initial
      this.shuangpin_final = shuangpin[final] ? shuangpin[final] : final
    },
    handleInput () {
      this.validate().then(() => {
        this.isPromptVisible = false
        this.input = ''
        this.next()
      }).catch(() => {
      })
    },
    handleTab () {
      this.showPrompt()
    },
    validate () {
      return new Promise((resolve, reject) => {
        if (this.input !== this.shuangpin) {
          reject(new Error('验证未通过'))
        }
        resolve()
      })
    },
    showPrompt () {
      this.isPromptVisible = true
      this.prompt = this.shuangpin_initial + this.shuangpin_final
    }
  },
  beforeMount () {
    this.plan = plans[0].value
    this.next()
  }
}
</script>

<style>
#app {

}
.input-container {
  width: 500px;
  margin: 50px auto;
}
</style>
