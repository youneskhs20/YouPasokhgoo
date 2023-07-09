<template>
  <div
    class="hover:bg-primary relative h-auto border-primary border-1 border-round-2xl mt-2 px-5 py-2 transition-duration-100"
  >
    <div class="mb-2">
      <p
        class="q-text text-sm md:text-base xl:text-lg text-color-secondary"
        v-html="QText"
      ></p>
      <p
        class="a-text text-xs md:text-sm xl:text-base text-color mt-3"
        v-html="AText"
      ></p>
    </div>
    <div>
      <Badge
        class="mr-2 bg-primary-reverse text-white text-xs md:text-sm font-light lg:font-normal"
        >{{ handleSubjectID }}</Badge
      >
      <Badge
        class="mr-2 bg-primary-reverse text-white text-xs md:text-sm font-light lg:font-normal"
        >{{ handleSystemID }}</Badge
      >
    </div>
  </div>
</template>
<script>
import * as constants from "../constants";
import Badge from "primevue/badge";

export default {
  components: {
    Badge,
  },

  props: {
    result: Object,
  },
  data() {
    return {
      AText: "- " + this.result.HighlightedText.AText,
      QText: "- " + this.result.HighlightedText.QText,
    };
  },

  computed: {
    handleSubjectID() {
      return constants.subjects.find(
        (item) => item.ID == this.result.Source.subjectID
      ).Title;
    },

    handleSystemID() {
      return constants.systems.find(
        (item) => item.ID == this.result.Source.systemID
      ).Title;
    },
  },
};
</script>
<style>
.q-text::before {
  content: url(../assets/logo.svg);
  position: absolute;
  top: 7px;
  right: 15px;
  width: 21px;
  height: 27px;
}

.q-text em {
  text-decoration: underline;
}

.a-text em {
  color: var(--text-color-secondary);
  font-style: normal;
  font-weight: bold;
}
</style>
