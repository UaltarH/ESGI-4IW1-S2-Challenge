<template>
  <svg width="16" height="16" viewBox="12 10 32 32" xmlns="http://www.w3.org/2000/svg">
    <title>Etiquette</title>
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
    <path fill-rule="evenodd"
          d="M19.004 19.999c-.002-1.103.883-1.996 1.994-1.994l4.783.008c1.669-.128 3.979.724 5.177 1.922l7.146 7.146c1.19 1.19 1.194 3.116.004 4.305l-5.723 5.723c-1.188 1.187-3.107 1.193-4.305-.004l-7.146-7.146c-1.19-1.19-2.051-3.508-1.922-5.176l-.008-4.782zm3.345 8.544l7.146 7.146c.414.414 1.068.414 1.477.004l5.723-5.723c.407-.407.406-1.066-.004-1.476l-7.146-7.146c-.783-.783-2.519-1.426-3.545-1.349l-3.999-.002c-.552 0-1 .443-1 1l-.001 4.003c-.077 1.02.571 2.766 1.349 3.543zm2.651-2.543c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z"
          filter="url(#a)"/>
  </svg>
</template>