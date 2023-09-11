/**
 * Typings for the @lezer/generator/rollup plugin, which
 * allows `*.grammar` files to be imported directly, and
 * compiles them during the build.
 */
declare module "*.grammar" {
  import { LRParser } from "@lezer/lr";
  export const parser: LRParser;
}