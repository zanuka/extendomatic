<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const color = ref("red");

async function changeBackground() {
  try {
    if (typeof chrome !== "undefined" && chrome.runtime?.id) {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        console.error("No active tab found");
        return;
      }

      const url = tab.url || "";
      if (
        url.startsWith("chrome://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:")
      ) {
        console.error("Cannot access browser system pages");
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (colorValue) => {
          document.body.style.backgroundColor = colorValue;
        },
        args: [color.value],
      });
    } else {
      document.body.style.backgroundColor = color.value;
    }
  } catch (error) {
    console.error("Extension error:", error);
  }
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div>
    <input type="color" v-model="color" />
  </div>

  <div class="card">
    <button type="button" @click="changeBackground">
      Change Background Color
    </button>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
