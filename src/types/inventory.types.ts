import { z } from "zod";

import { adjustInventorySchema } from "../validators/productInvetory.validator";

export type AdjustInventoryDto = z.infer<typeof adjustInventorySchema>;