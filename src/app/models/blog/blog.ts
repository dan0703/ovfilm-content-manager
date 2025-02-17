import { BlogSummary } from "./blog-summary";

export interface Blog extends BlogSummary 
{
    subtitle1: string;
    content1: string;
    content2?: string;
    subtitle2?: string;
    content3?: string;
    imgUrl2?: string;
    alt2?: string;
    imgUrl3?: string;
    alt3?: string;
    imgUrl: string;
    title: string;
    date: string;
    _id?: string;
}