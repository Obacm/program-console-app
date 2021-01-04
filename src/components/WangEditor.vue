<template>
  <div>
    <div id="editor"></div>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
import { uploadUrl } from '@/api'

export default {
  name: 'wang-editor',
  data() {
    return {
      editor: null,
      editorContent: this.content
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  mounted() {
    const editor = new wangEditor('#editor')

    editor.config.zIndex = 500
    editor.config.height = 500

    editor.config.excludeMenus = ['emoticon', 'video', 'code']

    // 配置 onchange 回调函数，将数据同步到 vue 中
    editor.config.onchange = newHtml => {
      this.editorContent = newHtml
    }

    editor.create()

    this.editor = editor

    this.editor.config.uploadImgServer = this.uploadURL
    this.editor.config.withCredentials = true
    this.editor.config.uploadFileName = 'wechatFile'
    this.handerHooks()
    this.editor.txt.html(this.editorContent)
  },
  methods: {
    getEditorData() {
      let data = this.editor.txt.html()
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy()
      this.editor = null
    },
    handerHooks() {
      this.editor.config.uploadImgHooks = {
        // 图片上传并返回了结果，但图片插入时出错了
        fail: (xhr, editor, resData) => {
          console.log('fail', resData)
        },
        // 上传图片出错，一般为 http 请求的错误
        error: (xhr, editor, resData) => {
          console.log('error', xhr, resData)
        },
        // 上传图片超时
        timeout: xhr => {
          this.$message.warning('上传超时')
        },
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: (insertImgFn, result) => {
          if (result.code == 200) {
            insertImgFn(result.data.url)
          }
        }
      }
    }
  },
  watch: {
    editorContent() {
      this.$emit('update-content', this.editorContent)
    }
  }
}
</script>
