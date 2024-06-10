<template>
  <div class="tag"
       :class="color == TagType.NEWS ? 'border-tag-news bg-tag-news-bg' :
                color == TagType.TUTORIAL ? 'border-tag-tutorial bg-tag-tutorial-bg' :
                color == TagType.ANNOUNCEMENT ? 'border-tag-announcement bg-tag-announcement-bg' : ''"
  >
    <component :is="component" width="16" height="16"
               :class="color == TagType.NEWS ? 'fill-tag-news' :
                      color == TagType.TUTORIAL ? 'fill-tag-tutorial' :
                      color == TagType.ANNOUNCEMENT ? 'fill-tag-announcement' : 'fill-black'"
               :color="color == TagType.NEWS ? '#FF9D00' :
                      color == TagType.TUTORIAL ? '#4e52cc' :
                      color == TagType.ANNOUNCEMENT ? '#E07A5F' : '#000'"
    ></component>
    <span class="tag--text"
          :class="color == TagType.NEWS ? 'text-tag-news' :
                 color == TagType.TUTORIAL ? 'text-tag-tutorial' :
                 color == TagType.ANNOUNCEMENT ? 'text-tag-announcement' : 'text-black'"
    >{{ name }}</span>
  </div>
</template>
<script lang="ts" setup>
import {type Component} from 'vue';
import {TagType} from "~/data/tag.dto";

const props = defineProps<{
  name: string;
  component: Component;
  color: TagType;
}>();
</script>