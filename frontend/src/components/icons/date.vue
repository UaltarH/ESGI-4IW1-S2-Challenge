<template>
  <svg width="24" height="24" viewBox="18 16 24 24" xmlns="http://www.w3.org/2000/svg">
    <title>Calendrier</title>
    <defs>
      <filter id="a" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox">
        <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
        <feGaussianBlur stdDeviation="10" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" in="shadowBlurOuter1"
                       result="shadowMatrixOuter1"/>
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <path fill-rule="evenodd" class="fill-gray-400 dark:fill-gray-800"
          d="M35 19l1.999-.002c1.657-.003 3.001 1.333 3.001 2.988v13.021c0 1.653-1.343 2.993-2.994 2.993h-14.012c-1.654 0-2.994-1.353-2.994-2.993v-13.015c0-1.652 1.339-2.992 3.001-2.992h1.993l.006 2h2v-1.991c0-.557.444-1.009 1-1.009.552 0 1 .443 1 1.009v1.981c0 .003 2 .009 2 .009v-1.991c0-.557.444-1.009 1-1.009.552 0 1 .443 1 1.009v1.981c0 .003 4 .008 4 .008.552.001 1 .444 1 1v2.001h-16v-2.001c0-.552.444-.999 1-.999h4c.005.562.451 1 1 1 .553 0 .995-.447 1-1h2c.005.562.451 1 1 1 .553 0 .995-.447 1-1h2v-2zm1.999 17h-13.998c-.553-.035-1.001-.489-1.001-1.027v-8.973h16v8.973c0 .548-.445.992-1.001 1.027zm-11.999-8h2v2h-2v-2zm0 4h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm-4 0h2v2h-2v-2z"
          filter="url(#a)"/>
  </svg>
</template>