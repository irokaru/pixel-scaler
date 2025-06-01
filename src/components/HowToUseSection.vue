<template>
  <div class="box margin-tb-2 block">
    <h2>{{ $t("what-is.heading") }}</h2>
    <p v-for="step in $tm('what-is.steps')" v-html="step"></p>

    <hr />

    <h2>{{ $t("usage.heading") }}</h2>
    <ol>
      <li v-for="step in $tm('usage.steps')">
        {{ step }}
      </li>
    </ol>

    <hr />

    <h2>{{ $t("tips.heading") }}</h2>
    <ul>
      <li v-for="tip in $tm('tips.steps')">
        {{ tip }}
      </li>
    </ul>
  </div>
</template>
