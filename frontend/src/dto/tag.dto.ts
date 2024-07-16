import type {Component} from "vue";

export interface Tag {
    name: string;
    icon: Component;
    color: TagType;
}
export enum TagType {
    NEWS,
    TUTORIAL,
    ANNOUNCEMENT,
}
export function getTagColors(tagType: TagType): string {
    switch (tagType) {
        case TagType.NEWS :
            return 'border-tag-news bg-tag-news backdrop-brightness-90';
        case TagType.TUTORIAL :
            return 'border-tag-tutorial bg-tag-tutorial backdrop-brightness-90';
        case TagType.ANNOUNCEMENT :
            return 'border-tag-announcement bg-tag-announcement backdrop-brightness-90';
    }
}