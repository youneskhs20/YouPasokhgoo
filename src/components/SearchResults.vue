<template>
  <div class="search-results-page">
    <nav
      class="search-results-header h-8rem md:h-12rem border-bottom-1"
      style="border-color: #856968"
    >
      <div class="container h-full">
        <div
          class="h-full row justify-content-center align-items-center flex-column-reverse flex-md-row"
        >
          <div class="search-container col-md-8 col-lg-6">
            <SearchInput />
          </div>
          <div
            class="hidden md:block text-center md:text-right col-md-4 col-lg-6"
          >
            <router-link to="/">
              <img src="../assets/searchresults-logo.png" alt="logo" />
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <ProgressBar
      v-if="loading"
      mode="indeterminate"
      class="bg-primary-reverse border-noround"
      style="height: 7px"
    ></ProgressBar>

    <main class="container">
      <div dir="rtl" class="flex justify-content-between align-items-center">
        <div>
          <Breadcrumb
            class="text-xs sm:text-sm font-light border-none"
            :model="model"
            :pt="{
              separatorIcon: { class: 'text-color-secondary' },
            }"
          >
            <template #separator>
              <span class="text-xs sm:text-sm font-bold">/</span>
            </template>
          </Breadcrumb>
        </div>
        <div class="p-3">
          <span dir="rtl" class="text-xs sm:text-sm text-color"
            >{{ totalResults }} نتیجه یافت شد</span
          >
        </div>
      </div>

      <div class="text-center">
        <div v-if="error">
          <h1 dir="rtl" class="text-color">خطای شبکه</h1>
        </div>
        <div v-if="totalResults === 0">
          <h1 dir="rtl" class="text-color">نتیجه‌ای یافت نشد !</h1>
        </div>
      </div>

      <div v-if="!error">
        <ul :class="{ 'opacity-50': paginating }" dir="rtl">
          <li v-for="item in searchResult" :key="item.Source.QID">
            <ResultBox :result="item" />
          </li>
        </ul>

        <div class="my-3">
          <Paginator
            v-if="!loading && !error && totalResults !== 0"
            :first="page * recordPerPage"
            :rows="10"
            :total-records="totalResults"
            :rows-per-page-options="[10, 20, 30]"
            :template="{
              '576px': 'FirstPageLink PrevPageLink NextPageLink LastPageLink',
            }"
            :pt="{
              root: { class: 'lg:w-8 mx-auto' },
              firstPageButton: { class: 'text-color' },
              lastPageButton: { class: 'text-color' },
              prevPageButton: { class: 'text-color' },
              nextPageButton: { class: 'text-color' },
              pageButton: ({ props, state, context }) => ({
                class: `${
                  context.active ? 'bg-primary-reverse' : 'text-color'
                } text-sm pt-1`,
              }),
              end: {
                class:
                  'w-full sm:w-auto text-center md:mx-auto text-sm md:text-base',
              },
            }"
            @page="handlePagination"
          >
            <template #end="slotProps">
              <span
                :class="{ 'opacity-50': paginating }"
                dir="rtl"
                class="text-color"
              >
                نمایش {{ slotProps.state.page * slotProps.state.rows + 1 }} -
                {{
                  slotProps.state.page * slotProps.state.rows +
                  slotProps.state.rows
                }}
                از {{ totalResults }}
              </span>
            </template>
          </Paginator>
        </div>
      </div>
    </main>

    <footer
      v-if="!loading && !error && totalResults !== 0"
      class="w-full h-3rem bg-primary-reverse flex align-items-center justify-content-center"
    >
      <h3>Developed By <span class="text-primary">Youneskhs20</span></h3>
    </footer>
  </div>
</template>
<script>
import axios from "axios";
import SearchInput from "./SearchInput.vue";
import ProgressBar from "primevue/progressbar";
import ResultBox from "./ResultBox.vue";
import Paginator from "primevue/paginator";
import Breadcrumb from "primevue/breadcrumb";
import ProgressSpinner from "primevue/progressspinner";

export default {
  components: {
    SearchInput,
    ProgressBar,
    ResultBox,
    Paginator,
    Breadcrumb,
    ProgressSpinner,
  },
  data() {
    return {
      model: [{ label: "صفحه نخست", to: "/" }, { label: "نتایج جستجو" }],
      query: this.$route.query.q,
      searchResult: null,
      totalResults: null,
      loading: true,
      error: false,
      page: this.$route.query.page - 1 || 0,
      recordPerPage: 10,
      paginating: false,
    };
  },

  watch: {
    "$route.query.q": {
      immediate: true,
      handler(newQuery) {
        this.query = newQuery;
        if (typeof this.$route.query.page == "Number") {
          console.log("hi");
        }
        this.loading = true;
        this.postQuery();
      },
    },
  },

  created() {
    this.postQuery();
  },

  methods: {
    postQuery() {
      const url = "http://searchapi.pasokhgoo.ir/Search/search";

      axios
        .post(url, {
          query: this.query,
          from: this.page * this.recordPerPage,
          to: this.page * this.recordPerPage + this.recordPerPage,
        })
        .then((response) => {
          this.searchResult = [];
          this.searchResult = response.data.Results;
          this.totalResults = response.data.TotalResults;
          this.loading = false;
          this.paginating = false;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(this.query);
          console.log(e);
          this.loading = false;
          this.paginating = false;
          this.error = true;
        });
    },

    handlePagination(e) {
      this.recordPerPage = e.rows;
      this.page = e.page;
      if (e.page != 0) {
        this.$router.push({
          query: { ...this.$route.query, page: e.page + 1 },
        });
      } else {
        let newQuery = { ...this.$route.query };
        delete newQuery.page;
        this.$router.push({ query: newQuery });
      }
      this.paginating = true;
      this.postQuery();
    },
  },
};
</script>

<style scoped>
nav.search-results-header {
  background: url(../assets/searchresultheader-bg.png) no-repeat center;
}

ul {
  list-style-type: none;
}
</style>
