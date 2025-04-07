import { atom } from "jotai";
import type { promptResponse } from "@/model";

export const promptsAtom = atom<promptResponse[]>([]);
export const queryAtom = atom("");
export const statusAtom = atom<"loading" | "initial" | "loaded">("initial");
