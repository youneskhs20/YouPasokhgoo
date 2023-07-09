<template>
  <div class="block relative p-input-icon-right p-input-icon-left">
    <Button
      icon="fa-solid fa-microphone"
      class="search-input-btn absolute top-0 left-0"
      severity="secondary"
      text
      @click="startSpeechRecognition"
    />

    <InputText
      v-model="query"
      dir="rtl"
      placeholder="جستجوی در سؤالات..."
      class="search-input w-full"
      :classs="{
        'border-noround-bottom border-md-top': isFocused && test.length !== 0,
      }"
      @click.native="$event.target.select()"
      @keyup.enter="onSearch"
      @focus="isFocused = true"
      @blur="query ? (isFocused = true) : undefined"
    />

    <Button
      icon="fa-solid fa-search"
      class="search-input-btn absolute top-0 right-0"
      severity="secondary"
      text
      @click="onSearch"
    />

    <Dialog
      v-model:visible="visible"
      modal
      :show-header="false"
      :close-on-escape="true"
      :style="{ width: '585px' }"
      :dismissable-mask="true"
      :draggable="true"
      :pt="{
        root: { class: 'mx-3' },
        content: { class: 'p-3 border-round-3xl' },
      }"
      @hide="abortSpeechRecognition"
    >
      <div
        class="flex flex-column flex-sm-row align-items-center text-center sm:text-justify"
      >
        <div class="col-12 col-sm-3">
          <Button
            :class="{ 'mic-pulse': listening }"
            class="dialog-mic text-lg sm:text-2xl border-circle w-4rem h-4rem sm:w-5rem sm:h-5rem"
            icon="fa-solid fa-microphone"
            icon-class="text-primary"
            severity="secondary"
            @click="startSpeechRecognition"
          />
        </div>
        <div class="text-sm sm:text-base col-12 col-sm-9">
          <p v-if="interimQuery.length === 0" dir="rtl">{{ speechStatus }}</p>
          <p v-if="interimQuery.length !== 0" dir="rtl">{{ interimQuery }}</p>
        </div>
      </div>
    </Dialog>

    <!-- <Listbox 
      @click="log"
      dir="rtl"
      v-if="test.length !== 0 && isFocused" 
      v-model="query" 
      :options="test" 
      class="w-full absolute border-noround-top z-1" 
    /> -->
    <!-- <div class="search-history absolute w-full bg-primary border-round-bottom">
      <ul>
        <li>
          hello
        </li>
        <li>
          hello
        </li>
        <li>
          hello
        </li>
        <li>
          hello
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Listbox from "primevue/listbox";
import Dialog from "primevue/dialog";

export default {
  components: {
    InputText,
    Button,
    Listbox,
    Dialog,
  },
  data() {
    return {
      interimQuery: "",
      query: this.$route.query.q || "",
      searchHistory: JSON.parse(localStorage.getItem("searchHistory")) || [],
      test: ["hello world", "java", "python", "solidity"],
      isFocused: false,
      speechRecognition: null,
      speechStatus: "",
      listening: false,
      visible: false,
    };
  },

  methods: {
    onSearch() {
      if (this.query.length !== 0) {
        this.$router.push({ path: "/search", query: { q: this.query } });
      }
    },

    startSpeechRecognition() {
      if (!this.listening) {
        this.visible = true;

        const SpeechRecognition =
          window.SpeechRecognition || webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = "fa-IR";
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onstart = () => {
          this.speechStatus = "در حال گوش دادن...";
          this.listening = true;
        };

        this.recognition.onresult = (event) => {
          this.interimQuery = "";

          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.query = "";
              this.query += event.results[i][0].transcript;
              this.visible = false;
              this.onSearch();
            } else {
              this.interimQuery += event.results[i][0].transcript;
            }
          }
        };

        this.recognition.onerror = (event) => {
          if (event.error === "no-speech") {
            this.speechStatus = "صدایی تشخیص داده نشد.";
            this.listening = false;
          }
        };

        this.recognition.start();
      } else {
        this.stopSpeechRecognition();
        this.visible = false;
      }
    },

    stopSpeechRecognition() {
      if (this.listening) {
        this.recognition.stop();
        this.listening = false;
      }
    },

    abortSpeechRecognition() {
      this.interimQuery = "";
      this.recognition.abort();
    },
  },
};
</script>

<style>
::placeholder {
  color: var(--text-color);
}

.p-input-icon-right .search-input {
  padding-right: 60px;
  padding-left: 60px;
}

.p-input-icon-right .search-input-btn:focus {
  box-shadow: none !important;
  background-color: transparent !important;
}
.p-input-icon-right .search-input-btn:hover {
  background-color: transparent !important;
}

.dialog-mic {
  position: relative;
  transition: 0.2s;
}

.dialog-mic:hover {
  transform: scale(1.05);
}

.dialog-mic::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  border-radius: inherit;
  background-color: var(--text-color);
}

.mic-pulse {
  animation: mic-pulse 2s infinite;
}

@keyframes mic-pulse {
  0% {
    box-shadow: 0 0 0 0 var(--text-color);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>
