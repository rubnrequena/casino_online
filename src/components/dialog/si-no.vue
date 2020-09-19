<template>
  <div class="message-box dialog-mask" @click="$close">
    <div class="dialog-content">
      <div class="dialog-body">
        <p>{{ content }}</p>
      </div>
      <footer>
        <v-btn type="text" size="mini" @click="$close">OK</v-btn>
      </footer>
    </div>
  </div>
</template>