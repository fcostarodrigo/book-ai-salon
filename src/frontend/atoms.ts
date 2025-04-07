import { atom } from "jotai";
import type { promptResponse } from "@/model";

export const promptsAtom = atom<promptResponse[]>([]);
