<template>
  <div>
    <div ref="editor" id="editor"></div>
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
      editorContent: null,
      isChange: false
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      this.editor = new wangEditor(this.$refs.editor)
      this.editor.config.zIndex = 500
      this.editor.config.height = 500
      this.editor.config.excludeMenus = ['emoticon', 'video', 'code']
      this.editor.config.uploadImgServer = this.uploadURL
      this.editor.config.withCredentials = true
      this.editor.config.uploadFileName = 'wechatFile'
      this.editor.config.onchange = html => {
        this.isChange = true
        this.editorContent = html
        this.$emit('update-content', this.editorContent)
      }
      this.editor.config.uploadImgHooks = {
        fail: (xhr, editor, resData) => {
          console.log('fail', resData)
        },
        error: (xhr, editor, resData) => {
          console.log('error', xhr, resData)
        },
        timeout: xhr => {
          this.$message.warning('上传超时')
        },
        customInsert: (insertImgFn, result) => {
          if (result.code == 200) {
            insertImgFn(result.data.url)
          }
        }
      }
      this.editor.create()
    }
  },
  watch: {
    content(val) {
      if (!this.isChange) {
        this.editorContent = val
        this.editor.txt.html(val)
      }
      this.isChange = false
    }
  }
}
</script>
