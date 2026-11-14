import { demoContent } from "@guiderail/core/demo";
import { createDataset } from "./dataset.js";

/**
 * The dataset the app shows when it is given no other: the demo corpus.
 * This is the only module that imports content.
 */
export const demoDataset = createDataset(demoContent);
