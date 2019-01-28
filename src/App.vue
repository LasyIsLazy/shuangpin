<template>
  <div>
    <label for="plan">双拼方案</label>
    <el-select v-model="plan" name="plan">
      <el-option
        v-for="(item, index) in plans"
        :key="index"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <label for="keyPlan">练习方案</label>
    <el-select v-model="keyPlan" name="keyPlan" @change="handleKeyPlanChange">
      <el-option
        v-for="(item, index) in KEY_PLANS"
        :key="index"
        :label="item.name"
        :value="item.keys"
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
          <span class="prompt">{{ prompt }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="20">
          <el-input
            v-model="input"
            name="input"
            @input="handleInput"
            @keydown.tab.prevent.native="handleTab"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="next">下一个</el-button>
        </el-col>
      </el-row>
    </div>
    <p>说明：输入正确自动下一个，按Tab键提示</p>
    <shuangpin-keys
      :plan="plan"
      :initial="initial"
      :final="final"
      :shuangpin-initial="shuangpinInitial"
      :shuangpin-final="shuangpinFinal"
      :prompt="isPromptVisible"
    ></shuangpin-keys>
  </div>
</template>

<script>
import ShuangpinKeys from './components/ShuangpinKeys'
import { plans } from './commons/config'
import ALL_PINYIN from './commons/pinyin'
import SHUANGPIN from './commons/shuangpin'
import KEY_PLANS from './commons/key-plan.js'
import SHUANGPIN_KEYS from './commons/shuangpin-key.js'

export default {
  name: 'App',
  components: {
    ShuangpinKeys
  },
  data () {
    return {
      plans,
      plan: '', // 双拼方案
      KEY_PLANS, // 所有练习方案
      keyPlan: null, // 练习方案（键位数组）
      input: '',
      initial: '',
      final: '',
      shuangpinInitial: '',
      shuangpinFinal: '',
      prompt: '', // 提示
      isPromptVisible: false
    }
  },
  computed: {
    shuangpin () {
      return this.shuangpinInitial + this.shuangpinFinal
    },
    pinyin () {
      return this.initial + this.final
    },
    /**
     * 当前方案的双拼对应键位
     */
    shuangpinKeys () {
      return SHUANGPIN_KEYS[this.plan]
    },
    /**
     * 当前方案的双拼所有声母
     */
    shuangpinInitials () {
      let result = []
      this.keyPlan.forEach(key => {
        const { initials } = this.shuangpinKeys[key] // 该键位对应的声母
        result = result.concat(initials)
      })
      return result
    },
    /**
     * 当前方案的双拼所有韵母
     */
    shuangpinFinals () {
      let result = []
      this.keyPlan.forEach(key => {
        const { finals } = this.shuangpinKeys[key] // 该键位对应的声母
        result = result.concat(finals)
      })
      return result
    },
    /**
     * 当前方案对应的所有拼音
     */
    pinyins () {
      if (!this.keyPlan) {
        return ALL_PINYIN
      }
      // 过滤不在当前方案的拼音
      const result = ALL_PINYIN
        // 过滤掉声母不在当前方案的拼音
        .filter(pinyin => {
          const { initial } = pinyin
          if (this.shuangpinInitials.findIndex(ele => initial === ele) === -1 && this.keyPlan.findIndex(ele => ele === initial)) {
            // 声母不在当前方案中 => 过滤掉
            return false
          }
          return true
        }, this)
        // 过滤不在练习方案的韵母
        .map(pinyin => {
          let returnPinyin = pinyin
          const { finals } = pinyin
          const filteredFinals = finals.filter(final => this.shuangpinFinals.findIndex(ele => ele === final) !== -1) // 过滤掉拼音的韵母不在练习方案韵母中的
          returnPinyin.finals = filteredFinals
          return returnPinyin
        })
        // 过滤没有韵母的
        .filter(pinyin => pinyin.finals.length !== 0)
      return result
    }
  },
  methods: {
    /**
     * 下一个
     */
    next () {
      const pinyin = this.pinyins[Math.floor(Math.random() * this.pinyins.length)]
      const { initial, finals } = pinyin
      const final = finals[Math.floor(Math.random() * finals.length)]
      this.initial = initial
      this.final = final
      const shuangpin = SHUANGPIN[this.plan]
      this.shuangpinInitial = shuangpin[initial] ? shuangpin[initial] : initial
      this.shuangpinFinal = shuangpin[final] ? shuangpin[final] : final
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
    /**
     * 练习方案改变
     */
    handleKeyPlanChange () {
      this.next()
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
      this.prompt = this.shuangpinInitial + this.shuangpinFinal
    }
  },
  beforeMount () {
    this.plan = plans[0].value
    this.next()
  }
}
</script>

<style>
.input-container {
  width: 500px;
  margin: 50px auto;
}
.prompt {
  color: green;
}
</style>
