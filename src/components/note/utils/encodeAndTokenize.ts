//@ts-ignore
import moji from "moji";
import { trigram } from 'n-gram';
//@ts-ignore
import TinySegmenter from "tiny-segmenter";

const segmenter = new TinySegmenter();

function _tokenize(text: any, tokenizer: any) {
    if (tokenizer === "trigram") {
        return trigram(text)
    } else {
        return segmenter.segment(text)
    }
}

export function tokenize(text: any, tokenizer: any) {
    const query = moji(text).convert("HK", "ZK").convert("ZS", "HS").convert("ZE", "HE").toString().trim()
    return _tokenize(query, tokenizer).map((word: any) => {
        if (word !== " ") {
            return moji(word).convert("HG", "KK").toString().toLowerCase();
        }
    }).filter((v: any) => v)
}

export function encode(text: any) {
    console.log(text)
    return moji(text).convert("HK", "ZK").convert("ZS", "HS").convert("ZE", "HE").convert("HG", "KK").toString().trim().toLowerCase();
}
