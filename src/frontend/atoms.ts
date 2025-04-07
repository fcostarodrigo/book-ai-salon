import { atom } from "jotai";
import type { QueryResponse } from "@/model";

export const queriesAtom = atom<QueryResponse[]>([]);
